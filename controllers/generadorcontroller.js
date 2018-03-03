var passport = require('passport');
var Comuna = require('../model/Comuna');
var Generador = require('../model/Generador');
var sensoresCA = require('../src/sensoresCA');
var sensoresCP = require('../src/sensoresCP');
var sensoresE = require('../src/sensoresE');
var actuadores = require('../src/actuadores');


exports.getformNuevoAerogenerador = (req, res, next) => {
	res.locals.user = req.user;
	return res.render('nuevo_aerogenerador');
}; 

exports.saveAerogenerador = (req, res, next) => {

	var vt;
	var at;

	var caracteristicas = {
		'fabricante': req.body.fabricante,
		'modelo-serie':req.body.modelo,
		'potencia':req.body.pn,
		'diametro-rotor':req.body.diametro,
		'h':req.body.h,
		'vel-arranque':req.body.velm,
		'vel-parada':req.body.velp,
		'palas':req.body.npalas,
		'generacion':req.body.generacion
	};

	var conexion = req.body.conexion;
	var v = req.body.vol;
	var a = req.body.capacidad;
	var cantBat = req.body.nbaterias;

	if (conexion == 'Serie'){
		vt = v*cantBat;
		at = a;
	} else {
		vt = v;
		at = a*cantBat;
	}

	var bbaterias = {
		'voltaje': v,
		'capacidad': a,
		'cant de baterias': cantBat,
		'conexion': conexion,
		'voltaje total': vt,
		'capacidad total': at,
	};

	var generador = new Generador ({
		tipo: 'aerogenerador',
		caracteristicas: caracteristicas,
		bbaterias: bbaterias,
		comuna: req.params.id,
		sufijo: 'Ag',
		sensoresC: sensoresCA,
		sensoresP: sensoresE,
		actuadores: actuadores[0],
	});

	generador.save((err) => {
		if (err){
			next(err);
		}
		res.locals.user = req.user || null;

		req.flash('info', 'Nuevo aerogenerador registrado');
		return res.redirect('/admin');
	}); 
};

exports.getformNuevoPanelFotovoltaico = (req, res, next) => {
	res.locals.user = req.user;
	return res.render('nuevo_panelf');
}; 

exports.savePanelFotovoltaico = (req, res, next) => {

	var vt;
	var at;
	
	var caracteristicas = {
		'fabricante': req.body.fabricante,
		'modelo-serie':req.body.modelo,
		'potencia':req.body.pmax,
		'corriente-max':req.body.ipmax,
		'voc':req.body.voc,
		'isc':req.body.isc,
		'dimensiones':req.body.dimensiones,
		'peso':req.body.peso,
		'cant-celdas':req.body.celdas,
		'temp-op': req.body.tempOp
	};

	var conexion = req.body.conexion;
	var v = req.body.vol;
	var a = req.body.capacidad;
	var cantBat = req.body.nbaterias;

	if (conexion == 'Serie'){
		vt = v*cantBat;
		at = a;
	} else {
		vt = v;
		at = a*cantBat;
	}

	var bbaterias = {
		'voltaje': v,
		'capacidad': a,
		'cant de baterias': cantBat,
		'conexion': conexion,
		'voltaje total': vt,
		'capacidad total': at,
	};

	var generador = new Generador ({
		tipo: 'panel fotovoltaico',
		caracteristicas: caracteristicas,
		bbaterias: bbaterias,
		comuna: req.params.id,
		sufijo: 'Ps',
		sensoresC: sensoresCP,
		sensoresP: sensoresE,
		actuadores: actuadores[1],
	});

	generador.save((err) => {
		if (err){
			next(err);
		}
		res.locals.user = req.user || null;

		req.flash('info', 'Nuevo panel fotovoltaico registrado');
		return res.redirect('/admin');
	});
};

exports.getformModifyGenerador = (req, res, next) => {

	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user;
			if (generador.isAerogenerador()){
				return res.render('modify_aerogenerador', {generador: generador});
			}
			return res.render('modify_panel_fotovoltaico', {generador: generador});
		}

	});
};

exports.ModifyGenerador = (req, res, next) => {

	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			
			var caracteristicas;
			var vt;
			var at;

			if (generador.isAerogenerador()){

				caracteristicas = {
					'fabricante': req.body.fabricante,
					'modelo-serie':req.body.modelo,
					'potencia':req.body.pn,
					'diametro-rotor':req.body.diametro,
					'h':req.body.h,
					'vel-arranque':req.body.velm,
					'vel-parada':req.body.velp,
					'palas':req.body.npalas,
					'generacion':req.body.generacion
				};				
				//return res.render('modify_aerogenerador', {generador: generador});
			} else {

				caracteristicas = {
					'fabricante': req.body.fabricante,
					'modelo-serie':req.body.modelo,
					'potencia':req.body.pmax,
					'corriente-max':req.body.ipmax,
					'voc':req.body.voc,
					'isc':req.body.isc,
					'dimensiones':req.body.dimensiones,
					'peso':req.body.peso,
					'cant-celdas':req.body.celdas,
					'temp-op': req.body.tempOp
				};
			}

			var conexion = req.body.conexion;
			var v = req.body.vol;
			var a = req.body.capacidad;
			var cantBat = req.body.nbaterias;

			if (conexion == 'Serie'){
				vt = v*cantBat;
				at = a;
			} else {
				vt = v;
				at = a*cantBat;
			}

			var bbaterias = {
				'voltaje': v,
				'capacidad': a,
				'cant de baterias': cantBat,
				'conexion': conexion,
				'voltaje total': vt,
				'capacidad total': at,
			};

			generador.caracteristicas = caracteristicas;
			generador.bbaterias = bbaterias;

			generador.save((err) => {
				if (err){
					next(err);
				}
				res.locals.user = req.user || null;
				req.flash('info', 'Los nuevos cambios han sido registrados');
				return res.redirect('/admin');
			});

			//return res.render('modify_panel_fotovoltaico', {generador: generador});
		}

	});
};

exports.deleteGenerador = (req, res, next) => {

	Generador.findById(req.body.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			generador.activo = false;
			generador.save();
		}
	});
	
	return res.send('200 OK');
};

exports.activateGenerador = (req, res, next) => {
	Generador.findById(req.body.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			generador.activo = true;
			generador.save();
		}

	});
	return res.send('200 OK');
};

exports.getDetalleGenerador = (req, res, next) => {
	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user || null;
			Comuna.populate(generador, {path: "comuna"}, (err, generador) => {
				if (err){
					return res.send('Ha surgido un error.');
				}
				
				return res.render('panel_detalle_generadores', {generador: generador});	
			});
		}

	});
};

// metodo que almacena aquellos sensores que publicaran los datos procesados a otros dashboard
// Funciona pero puedo mejorarse
exports.savePreferenciasPublish = (req, res, next) => {
	Generador.findById(req.params.id, (err, generador) => {
		if (err) {
			return res.send('Ha surgido un error.');
			//return "ha ocurrido un erro";
		} else {
			//console.log(req.body.sC1);
			//console.log (generador.sensoresC[0]['re_publica']);
			var sensC;
			var actuadres;
			if (generador.isAerogenerador()){

				sensC = [{
					nombre: 'Anemometro',
					unidad: 'm/s',
					tipo: 'C',
					sufijo: 'Vm',
					activo: true,
					re_publica: req.body.sC0,
					topico: 'velocidad'
				}, {
					nombre: 'Veleta',
					unidad: '°',
					tipo: 'C',
					sufijo: 'Dv',
					activo: true,
					re_publica: req.body.sC1,
					topico: 'direccionViento'
				}, {
					nombre: 'Termometro',
					unidad: 'C°',
					tipo: 'C',
					sufijo: 'T',
					activo: true,
					re_publica: req.body.sC2,
					topico: 'temperatura'
				}];

				actuadores = [{
					nombre: 'Freno por corrientes parásitas',
					tipo: 'Ef',
					activo: true,
					re_publica: req.body.a0,
					topico: 'frenoaerogenerador',
					activado: false
				}];

			} else {
				sensC = [{
					nombre: 'Piranometro',
					unidad: 'Kw/m²',
					tipo: 'C',
					sufijo: 'Rs',
					activo: true,
					re_publica: req.body.sC0,
					topico: 'radiacion'
				}, {
					nombre: 'Termometro',
					unidad: 'C°',
					tipo: 'C',
					sufijo: 'T',
					activo: true,
					re_publica: req.body.sC1,
					topico: 'temperatura'
				}];

				actuadores = [{
					nombre: 'Inclinometro',
					tipo: 'Ei',
					activo: true,
					re_publica: req.body.a0,
					topico: 'inclinometro',
					activado: false
				}];
			}

			sensE = [{
				nombre: 'Voltimetro (Banco de baterias)',
				unidad: 'Volt',
				tipo: 'P',
				sufijo: 'Vbb',
				activo: true,
				re_publica: req.body.sP0,
				topico: 'tensionBaterias'
			}, {
				nombre: 'Watimetro (Potencia Generada)',
				unidad: 'Watt',
				tipo: 'P',
				sufijo: 'Pg',
				activo: true,
				re_publica: req.body.sP1,
				topico: 'energiagenerada'
			}, {
				nombre: 'Amperimetro (Amperaje consumido)',
				unidad: 'Amp',
				tipo: 'P',
				sufijo: 'Ac',
				activo: true,
				re_publica: req.body.sP2,
				topico: 'consumo'
			}];

			generador.sensoresC = sensC;
			generador.sensoresP = sensE;
			generador.actuadores = actuadores;
			//console.log (generador.sensoresC[0]['re_publica']);
			
			//console.log(generador.sensoresC[0]);
			
			//generador.save();
			/*generador.sensoresC[1]['re_publica'] = req.body.sC1;

			if (generador.isAerogenerador()){
				generador.sensoresC[2]['re_publica'] = req.body.sC2;
			}

			generador.sensoresP[0]['re_publica'] = req.body.sP0;
			generador.sensoresP[1]['re_publica'] = req.body.sP1;
			generador.sensoresP[2]['re_publica'] = req.body.sP2;*/
			generador.save((err) => {
				if (err){
					console.log("errores");
					return res.send("<div id=\"alertMsj\" class=\"alert alert-success alert-dismissible\" role=\"alert\"> <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> <strong> Ha surgido un error.</strong>");	
				}		
			});
			res.locals.user = req.user || null;
			return res.send("<div id=\"alertMsj\" class=\"alert alert-success alert-dismissible\" role=\"alert\"> <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> <strong> Datos guardados exitosamente!!</strong>");	

		}

	});
};
