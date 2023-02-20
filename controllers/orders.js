const http = require('http');
const Order = require('../models/order');
const responseUtils = require('../utils/responseUtils');

/**
 * Send all orders as JSON
 * 
 * @param {http.ServerResponse} response HTTP response object
 * @param {object} currentUser mongoose document object of current log-in user
 * @returns {object} response containing all orders from all users in payload 
 * with status code 200
 */
const getAllOrders = async (response, currentUser) => {
  switch ( currentUser.role ) { 
    case "admin": {
      const allOrders = await Order.find({});
      return responseUtils.sendJson(response, allOrders, 200);
    }
    case "customer": {
      const allOrders = await Order.find({ 
        customerId: require('mongoose').Types.ObjectId(currentUser.id) 
      }).exec();
      return responseUtils.sendJson(response, allOrders, 200); 
    }
  }
};

/**
 * Send all orders data of an user as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} orderId ID of the order
 * @param {object} currentUser mongoose document object of current log-in user
 * @returns {object} response containing all orders a user in payload with 
 * status code 200 or response with status code 404 Not Found
 */
 const viewOrder = async(response, orderId, currentUser) => {
  const viewingOrder = await Order.findById(orderId).exec(); 
  if (!viewingOrder) {
    return responseUtils.notFound(response);
  }
  switch ( currentUser.role ) { 
    case "admin": {
      return responseUtils.sendJson(response, viewingOrder, 200);
    }
    case "customer": {
      if (viewingOrder.customerId.toString() === currentUser.id) {
        return responseUtils.sendJson(response, viewingOrder, 200);
      }
      return responseUtils.notFound(response);
    }
  }
};

/**
 * Add new order and send created order back as JSON     
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {object} orderData data from request body
 * @param {object} currentUser mongoose document object of current log-in user
 * @returns {object} response with copied data of new added order or response
 * with status code 400 Bad Request
 */
const addOrder = async(response, orderData, currentUser) => {    
  const newOrder = new Order({
    customerId : currentUser.id,
    items: orderData.items
  });
  await newOrder.save()
    .then(() => {
      return responseUtils.createdResource(response, newOrder);
    })
    .catch((error) => {
      return responseUtils.badRequest(response, error);   
    });
};

module.exports = { getAllOrders, viewOrder, addOrder };
