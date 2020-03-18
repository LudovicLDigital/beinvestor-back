require('dotenv').config();
const hostname = 'localhost';
const port = 3000;
const app = require('./shared/config/main-app-router');

app.listen(port, hostname, function(){
    console.log("Serve starting on -----> http://"+ hostname +":"+port+"\n");
});