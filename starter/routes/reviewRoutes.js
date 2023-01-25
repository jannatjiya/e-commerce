const express = require('express');
const Router = express();
const {createReview,getAllReview,
    getSingleReview,
    updateReview,
    deleteReview} = require('../controllers/reviewControllers');
const {authenticateUser,authorizePermissions} = require('../middleware/authentication');
Router
    .route('/')
    .get(getAllReview)
    .post(authenticateUser,createReview)


Router
    .route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser,updateReview)
    .delete(authenticateUser,deleteReview);

module.exports = Router;