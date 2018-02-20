var mongoose = require('mongoose');
var autoNumber = require('mongoose-auto-number');
var Schema = mongoose.Schema;

var GeneradorSchema = new Schema({
	tipo: {type: String, required: true, enum: ['aerogenerador', 'panel fotovoltaico']},
	caracteristicas: {type: Array, default:[]},
	bbaterias: {type: Array, default:[]},
	comuna: {type: mongoose.Schema.Types.ObjectId, ref: 'comuna'},
	activo: {type: Boolean, default: true},
	id_topic: {type: Number, autoIncrement: true}
})

GeneradorSchema.methods.isAerogenerador = function (){
	if (this.tipo == 'aerogenerador') {
		return true;
	}
	return false;
};

GeneradorSchema.plugin(autoNumber.plugin, 'generador');
module.exports = mongoose.model('generador', GeneradorSchema);