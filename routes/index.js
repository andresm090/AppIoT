var express = require('express');
var router = express.Router();
var controllerUser = require('../controllers/usercontroller');
var topicontroller = require('../controllers/topicontroller');
var passportConfig = require('../config/passport');



/* GET home page. */
router.get('/', function(req, res, next) {
  //req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
  res.locals.user = req.user || null;
  res.render('home', { message: req.flash('info')});
});

/**router.get('/topicos', passportConfig.isAuthenticate, function(req, res, next) {
	res.locals.user = req.user;
	res.render('suscripciones');
});**/

router.get('/topicos', passportConfig.isAuthenticate, topicontroller.getTopicos);
router.post('/topicos', passportConfig.isAuthenticate, topicontroller.saveTopicos);

/* Route de autenticacion*/
router.get('/signup', function(req, res, next) {
  res.render('signup');
});
router.post('/signup', controllerUser.postSignup);

router.get('/login', function(req, res, next) {
  res.render('login', {errors : req.flash('error')});
});
router.post('/login', controllerUser.postLogin);

router.get('/logout', passportConfig.isAuthenticate, controllerUser.logout);

router.get('/prueba', passportConfig.isAuthenticate, function(req, res, next){
	res.locals.user = req.user;
	res.render('prueba_datos');
});

module.exports = router;
