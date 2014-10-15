var express = require('express');
var router = express.Router();
var passport = require('passport');

//base url: auth
router.get('/', function(req, res){
  res.render('login', {
    title: "Login"
  });
});

router.get(
  '/facebook',
  passport.authenticate(
    'facebook', {
      scope: 'email'
    }
  )
);

router.get(
  '/facebook/callback',
  passport.authenticate(
    'facebook', {
      failureRedirect: '/auth'
    }
  ), function(req, res){
    // if user has been authenticated, this is our route handler
    res.redirect('/');
  }
);

router.get(
  '/logout',
  function(req, res){
    req.logout();
    res.redirect('/auth');
  }
);

module.exports = router;