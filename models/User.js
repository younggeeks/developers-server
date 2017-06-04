
let mongoose = require('mongoose');

let bcrypt =  require('bcrypt');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['developer','admin','super'],
        default:'developer'
    },
    profile:{
        firstname:String,
        lastname:String,
        regnumber:String,
        course:String,
        interests:[String]
    }
},
    {
        timestamps:true
    });


//encrypting password before saving User document
userSchema.pre('save',function (next) {
    let user = this, SALT_FACTOR=10;
    if(!user.isModified('password')){
        next();
    }
    bcrypt.genSalt(SALT_FACTOR,null,function (error, salt) {
        if(error) return next(error);
        bcrypt.hash(user.password,salt,function (error, hash) {
            if(error) return next(error);
            user.password = hash;
            next();
        })
    })
});

//comparing password during Login
userSchema.methods.comparePassword= function (enteredPassword, cb) {
    bcrypt.compare(enteredPassword,this.password,function (error, isMatch) {
        //If there is an error we call the callback function and pass an error as first argument
        if(error) return cb(error,false);

        //If no error was returned and the credentials didn't match we pass null and isMatch is false
        if(!isMatch){
            return cb(null,false);
        }
        //If credentials were accepted we return null as first parameter !
        return  cb(null,isMatch);
    });
};

module.exports = mongoose.model('User',userSchema);


