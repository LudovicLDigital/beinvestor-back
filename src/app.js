require('dotenv').config();
const hostname = '192.168.1.57';
const port = 3000;
const app = require('./shared/config/main-app-router');
const http = require('http').Server(app);
const SocketManager = require('./shared/util/socket-manager');
const MailSender = require('./shared/util/mail-sender');
const fs = require('fs');
const path = require('path')
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
})
SocketManager.prepareConnection(http);
MailSender.configureSMTP();
http.listen(port, hostname, function(){
    console.log("Serve starting on -----> http://"+ hostname +":"+port+"\n");
    process.env.SERVER_ROOT = path.join(__dirname, '/..');
});

