var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeneradorSchema = new Schema({
	tipo: {type: String, required: true, enum: ['aerogenerador', 'panel fotovoltaico']},
	caracteristicas: {type: Array, default:[]},
	bbaterias: {type: Array, default:[]},
	comuna: {type: mongoose.Schema.Types.ObjectId, ref: 'comuna'},
})

GeneradorSchema.methods.isAerogenerador = function (){
	if (this.tipo == 'aerogenerador') {
		return true;
	}
	return false;
};


module.exports = mongoose.model('generador', GeneradorSchema);