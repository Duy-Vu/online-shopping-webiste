
// 1. 
// 

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { handleRequest } = require('../../routes');

const productsUrl = '/api/products';
const ordersUrl = '/api/orders';
const contentType = 'application/json';
chai.use(chaiHttp);

const Product = require('../../models/product');

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random()
      .toString(36)
      .substr(2, 9)
      .trim();
  } while (str.length < len);

  return str.substr(0, len);
};

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));

const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };

const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);
const customerCredentials = encodeCredentials(customerUser.email, customerUser.password);

const getTestProduct = () => {
  return {
    name: generateRandomString(),
    price: Math.floor(Math.random() * 50000) / 100,
    image: `http://www.images.com/${generateRandomString()}.jpg`,
    description: generateRandomString(75)
  };
};

const getTestOrder = () => {
  const product  = getTestProduct();
  return {
    items: [
      {
        product: {
          _id: Math.random().toString(36).substr(2, 9),
          name: product.name,
          price: product.price,
          description: product.description
        },
        quantity: Math.floor(Math.random() * 5) + 1
      }
    ]
  };
};

describe('Own test: handleRequest()', () => {
  describe('Updating products: PUT /api/products/{id}', () => {
    const product = {
      name: 'Test Product',
      price: 45.75,
      image: 'http://www.google.com/',
      description: 'A mysterious test product'
    };

    let testProduct;
    let url;
    let unknownId;

    beforeEach(async () => {
      testProduct = await Product.findOne({}).exec();
      url = `${productsUrl}/${testProduct.id}`;
      unknownId = testProduct.id
        .split('')
        .reverse()
        .join('');
    });

    it('should update product when admin credentials are received', async () => {
      const response = await chai
        .request(handleRequest)
        .put(url)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send(product);

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('_id', 'name', 'description', 'image', 'price');
      expect(response.body._id).to.equal(testProduct.id);
      expect(response.body.name).to.equal(product.name);
      expect(response.body.description).to.equal(product.description);
      expect(response.body.image).to.equal(product.image);
      expect(response.body.price).to.equal(product.price);
    });

    it('should allow partial update of product properties', async () => {
      const productWithPartialData = { ...product };
      delete productWithPartialData.description;
      delete productWithPartialData.image;

      const response = await chai
        .request(handleRequest)
        .put(url)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send(productWithPartialData);

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('_id', 'name', 'description', 'image', 'price');
      expect(response.body._id).to.equal(testProduct.id);
      expect(response.body.description).to.equal(testProduct.description);
      expect(response.body.image).to.equal(testProduct.image);
      expect(response.body.name).to.equal(product.name);
      expect(response.body.price).to.equal(product.price);
    });

    it('should respond with "400 Bad Request" when name is empty', async () => {
      const response = await chai
        .request(handleRequest)
        .put(url)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send({ name: '' });

      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is not a number', async () => {
      const response = await chai
        .request(handleRequest)
        .put(url)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send({ price: generateRandomString() });

      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is 0 (zero)', async () => {
      const response = await chai
        .request(handleRequest)
        .put(url)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send({ price: 0 });

      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is negative', async () => {
      const response = await chai
        .request(handleRequest)
        .put(url)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send({ price: -2.5 });

      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with status code 404 when product does not exist', async () => {
      const response = await chai
        .request(handleRequest)
        .put(`${productsUrl}/${unknownId}`)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send(product);

      expect(response).to.have.status(404);
    });
  });
  
  describe('Create a new product: POST /api/products', () => {
    it('should respond with "400 Bad Request" when name is missing', async () => {
      const product = getTestProduct();
      delete product.name;

      const response = await chai
        .request(handleRequest)
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send(product);

      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "400 Bad Request" when price is missing', async () => {
      const product = getTestProduct();
      delete product.price;

      const response = await chai
        .request(handleRequest)
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send(product);

      expect(response).to.have.status(400);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('error');
    });

    it('should respond with "201 Created" when product creation is successful', async () => {
      const product = getTestProduct();

      const response = await chai
        .request(handleRequest)
        .post(productsUrl)
        .set('Accept', contentType)
        .set('Authorization', `Basic ${adminCredentials}`)
        .send(product);

      const createdProduct = await Product.findOne({
        name: product.name,
        image: product.image
      }).exec();

      const { name, price, image, description } = createdProduct;
      expect(response).to.have.status(201);
      expect(response).to.be.json;
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.all.keys('_id', 'name', 'price', 'description', 'image');
      expect(response.body).to.include({
        _id: createdProduct.id,
        name,
        price,
        image,
        description
      });
    });
  });
});