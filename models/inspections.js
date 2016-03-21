var mongoose = require('mongoose');

var inspectionSchema = new mongoose.Schema({
  business_id: String,
  score: String,
  date: String,
});

module.exports = mongoose.model('Inspections', inspectionSchema);
