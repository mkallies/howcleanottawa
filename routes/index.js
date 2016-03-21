var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var User = require('../models/user');
var Business = require('../models/business');
var Violations = require('../models/violations');
var Inspections = require('../models/Inspections');


router.get('/', function(req, res) {
  res.render('index');
});

//register form
router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      return res.render('register', {error: err.message});
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Successfully signed up!  Nice to meet you ' + req.body.username);
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local',
  {
  successRedirect: '/',
  failureRedirect: '/login'
  }), function(req, res) {
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/');
});

/*
May need to use later--
router.get('/api/business', function(req, res) {
  var searchQuery = 'bridge';
  Business.find({score: new RegExp(searchQuery, 'i')}, function(err, allBusinesses) {
    if (err) {
      console.log(err);
    } else {
      var test = allBusinesses[0].business_id;
      Inspections.find({business_id: test}, function(err, violations) {
        if (err) {
          console.log(err);
        } else {
          console.log(violations);
        }
      });
      res.json(allBusinesses);
    }
  });
});
*/

// SEARCH ALL BUSINESSES
router.get('/api/ottawa', function(req, res) {
  var searchQuery = req.query.search.split(' ').join('_');
  console.log(searchQuery);
  request("http://app01.ottawa.ca/select?qt=fsi_s_en&q=fname:"+ searchQuery +"%20AND%20fs_fg:%22Food%20Safety%22&start=0&sort=fs_fnm%20asc&wt=json", function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var results = JSON.parse(body);
      console.log(results.response.docs);
      res.render('results', {results: results.response.docs});
    }
  });
});

router.get('/api/ottawa/:business', function(req, res) {
  var businessQuery = req.params.business;
  request("http://app01.ottawa.ca/select?q=fs_fdid:"+ businessQuery+"&wt=json", function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var results = JSON.parse(body);
      var inspections = parseInspections(results.response.docs[0]);
      results = results.response.docs;
      inspections = results[0].fs_insps;
      //console.log(inspections[4].bodies);
      //console.log(inspections);
      res.render('info', {results: results, inspections: inspections});
    }
  });
});

function parseInspections(doc) {
  var fs_insp = doc.fs_insp_en;
  doc.fs_insps = [];
  for (var i = 0; i < fs_insp.length; i++) {
    var insp = {};
    var inspDoc = fs_insp[i].split('+++');
    var inspHeader = inspDoc[0].split('|||');
    var inspBody = (inspDoc[1]) ? inspDoc[1].split('!!!') : false;
    var inspCommentsCodeDate = inspHeader[2].split(' ', 1);
    var inspDateRaw = new Date(inspCommentsCodeDate);
    inspCommentsCodeDate = inspCommentsCodeDate[0].split('-', 3);
    var inspDate = new Date(inspCommentsCodeDate[0], inspCommentsCodeDate[1], inspCommentsCodeDate[2]);
    insp.header = {
      date: inspDate.toDateString(),
      dateRaw: inspDateRaw,
      isCompliant : (inspHeader[3] == '1') ? true : false
    };
    if (inspBody) {
      insp.bodies = [];
      for (var j = 0; j < inspBody.length; j++) {
        var inspQuestionsComments = inspBody[j].split('(((');
        var inspQuestions = inspQuestionsComments[0].split('***');
        var inspAllComments = [''];
        var inspComments = [''];
        var inspCode = [''];
        if(inspQuestionsComments[1]) {
          inspAllComments = inspQuestionsComments[1].split('###');
          for (var k = 0; k < inspAllComments.length; k++) {
            var inspCommentsCode = inspAllComments[k].split('[[[');
            inspComments[k] = inspCommentsCode[0];
            if (inspCommentsCode[1])
              inspCode[k] = inspCommentsCode[1].trim();
          }
        }
        insp.bodies.push({
          question: {
            isCompliance: inspQuestions[1].trim(),
            complianceText : inspQuestions[2].trim(),
            isCritical: inspQuestions[3].trim(),
            criticalText: inspQuestions[4].trim(),
            category: inspQuestions[6].trim(),
            questionText: inspQuestions[8].trim()
          },
          comments : inspComments,
          code : inspCode
        });
      }
    }
    doc.fs_insps.push(insp);
  }
  return doc;
}

module.exports = router;
