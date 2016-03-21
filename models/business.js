var mongoose = require('mongoose');

var businessSchema = new mongoose.Schema({
  business_id: String,
  name: String,
  address: String,
  city: String,
  state: String,
  postal_code: String,
  phone_number: String
});

module.exports = mongoose.model('Business', businessSchema);
