var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require("fs");

const lastCommit = JSON.parse(fs.readFileSync('lastCommit.json', 'utf-8'));
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'sfwreport@gmail.com',
        pass: 'Smart@12345'
    }
}));

var mailOptions = {
    from: 'sfwreport@gmail.co',
    to: 'ajayprajapat@live.com',
    subject: 'Deployment '+ lastCommit.version,
    text: lastCommit.emailMessage
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});  