var passport = require('passport');
var Comuna = require('../model/Comuna');


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
