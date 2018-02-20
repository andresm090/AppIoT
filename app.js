global.config = require('./config/config');
var express = require('express');
var flash = require('connect-flash');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportConfig = require('./config/passport');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var swig = require('swig');
var index = require('./routes/index');
var users = require('./routes/users');
var mqtt = require('./src/serverMQTT');
var repo = require('./src/repository');
var controllerUser = require('./controllers/usercontroller');
var gaugeIncSeries = require('./src/gaugeIncSeries');
var autoNumber = require('mongoose-auto-number');

var MONGO_URL = 'mongodb://'+global.config.db.host+':'+global.config.db.port+'/'+global.config.db.database;

//var http = require('http').Server(app);
var io = require('socket.io').listen(global.config.socket.port);

var connectionsArray = []; // Arreglo de socket
var serverMQTT = new mqtt();
var repository = new repo();
var swig = new swig.Swig();

var app = express();

//Configuracion de la base de datos
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (err) => {
	throw err;
	process.exit(1);
});

autoNumber.init(mongoose.connection);

//Configuracion para manejo de sesiones
app.use(session ({
	secret: global.config.session.password,
	resave: global.config.session.resave,
	saveUninitialized: global.config.session.saveUninitialized,
	store: new mongoStore({
		url: MONGO_URL,
		autoReconnect: global.config.db.autoReconnect
	})
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());


// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('*/public',express.static('public'));


//Ruta de prueba
app.get('/userinfo', passportConfig.isAuthenticate, (req, res) => {
	res.json(req.user);
});

//Definicion de los manejadores de rutas
app.use('/', index);
app.use('/users', users);

//coneccion al broker
serverMQTT.connect(function(clientMQTT) {

	clientMQTT.subscribe('aerogenerador/clima');
	clientMQTT.subscribe('aerogenerador/energia');
	clientMQTT.subscribe('aerogenerador/evenFreno');
	clientMQTT.subscribe('fotovoltaica/clima');
	clientMQTT.subscribe('fotovoltaica/energia');
	clientMQTT.subscribe('fotovoltaica/evenInc');
	serverMQTT.observer(function(topic, value) {
		console.log(value.toString());
		//Notifico a los clientes
		connectionsArray.forEach(function(tmpSocket) {
			if (topic == "aerogenerador/energia") {
				tmpSocket.emit('energia', value.toString());
			}
			if (topic == "aerogenerador/clima") {
				tmpSocket.emit('notification', value.toString());
				repository.saveData(topic, value.toString(), function(t, v, d, err){
					if (err){
						console.log("Algunos datos no se guardaron");
					} else {
						clientMQTT.publish('temperatura', t.toString());
						clientMQTT.publish('velocidad', v.toString());
						clientMQTT.publish('direccion', d.toString());
					}
				});
			}
			if (topic == "fotovoltaica/clima"){
				tmpSocket.emit('panelf/c', value.toString());	
			}
			if (topic == "fotovoltaica/energia"){
				tmpSocket.emit('panelf/e', value.toString());
			}
			if (topic == "fotovoltaica/evenInc"){
				var inc = Number(value);
				switch(inc) {
					case 60:
						tmpSocket.emit('panelf/event', gaugeIncSeries.invierno, inc);
						break;
					case 20:
						tmpSocket.emit('panelf/event', gaugeIncSeries.primavera, inc);
						break;
					case 12: 
						tmpSocket.emit('panelf/event', gaugeIncSeries.verano, inc);
						break;
					default:
						tmpSocket.emit('panelf/event', gaugeIncSeries.otonio, inc);
				}	
			}
			if (topic == "aerogenerador/evenFreno"){
				tmpSocket.emit('aero/e', Number(value), '5a42df48529b9f200cfd5bc5');
			}
		});
	});
});

//coneccion de los websocket
io.on('connection', function(socket){
	console.log('Numero de conexión:' + connectionsArray.length); 

	socket.on('disconnect', function(){
		var socketIndex = connectionsArray.indexOf(socket);
		console.log('socketID = %s got disconnected', socketIndex);
		if (~socketIndex) {
			connectionsArray.splice(socketIndex, 1);
	    }
	});
 
 	console.log('Nuevo Socket conectado!');
 	connectionsArray.push(socket);
});

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
  //next(err);
//});

//Captura el status 404 y renderiza a la vista correspondiente
app.use(function(req, res, next) {
  //res.status(404).send('Sorry cant find that!');
  res.locals.user = req.user;
  res.status(404).render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
