require('dotenv').config();
const hostname = '192.168.1.57';
const port = 3000;
const app = require('./shared/config/main-app-router');
const http = require('http').Server(app);
const SocketManager = require('./shared/util/socket-manager');
SocketManager.prepareConnection(http);
http.listen(port, hostname, function(){
    console.log("Serve starting on -----> http://"+ hostname +":"+port+"\n");

});

