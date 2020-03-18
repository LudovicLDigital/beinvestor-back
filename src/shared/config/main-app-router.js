const express = require('express');
const app = express();

const userRouter = require('../../app/routes/users-route');
const authRouter = require('../../app/routes/auth-route');

app.use(userRouter);
app.use(authRouter);

module.exports = app;