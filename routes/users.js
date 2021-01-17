const express = require('express');

const router = express.Router();

const bcrypt =  require('bcryptjs');

const passport = require('passport');

// User model 

const User = require('../config/models/User');

// login page
router.get('/login', (req, res) => res.render('login'));

// register page
router.get('/register', (req, res) => res.render('register'));
 
// register handle
router.post('/register', (req, res) =>{
    const { name, email, password, passwordval} = req.body;
    let errors = [];
    

    // check required fields
    if(!name || !email || !password || !passwordval) {
        errors.push({ message : 'please fill all fields'});
    }

    //check if passwords match
    if(password !==passwordval){
        errors.push({message: 'Passwords does not match'});
    }

    // check password length
    if(password.length <8) {
        errors.push({ message: 'password not strong enough'});
    }
    if(password.search(/[0-9]/) < 0) {
        errors.push({message: 'password  must contain at least a number'})
    }
    if(password.search(/[a-z]/i) < 0) {
        errors.push({message: 'password must contin at least a letter'})
    }
    if(errors.length > 0) {
        res.render('register', {
           errors,
           name,
           email,
           password,
           passwordval     
        });
    } else {
        // Validation passed
        User.findOne({ email: email } )
          .then(user =>{
            if(user) {
                //  User exists
                errors.push({ message: 'Email already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    passwordval     
                });
            }   else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                // Hash password
                bcrypt.genSalt(10, (err, salt) =>{
                    bcrypt.hash(newUser.password, salt, (err,hash) =>{
                        if(err) throw err;

                        // Set password to hashed
                        newUser.password= hash;
                        //save user
                        newUser.save()
                          .then(user =>{
                              req.flash('success_message', ' You are now registered, Login fam and we hope you have a great experience ')
                              res.redirect('/users/login');
                          })
                          .catch(err => console.log(err))
                    })
                })
            }
          })
    }

});

// login Handle
router.post('/login', (req, res, next) =>{
   passport.authenticate('local', {
       successRedirect: '/dashboard',
       failureRedirect: '/users/login',
       failureFlash: true
   })(req, res, next);
});

// logout Handle
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login');
    
});

module.exports =router;
