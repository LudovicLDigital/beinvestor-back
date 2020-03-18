const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

module.exports = router;
module.exports = app;