const express = require('express');
const Router = express.Router();
const {register,login,logout} = require('../controllers/authControllers');

Router.post('/register', register);
Router.post('/login', login);
Router.post('/logout', logout);


module.exports = Router;