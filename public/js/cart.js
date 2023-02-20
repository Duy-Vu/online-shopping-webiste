const addToCart = productId => {
  // TODO 9.2
  // use addProductToCart(productId), available already from /public/js/utils.js
  // call updateProductAmount(productId) from this file
  addProductToCart(productId);
  updateProductAmount(productId);
};

const decreaseCount = productId => {
  // TODO 9.2
  // Decrease the amount of products in the cart, /public/js/utils.js provides decreaseProductCount()
  // Remove product from cart if amount is 0,  /public/js/utils.js provides removeElement = (containerId, elementId)
  decreaseProductCount(productId);
  updateProductAmount(productId);
};

const updateProductAmount = productId => {
  // TODO 9.2
  // - read the amount of products in the cart, /public/js/utils.js provides getProductCountFromCart(productId)
  // - change the amount of products shown in the right element's innerText
  // - if amount is 0,  /public/js/utils.js provides removeElement = (containerId, elementId)
  const new_amount = getProductCountFromCart(productId);
  if (!new_amount) {
    removeElement("cart-container", `product-${productId}`);
  }
  else {
    document.getElementById(`amount-${productId}`).innerText = new_amount + 'x';
  }
};

const placeOrder = async() => {
  // TODO 9.2
  // Get all products from the cart, /public/js/utils.js provides getAllProductsFromCart()
  // show the user a notification: /public/js/utils.js provides createNotification = (message, containerId, isSuccess = true)
  // for each of the products in the cart remove them, /public/js/utils.js provides removeElement(containerId, elementId)
  getAllProductsFromCart().forEach(
    product => removeElement('cart-container', `product-${product.name}`)
  );
  clearCart();
  createNotification("Successfully created an order!", 'cart-container');
}
(async() => {
  // TODO 9.2
  // - get the 'cart-container' element
  // - use getJSON(url) to get the available products
  // - get all products from cart
  // - get the 'cart-item-template' template
  // - for each item in the cart
  //    * copy the item information to the template
  //    * remember to add event listeners for cart-minus-plus-button cart-minus-plus-button elements. querySelectorAll() can be used to select all elements with each of those classes, then its just up to finding the right index
  // - in the end remember to append the modified cart item to the cart
  
  const products = await getJSON('/api/products');
  const baseContainer = document.getElementById('cart-container');
  const cartTemplate = document.getElementById("cart-item-template");

  if (products.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No products';
    baseContainer.append(p);
    return;
  }
  
  products.forEach(product => {
    const id = product._id;
    if (getProductCountFromCart(id)){
      const cartClone = cartTemplate.content.cloneNode(true);

      cartClone.querySelector('.item-row').id = `product-${id}`;
      cartClone.querySelectorAll('[class]').forEach(elem => {
        if (elem.className.split('-')[0] === 'product') {
          const prop = elem.className.split('-')[1];
          elem.id = `${prop}-${id}`;
          if (prop !== 'amount') {
            elem.textContent = product[prop];
          }
        }
      });
      
      const plusButton = cartClone.querySelectorAll("button")[0];
      plusButton.id = `plus-${id}`;
      plusButton.addEventListener('click', () => addToCart(id))

      const minusButton = cartClone.querySelectorAll("button")[1];
      minusButton.id = `minus-${id}`;
      minusButton.addEventListener('click', () => decreaseCount(id))

      baseContainer.append(cartClone);
      updateProductAmount(id);
    }
  })
  document.getElementById("place-order-button").addEventListener('click', async function(event) {
    event.preventDefault();
    await placeOrder();
  });
  
})();