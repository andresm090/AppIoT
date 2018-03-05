var passport = require('passport');
var Comuna = require('../model/Comuna');
var Generador = require('../model/Generador');
var nodemailer = require('nodemailer');


exports.sendMailPublicacion = (req, res, next) => {

	var email = req.body.email;
	var asunto = req.body.asunto;
	console.log(email);
	var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dashboardappIot@gmail.com',
            pass: 'abc123456789def'
        },
        tls: {
        	rejectUnauthorized: false
    	}
    });

	var mailOptions = {
	    from: 'AppIot <dashboardappIot@gmail.com>',
	    to: email,
	    subject: asunto,
	    text: 'Contenido del email' // cargar data de republiacion
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if (error){
	        console.log(error); 
	    } else {
	        console.log("Email sent");
	        console.log('Message sent: ' + info.response);
	    }
	});
	transporter.close();
	return res.send("<div id=\"alertMsj\" class=\"alert alert-success alert-dismissible\" role=\"alert\"> <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> <strong> Email enviado</strong>");
	
};