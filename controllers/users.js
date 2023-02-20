const http = require('http');
const User = require('../models/user');
const responseUtils = require('../utils/responseUtils');

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @returns {object} response containing all users' data in payload with status
 * code 200
 */
const getAllUsers = async response => {
  const allUser = await User.find({});
  return responseUtils.sendJson(response, allUser, 200);
};

/**
 * Send user data corresponding with the userID as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} userId ID of a user
 * @returns {object} response containing user data or response with status code
 * 404 Not Found
 */
 const viewUser = async(response, userId) => {
  const viewingUser = await User.findById(userId).exec();
  if (!viewingUser) {
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, viewingUser, 200);
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} userId ID of a user
 * @param {object} currentUser mongoose document object of current log-in user
 * @returns {object} response with copied data of deleted user or response with
 * status code 404 Not Found or 400 Bad Request
 */
const deleteUser = async(response, userId, currentUser) => {
  // Current user is not allow to delete his/her own data
  const viewingUser = await User.findById(userId).exec();
  if (!viewingUser) {
    return responseUtils.notFound(response);
  }
  if (userId === currentUser.id){
    return responseUtils.badRequest(response, "Bad request");
  }

  await User.deleteOne({ _id: userId }); 
  return responseUtils.sendJson(response, viewingUser, 200);
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {string} userId ID of a user
 * @param {object} currentUser mongoose document object of current log-in user
 * @param {object} userData data from request body
 * @returns {object} response with copied data of updated user or response with
 * status code 404 Not Found or 400 Bad Request
 */
const updateUser = async(response, userId, currentUser, userData) => {
  // Current user is not allow to change his/her own role
  if (userId === currentUser.id){
    return responseUtils.badRequest(response, "Updating own data is not allowed");
  }
  const viewingUser = await User.findById(userId).exec();
  if (!viewingUser) {
    return responseUtils.notFound(response);
  }
  viewingUser.role = userData.role;
  await viewingUser.save()
    .then(() => {
      return responseUtils.sendJson(response, viewingUser, 200);
    })
    .catch((error) => {
      return responseUtils.badRequest(response, error); 
    });
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response HTTP response object
 * @param {object} userData data from request body
 * @returns {object} response with copied data of registered user or response
 * with status code 400 Bad Request
 */
const registerUser = async(response, userData) => {
  // Check for duplicated email
  /* if(await User.findOne({ email: userData.email }).exec()) { 
    return responseUtils.badRequest(response, 'Email is already in use');
  } */
  delete userData.role;
  const newUser = new User(userData);
  await newUser.save()
    .then(() => {
      return responseUtils.createdResource(response, newUser);
    })
    .catch((error) => {
      return responseUtils.badRequest(response, error); 
    });
};

module.exports = { getAllUsers, viewUser, deleteUser, updateUser, registerUser };