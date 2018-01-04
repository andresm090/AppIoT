var express = require('express');
var router = express.Router();
var controllerUser = require('../controllers/usercontroller');
var topicontroller = require('../controllers/topicontroller');
var comunacontroller = require('../controllers/comunacontroller');
var passportConfig = require('../config/passport');
var gaugeTemp = require('../src/gaugeTemp');
var gaugeVel = require('../src/gaugeVel');
var gaugeVA = require('../src/gaugeVA');
var gaugeWR = require('../src/gaugeWR');
var statebarPN = require('../src/statebarPN');
var Comuna = require('../model/Comuna');
var Generador = require('../model/Generador');
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function(req, res, next) {
  //req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
  res.locals.user = req.user || null;
  Comuna.find({}, (err, comunas) => {
		if (err) {
			res.send('Ha surgido un error.');
		} else {
			//var e = comunas[0].getAerogeneradores();
			//console.log(e);
			res.locals.comunas = req.comunas || null;
			res.render('home', { message: req.flash('info'), comunas:comunas});
		}

	});
  //res.render('home', { message: req.flash('info'), comunas:coumnas});
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

//rutas de visualizacion de datos

router.get('/aerogenerador/:id([0-9]+)', passportConfig.isAuthenticate, function(req, res, next){
	res.locals.user = req.user;
	res.locals.comunas = req.comunas;
	res.render('aerogenerador');
});

router.get('/getDataTR2', passportConfig.isAuthenticate, function(req, res, next){
	res.locals.user = req.user;
	res.render('tr_aero2', {gaugeTemp: gaugeTemp, gaugeVel: gaugeVel, gaugeVA: gaugeVA, gaugeWR: gaugeWR, statebarPN: statebarPN});

});

//rutas para administracion 

router.get('/admin', passportConfig.isAuthenticate, comunacontroller.getPanelAdministrador);

router.get('/admin/nuevaComuna', passportConfig.isAuthenticate , comunacontroller.getformNuevaComuna);
router.post('/admin/nuevaComuna', passportConfig.isAuthenticate, comunacontroller.saveComuna);
router.post('/admin/delComuna', passportConfig.isAuthenticate, comunacontroller.deleteComunas);

router.get('/admin/:id(*)/nuevoaerogenerador', passportConfig.isAuthenticate , comunacontroller.getformNuevoAerogenerador);
router.post('/admin/:id(*)/nuevoaerogenerador', passportConfig.isAuthenticate, comunacontroller.saveAerogenerador);

router.get('/admin/:id(*)/nuevopanelfotovoltaico', passportConfig.isAuthenticate, comunacontroller.getformNuevoPanelFotovoltaico);
router.post('/admin/:id(*)/nuevopanelfotovoltaico', passportConfig.isAuthenticate, comunacontroller.savePanelFotovoltaico);

router.get('/comunas', passportConfig.isAuthenticate, comunacontroller.getMapComunas);
router.get('/comunas/:id(*)/getGeneradores', passportConfig.isAuthenticate, comunacontroller.getGeneradores);

// rutas de prueba

router.get('/prueba', passportConfig.isAuthenticate, function(req, res, next){
	res.locals.user = req.user;
	res.render('prueba_datos', {gaugeTemp: gaugeTemp, gaugeVel: gaugeVel});
});

router.get('/prueba2', passportConfig.isAuthenticate, function(req, res, next){
	res.locals.user = req.user;
	res.render('datos_principal');
});

router.get('/getPanelAero', passportConfig.isAuthenticate, function(req, res, next){
	res.render('tabs_panel_aero');

});

router.get('/getDataTR', passportConfig.isAuthenticate, function(req, res, next){
	res.render('tr_aero', {gaugeTemp: gaugeTemp, gaugeVel: gaugeVel, gaugeVA: gaugeVA});

});

module.exports = router;


/*
var com = new comuna({
				nombre: "Albergue Escuela N° 128",
				localidad: "Blancuntre",
				departamento: "Gastre",
				encargado: "Juan Perez",
				poblacion: 120,
				point_geom: [{latitud: -42.62025, longitud: -68.904472}],
			});
			com.save();



*/