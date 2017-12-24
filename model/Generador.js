var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeneradorSchema = new Schema({
	tipo: {type: String, required: true, enum: ['aerogenerador', 'panelf']},
	caracteristicas: {type: Array, default:[]},
	comuna: {type: mongoose.Schema.Types.ObjectId, ref: 'comuna'},
})

module.exports = mongoose.model('generador', GeneradorSchema);