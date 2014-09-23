/**
 * UserController
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


var UserController = {
    'index': function (req, res) {
        res.view('home/index');
    },
    'new': function( req, res){
        res.view();
    },
    create: function( req, res, next){
        var userObj = {
          name: 		req.param('name'),
          username: 	req.param('username'),
          email: 		req.param('email'),
          password: 	req.param('password'),
          confirmation: req.param('confirmation')
        };

        User.create(userObj, function (err, user){
            
            var emailExist = [{name:'emailExist', message:'The Email is already in use'}];

            if(err){
                console.log(err.code);
                if(err.code === 11000 ){
                	console.log("email exist");
                	req.session.flash ={
                    	err: emailExist
                	};
                }else{
                	req.session.flash ={
                   		err: err
                	};
                }
                  // Object.keys(err).forEach(function(error) {
                  //     //console.log(Object.keys(err[error]));
                  //     console.log(err[error]);
                  // });

                  // console.log(Object.keys(err));

                return res.redirect('/user/new/');
            }

            req.session.authenticated = true;
            req.session.User = user;

            console.log(req.session.User);

            res.redirect('/');
        });
    }
};

module.exports = UserController;
