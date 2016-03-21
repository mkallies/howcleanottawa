var mongoose = require('mongoose');

var violationsSchema = new mongoose.Schema({
  business_id: String,
  date: String,
  code: String,
  city: String,
  description: String
});

module.exports = mongoose.model('Violations', violationsSchema);
