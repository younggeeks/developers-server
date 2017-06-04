let  AuthenticationController = require('../controllers/Authentication'),
    ProjectController = require('../controllers/projects'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');


let requireAuth = passport.authenticate('jwt',{session:false});

let requireLogin = passport.authenticate('local',{session:false});

module.exports =  function (app) {
    let apiRoutes=express.Router();
    let authRoutes=express.Router();
    let projectsRoutes =express.Router();

    apiRoutes.use('/auth',authRoutes);

    authRoutes.post('/register',AuthenticationController.register);
    authRoutes.post('/login',requireLogin,AuthenticationController.login);

    projectsRoutes.route('/projects').get(ProjectController.all).post(ProjectController.insert);
    projectsRoutes.route('/projects/:id').get(ProjectController.show);
    // projectsRoutes.post('/projects')



    authRoutes.get('/protected',requireAuth,AuthenticationController.roleAuthorization(['developer','snitch']),(req,res)=>{
        res.json({success:true,message:'This is so awesome'});
    });
    app.use('/api',apiRoutes);
    app.use('/api/',projectsRoutes);
};

