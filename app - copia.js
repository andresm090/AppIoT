var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var globalSocket = {};

var index = require('./routes/index');
var users = require('./routes/users');
var mqtt = require('./src/serverMQTT');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var serverMQTT = new mqtt();

serverMQTT.connect(function(clientMQTT) {
	clientMQTT.subscribe('prueba');
	console.log('Conecte');
});

var io = require('socket.io').listen(app.listen(3300, function() { //listener
        console.log('Home Environmental app listening on port 3300!');
    }));

    io.sockets.on('connection', function(socket) {
        globalSocket[socket.id] = socket; //set global socket
        if (params.logs == 1) {
            console.log('conectado al socket ' + socket.id);
        }
        data = '{"temperatura":"'+temperatura+'"}';
		updateSockets(data);
        socket.on("disconnect", function() {
            if (params.logs == 1) {
                console.log('disconnect del socket ' + socket.id);
            }
            delete globalSocket[socket.id];
        });
    });
	
	var updateSockets = function(data) {
  // adding the time of the last update
  data.time = new Date();
  console.log(data);
  connectionsArray.forEach(function(tmpSocket) {
    tmpSocket.emit('notification', data);
  });
};


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
