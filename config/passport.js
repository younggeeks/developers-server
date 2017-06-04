/**
 * Created by Samjunior on 04/04/2017.
 */

let passport = require('passport');

let User = require('../models/User');

let config = require('../config/main');

let passportJwt = require('passport-jwt');

let ExtractJwt = passportJwt.ExtractJwt;

let JwtStrategy = passportJwt.Strategy;

let LocalStrategy = require('passport-local').Strategy;

let localOptions = {
    usernameField:'email'
};

let jwtOptions ={
    jwtFromRequest:ExtractJwt.fromAuthHeader(),
    secretOrKey:config.secret
};

let localLogin = new LocalStrategy(localOptions,function (email,password,done) {
    User.findOne({email:email}).exec(function (error,user) {
        if(error) return done(error,false,{error:'an error occurred '+error});
        if(!user){
            console.log('an error occured  we don t have user');
             return done(null,false,{error:'Wrong Credentials , Please try again'});
        }
            user.comparePassword(password,function (error, isMatch) {
                if(error) return done(error,false);
                if(!isMatch){
                    return done(null,false,{error:'Wrong Credentials , Please try again'});
                }else{
                    return done(null,user);
                }
            })
    });
});

let jwtLogin = new JwtStrategy(jwtOptions,function(payload,done) {
    User.findById(payload.id,(error,user)=>{
        if(error) {
            return done(error,false,{error:'An Error Occurred'+error});
        }
        console.log('user is found',user);
        if(user){
            return done(null,user);
        }else{
            return done(null,false,{error:'Wrong Credentials , Please try again'});
        }
    });
});

passport.use(localLogin);
passport.use(jwtLogin);

