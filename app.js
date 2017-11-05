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
var controllerUser = require('./controllers/usercontroller');

var MONGO_URL = 'mongodb://127.0.0.1:27017/appIoT';

//var http = require('http').Server(app);
var io = require('socket.io').listen(3300);

var connectionsArray = []; // Arreglo de socket
var serverMQTT = new mqtt();
var swig = new swig.Swig();

var app = express();

//Configuracion de la base de datos
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (err) => {
	throw err;
	process.exit(1);
});

//Configuracion para manejo de sesiones
app.use(session ({
	secret: 'Secret',
	resave: true,
	saveUninitialized: true,
	store: new mongoStore({
		url: MONGO_URL,
		autoReconnect: true
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
app.use(express.static(path.join(__dirname, 'public')));


//Ruta de prueba
app.get('/userinfo', passportConfig.isAuthenticate, (req, res) => {
	res.json(req.user);
});

//Definicion de los manejadores de rutas
app.use('/', index);
app.use('/users', users);

//coneccion al broker
serverMQTT.connect(function(clientMQTT) {
	clientMQTT.subscribe('prueba');
	serverMQTT.observer(function(topic, value) {
		console.log(value.toString());
		//Notifico a los clientes
		connectionsArray.forEach(function(tmpSocket) {
			tmpSocket.emit('notification', value.toString() + '-' + topic);
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
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
