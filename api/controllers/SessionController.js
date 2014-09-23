/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var SessionController = {
	'index': function(req, res){
         req.session.flash = {};

        res.view('session/index');
    },

	'create': function(req, res, next){
		 var userEmail 		= req.param('email'); // get the email from the form
		 var userPassword 	= req.param('password');
		// check if email ang password is not empty 
        if(!userEmail || !userPassword){
            var usernamePasswordRequired = [{
                name:'usernamePasswordRequired', 
                message: 'You must enter both username and password'
            }];
            
            req.session.flash = {
                err: usernamePasswordRequired
            };
            res.redirect('/session/index');
            return;
        }

        User.findOneByEmail(userEmail, function(err, user){
            if(err) return  next(err);

            if(!user){
                var noAccount = [{name:'noAccount', message:'User doesnt exist'}];
                req.session.flash = {
                    err:noAccount
                };
                res.redirect('/session/index');
                return;
            }

            // bcrypt compare the password from the database and from the input form
            bcrypt.compare(userPassword, user.encryptedPassword, function(err, valid){
                if(err) return next(err);
                // check if password is valid upon bcrypting
                if(!valid){
                    var usernamePasswordNotMatch = [{
                        name:'usernamePasswordNotMatch', 
                        message:'Invalid combination of username and password'
                    }];
                }

                // put a flash error in session for not valid
                req.session.flash = {
                    err: usernamePasswordNotMatch
                };

                res.redirect('/session/index');
                return;
            });

            req.session.authenticated = true;
            req.session.User = user;

            if(req.session.User.admin){
                res.redirect('/user');
                return;
            }

            res.redirect('/home/show/');
        })
    }
};


module.exports = SessionController;