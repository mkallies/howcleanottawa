var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/user');
var Comment = require('../models/comment');
// need middleware - only users can create/edit comments


// Get comments associated with business
router.get('/api/ottawa/:business/comments/new', function(req, res) {


});

// Create comment for business
router.post('/api/ottawa/:business/comments', function(req, res) {

});

// Get comment to edit


// Edit comment


// Delete comment
