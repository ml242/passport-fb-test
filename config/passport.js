var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');

// session serialization

passport.serializeUser(function(user, next){
  next(null, user._id);
});

passport.deserializeUser(function(userId, next){
  user = User.findById(userId, function(err, user){
    // if no error, it will be passed in as null and the middleware will continue
    next(err, user);
  });
});


// strategies

var fbStrategy = new FacebookStrategy({
  clientID: "374229142739576",
  clientSecret: "61e9be424df1f5a699a2652806def805",
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, next){
  User.findOne({fbId: profile.id}, function(err, user){
    // user is found already
    if (user){
      next(null, user);
    } else {
      // user was not found, save them and then give access
      var newUser = new User({
        fbId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      });
      newUser.save(function(err, newUser){
        if(err){
          // halt the execution our db is down
          throw err;
        } else {
          next(null, user);
        }
      });
    }
  });
});


module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/auth');
  }
};

passport.use(fbStrategy);