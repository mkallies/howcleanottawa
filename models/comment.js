var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  text: String,
  business_id: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  username: String
  }
});
