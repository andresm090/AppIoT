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
var graphicWindBars = require('../src/graphicWindBars');
var graphicArea = require('../src/graphicArea');
var graphicLine = require('../src/graphicLine');

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
				return res.render('tr_panelf', {gaugeTemp: gaugeTemp, gaugePira: gaugePira, gaugeVA: gaugeVA, statebarPN: statebarPN, gaugeInc: gaugeInc, potenciaN: generador.caracteristicas[0]['potencia'], bbaterias: generador.bbaterias[0], stateVbb: stateVbb, data: gaugeIncSeries.primavera}); //Completar
			}
		}

	});
};

exports.getTrDatosH = (req, res, next) => {	

	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user;
			if (generador.isAerogenerador()){
				return res.render('tr_historicos', {clima: 'aerogenerador/clima', energia: 'aerogenerador/energia', datos: 0, id: generador.id});
			}
			return res.render('tr_historicos', {clima: 'fotovoltaica/clima', energia: 'fotovoltaica/energia', datos: 1, id: generador.id});
		}

	});
};

exports.getHistoricos = (req, res, next) => {	

	var graficos = [];
	var elemento;
	// criterios de busqueda para los datos
	var i = req.body.fechaI;
	var f = req.body.fechaF;
	var m = req.body.media;

	if (req.body.temp){
		//var grapic = graphicArea;
		//grapic['title'] = {text:'Temperatura'}; 
		elemento = {
			grafico: graphicArea,
			titulo: "Temperatura",
			collapse: 'collapseTem',
			panel: 'panel-danger',
			id: 'containerTemp' 
		};
		graficos.push(elemento);
	}
	if (req.body.vel && req.body.dir ){
		elemento = {
			grafico: graphicWindBars,
			titulo: "Velocidad y direccion de viento",
			collapse: 'collapseVelDir',
			panel: 'panel-primary',
			id: 'containerveldir' 
		};
		graficos.push(elemento);
	} else {
		if (req.body.vel){
			elemento = {
				grafico: graphicWindBars,
				titulo: "Velocidad",
				collapse: 'collapseVel',
				panel: 'panel-primary',
				id: 'containervel' 
			};
			graficos.push(elemento);
		} else {
			if (req.body.dir){
				elemento = {
					grafico: graphicWindBars,
					titulo: "Direccion",
					collapse: 'collapseDir',
					panel: 'panel-info',
					id: 'containerdir' 
				};
				graficos.push(elemento);
			}
		}
	}

	if (req.body.rad){
		//graphicArea['title'] = {text:'Radiación Solar'};
		elemento = {
			grafico: graphicArea,
			titulo: "Radiacion solar",
			collapse: 'collapseRad',
			panel: 'panel-danger',
			id: 'containerRad' 
		};
		graficos.push(elemento);
	}

	if (req.body.pg){
		elemento = {
			grafico: graphicLine,
			titulo: "Potencia Generadar",
			collapse: 'collapsePg',
			panel: 'panel-warning',
			id: 'containerPg' 
		};
		graficos.push(elemento);
	}

	if (req.body.pc){
		elemento = {
			grafico: graphicLine,
			titulo: "Potencia Consumida",
			collapse: 'collapsePc',
			panel: 'panel-warning',
			id: 'containerPc' 
		};
		graficos.push(elemento);
	}



	/*var t = req.body.temp;
	var v = req.body.vel;
	var d = req.body.dir;
	var r = req.body.rad;

	var pg = req.body.pg;
	var pc = req.body.pc;
	if (t) {
		console.log("temep: " + t);
	}
	if (r) {
		console.log("rad: " + r);
	}
	console.log("vel: " + v);
	console.log("dir: " + d);
	console.log("Pg: " + pg);
	console.log("Pc: " + pc);*/

	//devolver vista con los graficos - rta_historicos - 
	//return res.render('rta_historicos', {graphicWindBars: graphicWindBars, gaugeWR: gaugeWR, graphicArea: graphicArea, graphicLine: graphicLine});
	return res.render('rta_historicos', {graficos: graficos});
	
};