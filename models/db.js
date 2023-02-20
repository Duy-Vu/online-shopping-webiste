const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// Deafult MongoDB Connect URL
const DEFAULT_DBURL = 'mongodb://localhost:27017/WebShopDb';

/**
 * Get database connect URL.
 *
 * Reads URL from DBURL environment variable or
 * returns default URL if variable is not defined
 *
 * @returns {string} connection URL
 */
const getDbUrl = () => {
  const dbUrl = (process.env.DBURL === undefined) ? DEFAULT_DBURL : process.env.DBURL;
  console.log(dbUrl);
  return dbUrl;
};

/**
 * Connects to the database
 * 
 * @returns {void}
 */
function connectDB() {
  // Do nothing if already connected
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    mongoose
      .connect(getDbUrl(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true
      })
      .then(() => {
        mongoose.connection.on('error', err => {
          console.error(err);
        });

        mongoose.connection.on('reconnectFailed', handleCriticalError);
      })
      .catch(handleCriticalError);
  }
}

/**
 * Throwing error if connection fails
 * 
 * @param {object} err error emitted from an 'error' event
 * @returns {void}
 */
function handleCriticalError(err) {
  console.error(err);
  throw err;
}

/**
 * Disconnect all connections
 * 
 * @returns {void}
 */
function disconnectDB() {
  mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB, getDbUrl };