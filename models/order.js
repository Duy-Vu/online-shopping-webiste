const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Product = require('./product');

const orderedItemSchema = new Schema({
  product: {
    _id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      trim: true
    },
    name: {
      type: String, 
      minlength: 1, 
      required: true,            
      trim: true
    },
    description : {
      type: String, 
      trim: true
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: function(p) {
          return p > 0;
        }
      }, 
      description: "price of one product in Euros, without the Euro sign (€). " +
        "Euros and cents are in the same float, with cents coming after the decimal point."
    },
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
    validate: {
      validator: function(q) {
        return Number.isInteger(q);
      }
    }
  }
});

const SCHEMA_DEFAULTS = {
  items: {
    minLength: 1
  }
};

const orderSchema = new Schema({
  // _id (Use Mongoose automatically created id)
  // type: String
  // format: mongo object ID
  // example: f398d576bcaf672382ff2ac6

  // customerId (required)
  // type: String
  // format: mongo object ID
  // example: f398d576bcaf672382ff2ac6
  customerId: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User', 
    required: true,
    trim: true
  },

  // items (required)
  // type: array
  // minimum length: 1
  // items: Array[OrderedItem]
  items: {
    type: [orderedItemSchema], // 
    required: true,
    //items: orderedItemSchema,
    //minItems: SCHEMA_DEFAULTS.items.minLength,
    validate: {
      validator: function(it) {
        return it.length >= SCHEMA_DEFAULTS.items.minLength;
      }
    }, 
    description: "Array of order items. Each item must have a COPY of the product information (no image) and the amount of products ordered"
  }
});

orderSchema.set('toJSON', { virtuals: false, versionKey: false});
orderedItemSchema.set('toJSON', { virtuals: false, versionKey: false});

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;