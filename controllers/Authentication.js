let jwt = require('jsonwebtoken');

let User = require('../models/User');

let config = require('../config/main');

function generateToken(user) {
    return jwt.sign(user,config.secret,{expiresIn:10080});
}

function setUserInfo(user) {
    console.log(user);
    return {
        id:user._id,
        email:user.email,
        role:user.role,
        profile:{
            firstname:user.profile.firstname,
            lastname:user.profile.lastname,
            interests:user.profile.interests
        }

    }
}


exports.login=function (req, res) {
    console.log('we are trying to login');
    let userInfo = setUserInfo(req.user);
    res.status(200).json({
        token:'JWT '+generateToken(userInfo),
        user:userInfo
    })
};

exports.register = function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let firstname= req.body.firstname;
    let lastname = req.body.lastname;
    let regno = req.body.regno;
    let course = req.body.course;
    let interests = req.body.interest;

    if(!email){
        return res.status(422).json({success:false,message:'Email Address Is Required'})
    }
    if(!password){
        return res.status(422).json({success:false,message:'Password Is Required'})
    }
    if(!firstname){
        return res.status(422).json({success:false,message:'First Name Is Required'})
    }
    if(!lastname){
        return res.status(422).json({success:false,message:'Last Name Is Required'})
    }
    if(!regno){
        return res.status(422).json({success:false,message:'Registration Number Is Required'})
    }
    if(!course){
        return res.status(422).json({success:false,message:'Course is Is Required'})
    }
    let newUser = new User({
        email:email,
        password:password,
        profile:{
            firstname:firstname,
            lastname:lastname,
            regnumber:regno,
            interests:interests,
            course:course,
        }
    });

    newUser.save(newUser,function (error, user) {
        if(error) {
            return res.json({
                success:false,
                message:'Email Address is already taken'
            });
        }
        let userInfo = setUserInfo(user);

       return res.status(201).json({
            token:'JWT '+generateToken(userInfo),
            user:userInfo
        });
    })
};

exports.roleAuthorization=function (roles) {
    console.log('Allowed roles are ',roles);
    return (req,res,next)=>{
        let user = req.user;

        User.findById(user._id,(error,foundUser)=>{
            if(error) {
                res.status(422).json({ error: 'No User found'});
                return next(error);
            }
            if(roles.includes(foundUser.role)){
                console.log('This user is allowed access');
               return next();
            }
            console.log('this user is not allowe access');
            return  res.status(401).json({error: 'You are not authorized to view this content'});
             // next('Hauruhusiwi');

        })
    };
}
