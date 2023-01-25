const express = require('express');
const Router = express.Router();
const { createProduct,getAllProducts,
        getSingleProduct,updateProduct,
        uploadImage,deleteProduct    
    } = require('../controllers/productControllers');
    
const {authenticateUser,authorizePermissions} = require('../middleware/authentication');
const { getSingleProductReviews} = require('../controllers/reviewControllers');


Router
    .route('/').post([authenticateUser,authorizePermissions('admin')],createProduct)
    .get(getAllProducts);

Router.route('/uploadImage').post(uploadImage);
Router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser,authorizePermissions('admin')],updateProduct)
    .delete([authenticateUser,authorizePermissions('admin')],deleteProduct)


Router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = Router;