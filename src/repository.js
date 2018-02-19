var Evento = require('../model/Evento');
var Dato = require('../model/Dato');

var repository = function () {

	this.saveData = function (topic, values, callback) {

		var errores;
		var data = values.split("-");
		//var datas = [];

		//datas.push({valor:Number(data[0]), unidad: "C°", tipo: "temperatura"});
		//datas.push({valor:Number(data[1]), unidad: "m/s°", tipo: "velocidad"});
		//datas.push({valor:Number(data[2]), unidad: "°", tipo: "direccion"});

		//Extraer de topic: comuna y equipo generador para procesamiento  

		var temperatura = Number(data[0]);
		var velocidad = Number(data[1]);
		var direccion = Number(data[2]);

		// Guardar valores en el modelo correspondiente (Modelo de prueba, con datos de prueba)
		/*var event = new Evento({
			valor: temperatura,
			topico: topic,
			producedAt: new Date(),
			generador: '5a445d2a2c45b60ae8089cca', 
		});

		event.save((err) => {
			if (err){
				errores = true;
			}
		});*/

		var dato = new Dato({
			valor: temperatura,
			unidad: "C°",
			topico: topic,
			producedAt: new Date(),
			generador: '5a445d2a2c45b60ae8089cca',
			tipo: "temperatura",
			TAG: "aerogenerador/clima",
		});

		dato.save((err) => {
			if (err){
				errores = true;
			}
		});

		callback(temperatura, velocidad, direccion, errores); // evaluar de incorporar base a topico para su publicacion
	};

}

module.exports = repository;