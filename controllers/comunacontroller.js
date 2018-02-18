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

exports.activateComuna = (req, res, next) => {
	Comuna.findById(req.body.idcomuna, (err, comuna) => {
		if (comuna) {
			comuna.activo = true;
			comuna.save();
		}

	});
	return res.send('200 OK')
};

exports.deleteComunaByID = (req, res, next) => {
	Comuna.findById(req.body.idcomuna, (err, comuna) => {
		if (comuna) {
			comuna.activo = false;
			comuna.save();
		}

	});
	return res.send('200 OK')
};

exports.getformModifyComuna = (req, res, next) => {
	Comuna.findById(req.params.id, (err, comuna) => {
		if (comuna) {
			res.locals.user = req.user;
			return res.render('modifyComuna', {comuna: comuna});
		}
	});
};

exports.modifyComuna = (req, res, next) => {
	Comuna.findById(req.params.id, (err, comuna) => {
		if (comuna) {
			comuna.nombre = req.body.nombre;
			comuna.localidad = req.body.localidad;
			comuna.departamento = req.body.departamento;
			comuna.encargado = req.body.encargado;
			comuna.poblacion = req.body.poblacion;
			comuna.point_geom = [{latitud: req.body.latitud, longitud: req.body.longitud}];

			comuna.save();

			res.locals.user = req.user;
			req.flash('info', 'Valores actualizados con éxito!');
			return res.redirect('/admin');
		}

	});
};

exports.getMapComunas = (req, res, next) => {

	Comuna.find({'activo': true}, (err, comunas) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user || null;
			return res.render('map_comunas', {comunas: comunas});
		}

	});
};

exports.getGeneradores = (req, res, next) => {

	Generador.find({'comuna': req.params.id, 'activo': true}, (err, generadores) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			res.locals.user = req.user || null;
			return res.render('modal_table_generadores', {generadores: generadores});
		}

	});
};

exports.getModalDetalle = (req, res, next) => {

	Comuna.findById(req.body.idcomuna, (err, comuna) => {
		if (err){
			return res.send('Ha surgido un error.');
		}
		return res.render('modal_detalle_comuna', {comuna: comuna});
	});
};

exports.getModalDetalleGeneradores = (req, res, next) => {

	Generador.find({'comuna': req.body.idcomuna}, (err, generadores) => {
		if (err) {
			return res.send('Ha surgido un error.');
		} else {
			return res.render('modal_detalle_generadores', {generadores: generadores});
		}

	});
};
