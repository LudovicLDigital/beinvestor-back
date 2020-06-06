require('custom-env').env(true);
const hostname = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;
const app = require('./shared/config/main-app-router');
const http = require('http').Server(app);
const SocketManager = require('./shared/util/socket-manager');
const MailSender = require('./shared/util/mail-sender');
const fs = require('fs');
const path = require('path');
const express = require('express');
//setup public folder
app.use(express.static('./public'));
fs.access(__dirname + '/../files', fs.constants.F_OK, (error) => {
    if (error) {
        fs.mkdir(__dirname + '/../files', {}, (errorMdirMain) => {
            if (errorMdirMain) {
                console.log(errorMdirMain);
            }
            else {
                fs.mkdir(__dirname + '/../files/pictures', {}, (errorMdirSub) => {
                    if (errorMdirSub) {
                        console.log(errorMdirSub);
                    }
                });
            }
        });
    }
});
SocketManager.prepareConnection(http);
MailSender.configureSMTP();
//TEMPORAIRE USED TO SHOW MAIL TEMPLATES
// view engine setup
// app.set('views', path.join(__dirname, 'shared/views'));
// app.set('view engine', 'ejs');
// app.get('/',function (req, res) {
//     // res.render('mail-confirm-account', {
//     //     subject: 'Activation de votre compte',
//     //     name: 'Ludovic',
//     //     activationLink: 'beinvestorapp://account/active',
//     //     code: 'Test42',
//     // })
//     // res.render('mail-password-changed', {
//     //     subject: 'Changement du mot de passe',
//     //     login: 'Ludovic'
//     // })
//     res.render('mail-reset-password-key', {
//         subject: 'Réinitialisation du mot de passe',
//         name: 'Ludovic',
//         resetLink: 'beinvestorapp://account/reset',
//         code: 'Test42',
//     })
//
// });
http.listen(port, hostname, function(){
    console.log("Serve starting on -----> http://"+ hostname +":"+port+"\n");
    process.env.SERVER_ROOT = path.join(__dirname, '/..');
});

// require('crypto').randomBytes(32).toString('hex')  Use this to generate keys

