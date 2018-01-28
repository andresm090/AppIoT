var passport = require('passport');
var Comuna = require('../model/Comuna');
var Generador = require('../model/Generador');
//gauges 
var gaugeTemp = require('../src/gaugeTemp');
var gaugeVel = require('../src/gaugeVel');
var gaugeVA = require('../src/gaugeVA');
var gaugeWR = require('../src/gaugeWR');
var gaugePira = require('../src/gaugePira');
var gaugeInc = require('../src/gaugeInc');
var gaugeIncSeries = require('../src/gaugeIncSeries');
var statebarPN = require('../src/statebarPN');
var stateVbb = require('../src/stateVbb');

/*exports.getfPanelControl = (req, res, next) => {

	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user;
			if (generador.isAerogenerador()){
				Comuna.populate(generador, {path: "comuna"}, (err, generador) => {
					if (err){
						return res.send('No es lo que parece.');
					}
					return res.render('aerogenerador',  {titulo: generador.comuna.nombre + " - " + generador.tipo+" "+generador.caracteristicas[0]['modelo-serie'], id: generador.id});
				});
					
			} else {
				return res.send('No es lo que parece.');
			}
			
		}
	});
};*/

exports.getfPanelControl = (req, res, next) => {

	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user;
			Comuna.populate(generador, {path: "comuna"}, (err, generador) => {
				if (err){
					return res.send('No es lo que parece.');
				}
				return res.render('aerogenerador',  {titulo: generador.comuna.nombre + " - " + generador.tipo+" "+generador.caracteristicas[0]['modelo-serie'], id: generador.id});
			});	
		}
	});
};

exports.getTrCaracteristicas = (req, res, next) => {	

	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			return res.render('tr_carac', {caracteristicas: generador.caracteristicas[0], bbaterias: generador.bbaterias[0]});
		}

	});
};


exports.getTrDatosTR = (req, res, next) => {	

	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user;
			if (generador.isAerogenerador()){
				return res.render('tr_aero2', {gaugeTemp: gaugeTemp, gaugeVel: gaugeVel, gaugeVA: gaugeVA, gaugeWR: gaugeWR, statebarPN: statebarPN, potenciaN: generador.caracteristicas[0]['potencia'], bbaterias: generador.bbaterias[0], stateVbb: stateVbb});
			} else {
				return res.render('tr_panelf', {gaugeTemp: gaugeTemp, gaugePira: gaugePira, gaugeVA: gaugeVA, statebarPN: statebarPN, gaugeInc: gaugeInc, potenciaN: generador.caracteristicas[0]['potencia'], bbaterias: generador.bbaterias[0], stateVbb: stateVbb, data: gaugeIncSeries.verano}); //Completar
			}
		}

	});
};