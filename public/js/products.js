/**
 * Add product to cart.
 * 
 * @param {string} productId ID of the product
 * @param {string} productName Name of the product
 */
const addToCart = (productId, productName) => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // /public/js/utils.js also includes createNotification() function
  addProductToCart(productId);
  createNotification(`Added ${productName} to cart!`, 'notifications-container');
};

(async() => {
  //TODO 9.2 
  // - get the 'products-container' element
  // - get the 'product-template' element
  // - use getJSON(url) to get the available products
  // - for each of the products:
  //    * clone the template
  //    * add product information to the template clone
  //    * remember to add an event listener for the button's 'click' event, and call addToCart() in the event listener's callback
  // - remember to add the products to the the page

  const products = await getJSON('/api/products');

  const baseContainer = document.getElementById('products-container');
  const productTemplate = document.getElementById('product-template');

  if (products.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No products';
    baseContainer.append(p);
    return;
  }
  products.forEach(product => {
    const productContainerClone = productTemplate.content.cloneNode(true);
    const id = product._id;
    const name = product.name;

    productContainerClone.querySelector('.item-row').id = `product-${id}`;
    productContainerClone.querySelectorAll('[class]').forEach(elem => {
      const prop = elem.className.split('-')[1];
      if (!product[prop]) return;
      elem.id = `${prop}-${id}`;
      elem.textContent = product[prop];
    });
    
    const button = productContainerClone.querySelector('button')
    button.id = `add-to-cart-${id}`;
    button.addEventListener('click', () => addToCart(id, name));

    baseContainer.append(productContainerClone);
  });

})();