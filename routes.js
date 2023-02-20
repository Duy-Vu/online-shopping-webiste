const http = require('http');
const { getCurrentUser } = require('./auth/auth');
const { renderPublic } = require('./utils/render');
const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const userController = require('./controllers/users');
const productController = require('./controllers/products');
const orderController = require('./controllers/orders');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['POST', 'GET'],
  '/api/orders' : ['POST', 'GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with correct header for an OPTIONS request
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept'
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix second part of the url
 * @returns {boolean} whether there is an ID component in the last part of the url or not
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} whether the URL match the pattern /api/users/{id}
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

/**
 * Does the URL match /api/products/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} whether the URL match the pattern /api/products/{id}
 */
const matchProductId = url => {
  return matchIdRoute(url, 'products');
};

/**
 * Does the URL match /api/orders/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} whether the URL match the pattern /api/orders/{id}
 */
 const matchOrderId = url => {
  return matchIdRoute(url, 'orders');
};

/**
 * Handle HTTP request received by the server
 * 
 * @param {http.IncomingMessage} request HTTP request message sent by the client to a server 
 * @param {http.ServerResponse} response HTTP response object created internally by an HTTP server  
 * @returns {object} response message corresponding to the request (depending on methods, "Authorization" header, credentials,...)
 */
const handleRequest = async(request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;
  
  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  // Handle single user
  // Implement view, update and delete a single user by ID (GET, PUT, DELETE)
  if (matchUserId(filePath)) {
    const currentUser = await getCurrentUser(request);
    if(!currentUser) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (currentUser.role !== "admin") { 
      return responseUtils.forbidden(response);
    }
    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }

    const userID = filePath.split('/')[3];
    switch (method.toUpperCase()) {
      case "GET":
        return userController.viewUser(response, userID);
      case "PUT": {
        const parseJson = await parseBodyJson(request);
        return userController.updateUser(response, userID, currentUser, parseJson);
      }
      case "DELETE":
        return userController.deleteUser(response, userID, currentUser);
    }
  }

  // Handle single product
  if (matchProductId(filePath)) {
    const currentUser = await getCurrentUser(request);
    if(!currentUser) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }

    const productID = filePath.split('/')[3];
    const httpMethod = method.toUpperCase();
    if (httpMethod === "GET") {
      return productController.viewProduct(response, productID);
    }
    else {
      if (currentUser.role !== "admin") { 
        return responseUtils.forbidden(response);
      }
      switch (httpMethod) {
        case "PUT": {
          const parseJson = await parseBodyJson(request);
          return productController.updateProduct(response, productID, parseJson);
        }
        case "DELETE":
          return productController.deleteProduct(response, productID);
      } 
    } 
  }

  // View single order
  if (matchOrderId(filePath)) {
    const currentUser = await getCurrentUser(request);
    if(!currentUser) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }
    const orderID = filePath.split('/')[3];
    if ( method.toUpperCase() === "GET" ){
      return orderController.viewOrder(response, orderID, currentUser);
    }
  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  // Register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {
    // Fail if not a JSON request, don't allow non-JSON Content-Type
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    // TODO: 8.4 Implement registration
    // You can use parseBodyJson(request) method from utils/requestUtils.js to parse request body.
    const userObj = await parseBodyJson(request);
    return userController.registerUser(response, userObj);
  }

  // Add new product
  if (filePath === '/api/products' && method.toUpperCase() === 'POST') {
    const currentUser = await getCurrentUser(request);
    if(!currentUser) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (currentUser.role !== "admin") { 
      return responseUtils.forbidden(response);
    }
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    const productObj = await parseBodyJson(request);
    return productController.addProduct(response, productObj);
  }

  // Add new order
  if (filePath === '/api/orders' && method.toUpperCase() === 'POST') {
    const currentUser = await getCurrentUser(request);
    if(!currentUser) {
      return responseUtils.basicAuthChallenge(response);
    }
    if (currentUser.role === "admin") { 
      return responseUtils.forbidden(response);
    }
    if (!isJson(request)) {
      return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }

    const productObj = await parseBodyJson(request);
    return orderController.addOrder(response, productObj, currentUser);
  }

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
    // TODO 8.4 Replace the current code in this function.
    // TODO: 8.5 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    // find all users
    
    const currentUser = await getCurrentUser(request);
    // Header is properly encoded
    // Accept & Authorization header is not missing/empty, 
    // Credentials are correct 
    if(!currentUser) {
      return responseUtils.basicAuthChallenge(response);
    }
    // Deny access from all users except admins
    else if (currentUser.role !== "admin") { 
      return responseUtils.forbidden(response);
    } else {
      return userController.getAllUsers(response);
    }
  }

  // GET all products
  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {
    if(!request.headers.authorization) {
      return responseUtils.basicAuthChallenge(response);
    }
    const currentUser = await getCurrentUser(request);
    if(!currentUser) {
      return responseUtils.basicAuthChallenge(response);
    }
    return productController.getAllProducts(response);
  }

  // GET all orders
  if (filePath === '/api/orders' && method.toUpperCase() === 'GET') {
    if(!request.headers.authorization) {
      return responseUtils.basicAuthChallenge(response);
    }
    const currentUser = await getCurrentUser(request);
    if(!currentUser) {
      return responseUtils.basicAuthChallenge(response);
    }
    return orderController.getAllOrders(response, currentUser);
  }

};

module.exports = { handleRequest };