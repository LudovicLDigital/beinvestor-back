const express = require('express');
const app = express();

const userRouter = require('../../app/routes/users-route');
const authRouter = require('../../app/routes/auth-route');
const roleRouter = require('../../app/routes/roles-route');
const groupRouter = require('../../app/routes/groups-route');
const groupMessageRouter = require('../../app/routes/groups-message-route');

app.use(userRouter);
app.use(authRouter);
app.use(roleRouter);
app.use(groupRouter);
app.use(groupMessageRouter);

module.exports = app;