const http = require('http');
const {getCredentials} = require('../utils/requestUtils');
const User = require('../models/user');

/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request HTTP request message sent by the client to a server 
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // TODO: 9.6  Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user
  const cre = getCredentials(request);
  if (!cre) return null;
  const [querryEmail, querryPassword] = cre;
  const user = await User.findOne({ email: querryEmail }).exec();
  if (!user) {
    return null;
  }
  if (!(await user.checkPassword(querryPassword))) {
    return null;
  }
  return user;
};

module.exports = { getCurrentUser };