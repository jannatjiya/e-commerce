const express = require('express');
const Router = express.Router();

const {authenticateUser,authorizePermissions} = require('../middleware/authentication');

const {getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder 
}= require('../controllers/orderControllers') ;

Router
    .route('/')
    .get(authenticateUser,authorizePermissions('admin'), getAllOrders)
    .post(authenticateUser ,createOrder)

Router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser,updateOrder);

Router
    .route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)
    
module.exports = Router;
