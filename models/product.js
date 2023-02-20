const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA_DEFAULTS = {
  name: {
    minLength: 1
  },
  price: {
    minPrice: 0,
    precision: 2
  },
  image: {
    // Validate uri: https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php
    match: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
  }
};

const productSchema = new Schema({
  // _id (Use Mongoose automatically created id)
  // type: String
  // format: mongo object ID
  // example: f398d576bcaf672382ff2ac6

  // name (required)
  // type: String
  // example: Red 2*4 building block
  name: {
    type: String, 
    required: true,
    trim: true,
    minLength: SCHEMA_DEFAULTS.name.minLength
  },

  // price (required)
  // type: Number
  // format: float
  // minimum: > 0
  // example: 1.15 
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function(p) {
        return p > SCHEMA_DEFAULTS.price.minPrice;
      }
    }, 
    description: "price of one product in Euros, without the Euro sign (€). " +
      "Euros and cents are in the same float, with cents coming after the decimal point."
  },
  
  // image
  // type: String
  // format: uri
  image: {
    type: String, 
    trim: true,
    match: SCHEMA_DEFAULTS.image.match,   
    description: "Adding product images to the Web store API and pages is a Level 2 development grader substitute"
  },
  
  // description
  // type: Sstring
  // example: Classic Danish-style red 2*4 plastic building block
  description: {
    type: String, 
    trim: true
  }
});

productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;