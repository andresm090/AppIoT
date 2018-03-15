var passport = require('passport');
//modelos
var Comuna = require('../model/Comuna');
var Generador = require('../model/Generador');
var Evento = require('../model/Evento');
var Dato = require('../model/Dato');
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
			return res.render('tr_carac', {caracteristicas: generador.caracteristicas[0], bbaterias: generador.bbaterias[0], sensoresC: generador.sensoresC, sensoresP: generador.sensoresP});
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
				return res.render('tr_aero2', {gaugeTemp: gaugeTemp, gaugeVel: gaugeVel, gaugeVA: gaugeVA, gaugeWR: gaugeWR, statebarPN: statebarPN, potenciaN: generador.caracteristicas[0]['potencia'], bbaterias: generador.bbaterias[0], stateVbb: stateVbb, actuador: generador.actuadores[0]['activado']});
			} else {
				Evento.findOne({generador: generador.id}, {}, { sort: { 'createdAt' : -1 } }, function(err, evento) {
					var inc;
					switch(evento.valor) {
						case 60:
							inc = gaugeIncSeries.invierno;
							break;
						case 20:
							inc = gaugeIncSeries.primavera;
							break;
						case 12: 
							inc = gaugeIncSeries.verano;
							break;
						default:
							inc = gaugeIncSeries.otonio;
					}
					return res.render('tr_panelf', {gaugeTemp: gaugeTemp, gaugePira: gaugePira, gaugeVA: gaugeVA, statebarPN: statebarPN, gaugeInc: gaugeInc, potenciaN: generador.caracteristicas[0]['potencia'], bbaterias: generador.bbaterias[0], stateVbb: stateVbb, data: inc, value: evento.valor}); //Completar
				});
			}
		}

	});
};

exports.getTrPublicacionDatos = (req, res, next) => {	

	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user;
			Comuna.populate(generador, {path: "comuna"}, (err, generador) => {
				if (err){
					return res.send('No es lo que parece.');
				}
				return res.render('tr_publicacion', {generador: generador});
			});
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

exports.getGrapArea = (req, res, next) => {
	var i = req.body.fechaI;
	var f = req.body.fechaF;
	var elemento;

	Dato.find({"producedAt": {"$gte": i, "$lt": f}, "generador": req.params.id, "tipo": req.body.tipo}, {},{ sort: { 'producedAt' : 1 } }, (err, data) => {
		if (req.body.tipo == "T"){
			elemento = {
				grafico: graphicArea,
				titulo: "Temperatura",
				unidad: "C°",
				collapse: 'collapseTem',
				panel: 'panel-danger',
				id: 'containerTemp',
				tipo: 'T' 
			};
		}
		if (req.body.tipo == "Rs"){
			elemento = {
				grafico: graphicArea,
				titulo: "Radiacion solar",
				unidad: "Kw/m²",
				collapse: 'collapseRad',
				panel: 'panel-danger',
				id: 'containerRad',
				tipo: 'Rs'  
			};
		}

		if (req.body.tipo == "Vm"){
			elemento = {
				grafico: graphicArea,
				titulo: "Velocidad",
				unidad: "m/s",
				collapse: 'collapseVel',
				panel: 'panel-primary',
				id: 'containervel',
				tipo: 'Vm'    
			};
		}  

		return res.render('graphic_area', {conf: elemento, valores: data});
	
	});
};

exports.getGrapWIndBar = (req, res, next) => {

	var i = req.body.fechaI;
	var f = req.body.fechaF;
	var elemento;
	var datos = [];

	Dato.find({"producedAt": {"$gte": i, "$lt": f}, "generador": req.params.id, "tipo": 'Vm'}, (err, velocidad) => {

		Dato.find({"producedAt": {"$gte": i, "$lt": f}, "generador": req.params.id, "tipo": 'Dv'}, (err, direccion) => {
			
			elemento = {
				grafico: graphicWindBars,
				titulo: "Velocidad y direccion de viento",
				collapse: 'collapseVelDir',
				panel: 'panel-primary',
				id: 'containerveldir' 
			};

			for (i = 0; i < velocidad.length; i++){
				var d = {vel: velocidad[i].valor, 
						dir: direccion[i].valor
					};
				datos.push(d);
			}
			return res.render('graphic_windBar', {conf: elemento, datos: datos, fecha: new Date(i)});
		});
	});
};


// Prueba de generacion de historicos. Solo funciona el de temperatura.
exports.getHistoricos = (req, res, next) => {	

	var graficos = [];
	var elemento;
	// criterios de busqueda para los datos
	var i = req.body.fechaI;
	var f = req.body.fechaF;
	var m = req.body.media;

	Dato.find({"producedAt": {"$gte": i, "$lt": f}, "generador": req.params.id}, (err, data) => {

		if (req.body.temp){
			//var grapic = graphicArea;
			//grapic['title'] = {text:'Temperatura'}; 
			elemento = {
				grafico: graphicArea,
				titulo: "Temperatura",
				unidad: "C°",
				collapse: 'collapseTem',
				panel: 'panel-danger',
				id: 'containerTemp',
				tipo: 'T' 
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
					unidad: "m/s",
					collapse: 'collapseVel',
					panel: 'panel-primary',
					id: 'containervel',
					tipo: 'Vm'  
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
				unidad: "Kwh",
				collapse: 'collapsePg',
				panel: 'panel-warning',
				id: 'containerPg' ,
				tipo: 'Pg'
			};
			graficos.push(elemento);
		}

		if (req.body.pc){
			elemento = {
				grafico: graphicLine,
				titulo: "Potencia Consumida",
				unidad: "Kwh",
				collapse: 'collapsePc',
				panel: 'panel-warning',
				id: 'containerPc',
				tipo: 'Ac' 
			};
			graficos.push(elemento);
		}

		return res.render('rta_historicos', {graficos: graficos, valores: data});
	});
};