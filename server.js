 let express = require('express');

 let morgan = require('morgan');

 let bodyParser = require('body-parser');

 let cors = require('cors');

 let passport = require('passport');

 let config = require('./config/main');

 let router = require('./routes/routes');
 
 let app = express();

 let mongoose = require('mongoose');

 mongoose.connect(config.database);

 //middleware for parsing body from request
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended:false}));
 app.use(cors());

 //middleware for logging 
 app.use(morgan('dev'));

 app.listen(config.port,()=>console.log('Up and running at',config.port));

 router(app);