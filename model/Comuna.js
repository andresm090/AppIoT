var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComunaSchema = new Schema({
	nombre: {type: String, required: true, trim: true, default: ''},
	localidad: {type: String, required: true, trim: true, default: ''},
	departamento: {type: String, required: true, trim: true, default: ''},
	encargado: {type: String, trim: true, default: ''},
	poblacion: {type: Number, min: 1},
	point_geom: [{latitud: Number, longitud: Number}],
})

module.exports = mongoose.model('comuna', ComunaSchema);