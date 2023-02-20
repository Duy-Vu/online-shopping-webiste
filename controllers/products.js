const http = require('http');
const Product = require('../models/product');
const responseUtils = require('../utils/responseUtils');

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response containing all products' info in payload with 
 * status code 200
 */
const getAllProducts = async response => {
  const allProducts = await Product.find({});
  return responseUtils.sendJson(response, allProducts, 200);
};

/**
 * Delete product and send deleted product as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} productId ID of the product
 * @returns {object} response with copied data of deleted product or response
 * with status code 404 Not Found or 400 Bad Request
 */
 const deleteProduct = async(response, productId) => {
  const viewingProduct = await Product.findById(productId).exec();
  if (!viewingProduct) {
    return responseUtils.notFound(response);
  }

  await Product.deleteOne({ _id: productId }); 
  return responseUtils.sendJson(response, viewingProduct, 200);
};

/**
 * Send product data as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} productId ID of the product
 * @returns {object} response containing product's info or response with status
 * code 404 Not Found
 */
 const viewProduct = async(response, productId) => {
  const viewingProduct = await Product.findById(productId).exec();
  if (!viewingProduct) {
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, viewingProduct, 200);
};

/**    
 * Update product and send updated product as JSON        
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} productId ID of the product
 * @param {object} productData data from request body
 * @returns {object} response with copied info of updated product or response with
 * status code 404 Not Found or 400 Bad Request
 */
const updateProduct = async(response, productId, productData) => {
  const viewingProduct = await Product.findById(productId).exec();
  if (!viewingProduct) {
    return responseUtils.notFound(response);
  }
  Object.keys(viewingProduct.toObject()).forEach(key => {
    if (productData[key] !== undefined) viewingProduct[key] = productData[key];
  });

  await viewingProduct.save()
    .then(() => {
      return responseUtils.sendJson(response, viewingProduct);
    })
    .catch((error) => {
      return responseUtils.badRequest(response, error);  
    });
};



/**
 * Add new product and send created product back as JSON     
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {object} productData data from request body
 * @returns {object} response with copied data of new added product or response
 * with status code 400 Bad Request
 */
const addProduct = async(response, productData) => {    
  const newProduct = new Product(productData);
  await newProduct.save()
    .then(() => {
      return responseUtils.createdResource(response, newProduct);
    })
    .catch((error) => {
      return responseUtils.badRequest(response, error); 
    });
};

module.exports = { getAllProducts, deleteProduct, viewProduct, updateProduct, addProduct };
