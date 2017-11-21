
var config = {
	db: {
    	host: '127.0.0.1',
    	database: 'appIoT',
    	port: 27017,
    	autoReconnect: true,
  	},
  	socket: {
  		port: 3300,
  	},
  	broker: {
  		host: '192.168.1.75',
  	},
  	session:{
  		password: 'Secret',
    	resave: true,
    	saveUninitialized: true,
  	},
};

module.exports = config;