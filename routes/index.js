var express = require('express');
var router = express.Router();
var controllerUser = require('../controllers/usercontroller');
var topicontroller = require('../controllers/topicontroller');
var comunacontroller = require('../controllers/comunacontroller');
var datocontroller = require('../controllers/datocontroller');
var passportConfig = require('../config/passport');

var Comuna = require('../model/Comuna');
var Generador = require('../model/Generador');
var User = require('../model/User');
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function(req, res, next) {
  //req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
  res.locals.user = req.user || null;
  /*Comuna.find({}, (err, comunas) => {
		if (err) {
			res.send('Ha surgido un error.');
		} else {
			//var e = comunas[0].getAerogeneradores();
			//console.log(e);
			res.locals.comunas = req.comunas || null;
			res.render('home', { message: req.flash('info'), comunas:comunas});
		}

	});*/
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

//rutas de visualizacion de datos
/*
router.get('/aerogenerador/:id([0-9]+)', passportConfig.isAuthenticate, function(req, res, next){
	res.locals.user = req.user;
	res.render('aerogenerador');
});

router.get('/getDataTR2', passportConfig.isAuthenticate, function(req, res, next){
	res.locals.user = req.user;
	res.render('tr_aero2', {gaugeTemp: gaugeTemp, gaugeVel: gaugeVel, gaugeVA: gaugeVA, gaugeWR: gaugeWR, statebarPN: statebarPN});

});*/

router.get('/aerogenerador/:id(*)', passportConfig.isAuthenticate, datocontroller.getfPanelControl);

router.get('/getDataC/:id(*)', passportConfig.isAuthenticate, datocontroller.getTrCaracteristicas);
router.get('/getDataTR2/:id(*)', passportConfig.isAuthenticate, datocontroller.getTrDatosTR);
router.get('/getDataH/:id(*)', passportConfig.isAuthenticate, datocontroller.getTrDatosH);

router.post('/getHistoricos/:id(*)', passportConfig.isAuthenticate, datocontroller.getHistoricos);

//rutas para administracion 

router.get('/admin', passportConfig.isAuthenticate, comunacontroller.getPanelAdministrador);

router.get('/admin/nuevaComuna', passportConfig.isAuthenticate, comunacontroller.getformNuevaComuna);
router.post('/admin/nuevaComuna', passportConfig.isAuthenticate, comunacontroller.saveComuna);

router.post('/admin/delComuna', passportConfig.isAuthenticate, comunacontroller.deleteComunas);
router.post('/admin/delComunaByID', passportConfig.isAuthenticate, comunacontroller.deleteComunaByID);

router.post('/admin/activarComuna', passportConfig.isAuthenticate, comunacontroller.activateComuna);

router.get('/admin/:id(*)/modificar', passportConfig.isAuthenticate , comunacontroller.getformModifyComuna);
router.post('/admin/:id(*)/modificar', passportConfig.isAuthenticate, comunacontroller.modifyComuna);

router.post('/admin/getDetalle', passportConfig.isAuthenticate, comunacontroller.getModalDetalle);
router.post('/admin/getDetalleGeneradores', passportConfig.isAuthenticate, comunacontroller.getModalDetalleGeneradores);

router.get('/admin/:id(*)/nuevoaerogenerador', passportConfig.isAuthenticate , comunacontroller.getformNuevoAerogenerador);
router.post('/admin/:id(*)/nuevoaerogenerador', passportConfig.isAuthenticate, comunacontroller.saveAerogenerador);

router.get('/admin/:id(*)/nuevopanelfotovoltaico', passportConfig.isAuthenticate, comunacontroller.getformNuevoPanelFotovoltaico);
router.post('/admin/:id(*)/nuevopanelfotovoltaico', passportConfig.isAuthenticate, comunacontroller.savePanelFotovoltaico);

//rutas para gestion de mapa web

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

//recupera el ultimo usuario registrada. Cambiar a 1 si se busca el mas antiguo
router.get('/ultimo', function(req, res, next) {
  User.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, user) {
  	res.json(user);
	});
});

module.exports = router;
