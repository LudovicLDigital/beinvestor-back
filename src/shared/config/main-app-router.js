const express = require('express');
const app = express();

const userRouter = require('../../app/routes/users-route');
const authRouter = require('../../app/routes/auth-route');
const roleRouter = require('../../app/routes/roles-route');
const groupRouter = require('../../app/routes/groups-route');
const groupMessageRouter = require('../../app/routes/groups-message-route');
const cityRouter = require('../../app/routes/city-route');
const simulatorRouter = require('../../app/routes/simulator-route');

app.use(userRouter);
app.use(authRouter);
app.use(roleRouter);
app.use(groupRouter);
app.use(groupMessageRouter);
app.use(cityRouter);
app.use(simulatorRouter);

module.exports = app;