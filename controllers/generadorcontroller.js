var passport = require('passport');
var Comuna = require('../model/Comuna');
var Generador = require('../model/Generador');

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
				var sensoresC;
				var sensoresP;

				if (generador.isAerogenerador()) {
					sensoresC = {
						Anemometro: "C"+generador.comuna.id_topic+"/Ag"+generador.id_topic+"/C/Vm",
						veleta: "C"+generador.comuna.id_topic+"/Ag"+generador.id_topic+"/C/Dv",
						Termometro: "C"+generador.comuna.id_topic+"/Ag"+generador.id_topic+"/C/T",
					};
					sensoresP = {
						"Voltimetro (Banco de baterias)": "C"+generador.comuna.id_topic+"/Ag"+generador.id_topic+"/P/Vbb",
						"Watimetro (Potencia Generada)": "C"+generador.comuna.id_topic+"/Ag"+generador.id_topic+"/P/Pg",
						"Amperimetro (Amperaje consumido)": "C"+generador.comuna.id_topic+"/Ag"+generador.id_topic+"/P/Ac",
					};
				} else {
					sensoresC = {
						Piranometro: "C"+generador.comuna.id_topic+"/Ps"+generador.id_topic+"/C/Rs",
						Termometro: "C"+generador.comuna.id_topic+"/Ps"+generador.id_topic+"/C/T",
					};
					sensoresP = {
						"Voltimetro (Banco de baterias)": "C"+generador.comuna.id_topic+"/Ps"+generador.id_topic+"/P/Vbb",
						"Watimetro (Potencia Generada)": "C"+generador.comuna.id_topic+"/Ps"+generador.id_topic+"/P/Pg",
						"Amperimetro (Amperaje consumido)": "C"+generador.comuna.id_topic+"/Ps"+generador.id_topic+"/P/Ac",
					};
				}
				return res.render('panel_detalle_generadores', {generador: generador, sensoresC: sensoresC, sensoresP:sensoresP});	
			});
		}

	});
};