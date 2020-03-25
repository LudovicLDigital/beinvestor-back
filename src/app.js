require('dotenv').config();
const hostname = 'localhost';
const port = 3000;
const app = require('./shared/config/main-app-router');
const fs = require('fs');
const key = fs.readFileSync('encryption/private.key');
const cert = fs.readFileSync( 'encryption/primary.crt' );
const ca = fs.readFileSync( 'encryption/intermediate.crt' );
const https = require('https');
const options = {
    key: key,
    cert: cert,
    ca: ca
};
https.createServer(options, app).listen(port);