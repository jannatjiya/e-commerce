const express = require('express');
const Router = express.Router();
const {authenticateUser,authorizePermissions} = require('../middleware/authentication');


const {getAllUser,getSinglelUser,showCurrentUser,updateUser, updateUserPassword} = require('../controllers/userControllers');

Router.route('/').get(authenticateUser,authorizePermissions('admin'),getAllUser);

Router.route('/showMe').get(showCurrentUser);
Router.route('/updateUser').post(authenticateUser,updateUser);
Router.route('/updateUserPassword').post(authenticateUser,updateUserPassword);


Router.route('/:id').get(authenticateUser,getSinglelUser);

module.exports = Router;