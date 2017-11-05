var mqtt = require('mqtt');

//funcion to manager mqtt
var serverMQTT = function () {

	this.url = 'mqtt://192.168.1.73';//this url of mosquitto
	this.client = null;
  
	this.getClient = function () {
		if(!this.client)  
			this.client = mqtt.connect(this.url);
			console.log('Conectado al servidor MQTT');
		return this.client;
	};
    
	this.connect = function (callback) {
		var client = this.getClient();
		client.on('connect', function () {
			callback(client);
		});
	};
	
	this.observer = function (callback) {
		var client = this.getClient();
		client.on('message', callback);
	};
}

module.exports = serverMQTT;