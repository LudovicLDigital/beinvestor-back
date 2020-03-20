const express = require('express');
const app = express();

const userRouter = require('../../app/routes/users-route');
const authRouter = require('../../app/routes/auth-route');
const roleRouter = require('../../app/routes/roles-route');

app.use(userRouter);
app.use(authRouter);
app.use(roleRouter);

module.exports = app;