const nodemailer = require('nodemailer');
const ejs = require("ejs");
const MailSender = {
    configureSMTP() {
        MailSender.transport = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '6ce1b94b9f7770',
                pass: 'e7e8a04016fa4b'
            }
        });
    },
    sendAnAppMail(to, subject, templateFileName, dataForTemplate) {
        ejs.renderFile(`${__dirname}/../views/${templateFileName}.ejs`, dataForTemplate, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                const message = {
                    from: 'Ludovic@beinvestor-team.com', // Sender address
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