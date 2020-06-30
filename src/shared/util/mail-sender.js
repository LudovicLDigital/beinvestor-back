const nodemailer = require('nodemailer');
const ejs = require("ejs");
const MailSender = {
    configureSMTP() {
        MailSender.transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_AUTH_USER,
                pass: process.env.MAIL_AUTH_PASS
            }
        });
    },
    sendAnAppMail(to, subject, templateFileName, dataForTemplate) {
        ejs.renderFile(`${__dirname}/../views/${templateFileName}.ejs`, dataForTemplate, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                const message = {
                    from: process.env.MAIL_TEAM, // Sender address
                    to: to,         // List of recipients
                    subject: subject, // Subject line
                    html: data,
                    attachments: [{
                        filename: 'icon.png',
                        path: process.env.SERVER_ROOT +'/public/assets/icon.png',
                        cid: 'logo' // for <img/> in mail body
                    }]
                };
                MailSender.transport.sendMail(message, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(info);
                    }
                });
            }
        });
    }
};
module.exports = MailSender;