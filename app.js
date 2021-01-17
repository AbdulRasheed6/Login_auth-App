const express  = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app =  express();

//passport  config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;


// Connect to mongo and return a Promise
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected ...'))
    .catch(err => console.log(err));



//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


//Bodyparser
app.use(express.urlencoded({ extended: false}));

// Express session (middleware)

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// connect flash
app.use(flash());

//Global Variables
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//  Routes

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const Port = process.env.PORT || 5000;

app.listen(Port, console.log(`sever started on port ${Port}`));