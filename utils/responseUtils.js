const http = require('http');
/**
 * Send proper basic authentication challenge headers
 *
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with basic authentication challenge headers
 */
const basicAuthChallenge = response => {
  response.writeHead(401, {'WWW-Authenticate': 'Basic'});
  return response.end();
};

/**
 * Send response containing JSON data with status code
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @param {object} payload data for the response's body
 * @param {number} code HTTP response status codes
 * @returns {object} response object containing data and status code
 */
const sendJson = (response, payload, code = 200) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  return response.end(JSON.stringify(payload));
};

/**
 * Send response with payload data and status code 201 for a succesful POST 
 * request method
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @param {object} payload data in the request
 * @returns {object} response containing the new created resource with status
 * code 201
 */
const createdResource = (response, payload) => {
  return sendJson(response, payload, 201);
};

/**
 * Send response with status code 204 indicating there is no content for the
 * request
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with status code 204
 */
const noContent = response => {
  response.statusCode = 204;
  return response.end();
};

/**
 * Send reponse with status code 400 if the server could not understand the
 * request 
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} errorMsg error message 
 * @returns {object} response containing error message and status code 400
 */
const badRequest = (response, errorMsg) => {
  if (errorMsg) return sendJson(response, { error: errorMsg }, 400);

  response.statusCode = 400;
  return response.end();
};

/**
 * Send response with status code 401 indicating authentication is required
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with status code 401
 */
const unauthorized = response => {
  response.statusCode = 401;
  return response.end();
};

/**
 * Send response with status code 403 indicating the client does not have access
 * rights to the content
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with status code 403
 */
const forbidden = response => {
  response.statusCode = 403;
  return response.end();
};

/**
 * Send response with status code 404 indicating the URL can not be recognized
 * or if the API endpoint is valid, but the resource itself does not exist
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with status code 404
 */
const notFound = response => {
  response.statusCode = 404;
  return response.end();
};

/**
 * Send response with status code 405 indicating the request method is not
 * allowed to use
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with status code 405
 */
const methodNotAllowed = response => {
  response.statusCode = 405;
  return response.end();
};

/**
 * Send response with status code 406 if the client does not accept JSON
 * responses
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with status code 406
 */
const contentTypeNotAcceptable = response => {
  response.statusCode = 406;
  return response.end();
};

/**
 * Send response with status code 500 indicating the server has encountered
 * unexpected condition
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response with status code 500
 */
const internalServerError = response => {
  response.statusCode = 500;
  return response.end();
};

/**
 * Send response with status code 302 indicating requested resource has been
 * temporarily moved to the URL in the Location header
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} page url where the requested resource has been moved to
 * @returns {object} response with status code 302
 */
const redirectToPage = (response, page) => {
  response.writeHead(302, { Location: page });
  return response.end();
};

module.exports = {
  sendJson,
  createdResource,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  methodNotAllowed,
  contentTypeNotAcceptable,
  internalServerError,
  basicAuthChallenge,
  redirectToPage
};