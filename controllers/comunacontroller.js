var passport = require('passport');
var Comuna = require('../model/Comuna');
var Generador = require('../model/Generador');

exports.getPanelAdministrador = (req, res, next) => {
	res.locals.user = req.user;
	if (req.user.isAdministrador()) {
		Comuna.find({}, (err, comunas) => {
			if (err) {
				return res.send('Ha surgido un error.');
			} else {
				return res.render('panel_control', {comunas: comunas, success : req.flash('info')});
			}

		});
	} else {
		return res.send('No tiene los permisos suficientes para ver este recurso.');
	}
};

exports.getformNuevaComuna = (req, res, next) => {
	res.locals.user = req.user;
	return res.render('nueva_comuna');
}; 

exports.saveComuna = (req, res, next) => {

	var comuna = new Comuna({
		nombre: req.body.nombre,
		localidad: req.body.localidad,
		departamento: req.body.departamento,
		encargado: req.body.encargado,
		poblacion: req.body.poblacion,
		point_geom: [{latitud: req.body.latitud, longitud: req.body.longitud}],
	});

	comuna.save((err) => {
		if (err){
			next(err);
		}
		res.locals.user = req.user || null;

		req.flash('info', 'Nueva comuna registrada');
		//res.locals.message = req.flash();
		//req.flash('suces', 'Email o contraseña no validos');
		return res.redirect('/admin');
	}); 
};

exports.deleteComunas = (req, res, next) => {
	comunas = req.body.listcomuna;
	for (var i = 0; i < comunas.length; i++){
		Comuna.findById(comunas[i], (err, comuna) => {
			if (comuna) {
				comuna.activo = false;
				comuna.save();
			}

		});
	}
	return res.send('200 OK')
};

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

exports.getMapComunas = (req, res, next) => {

	Comuna.find({}, (err, comunas) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user || null;
			return res.render('map_comunas', {comunas: comunas});
		}

	});
};

exports.getGeneradores = (req, res, next) => {

	Generador.find({'comuna': req.params.id}, (err, generadores) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user || null;
			return res.render('modal_table_generadores', {generadores: generadores});
		}

	});
};

