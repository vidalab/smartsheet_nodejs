var SmartsheetStrategy  = require('passport-smartsheet');
var client = require('smartsheet');

var models  = require('../models');

// expose this function to our app using module.exports
module.exports = function(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    models.User.find({where: { id: id } }).then(function(user) {
      done(null, user);
    });
  });

  passport.use(new SmartsheetStrategy({
      clientID : 'dqf6nq2lu5rd9yv42s',
      clientSecret: '1kmq6pr4q5fbyaxyqnt',
      callbackURL: "http://localhost:5000/auth/smartsheet/callback",
      scope: ["READ_USERS"],
      tokenURL: "https://api.smartsheet.com/2.0/token" //this tokenURL defaults to the deprecated 1.1 api, 
    },
    function(token, tokenSecret, profile, done) {
      var smartsheet = client.createClient({accessToken:token});

      smartsheet.users.getCurrentUser()
        .then(function(data) {
          models.User.find( {where: {smartsheet_id: data.id } } ).then(function(user) {
            if (user) {
              user.update({email: data.email, first_name: data.firstName,
                    last_name: data.lastName})
                  .then(function() {
                    return done(null, user);
                  });
            } else {
              models.User.create({ smartsheet_id: data.id, email: data.email, first_name: data.firstName,
                    last_name: data.lastName })
                .then(function(user) {
                  return done(null, user);
                })
            }
          });
        })
        .catch(function(error) {
          console.log(error);
          return done(null, null);
        });
      
      //User.findOrCreate({ smartsheetId: profile.id }, function (err, user) {
      //  return done(err, user);
      //});
    }
  ));
}