const Product = require('../models/Product');
const Review = require('../models/Review');
const CustomAPIError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const checkPermissions = require('../utils')
const createReview = async (req, res) => {

    const { product: productId } = req.body;
    // const product = req.body.productId\;
    console.log(productId);
    console.log(req.user.userId)
    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new CustomAPIError.NotFoundError(`No product with id: ${productId}`)
    }
    const alreadySubmitted = await Review.findOne({
        product: productId,
        user: req.user.userId,
    })
    if (alreadySubmitted) {
        throw new CustomAPIError.NotFoundError(`Review already submitted`);
    }
    req.body.user = req.user.userId;


    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });

}
const getAllReview = async (req, res) => {
    const review = await Review.find({})
        .populate({
            path: 'product',
            select: 'name company price ',
        })
        .populate({
            path: 'user',
            select: 'name email ',
        });
    if (!review) {
        throw new CustomAPIError.NotFoundError(`No reviews found`);
    }
    res.status(StatusCodes.OK).json({ review });
}
const getSingleReview = async (req, res) => {
    const reviewId = req.params.id;
    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomAPIError.NotFoundError(`No review found with this id`);
    }
    res.status(StatusCodes.OK).json({ review });
}
const updateReview = async (req, res) => {
    const reviewId = req.params.id;
    const { rating, title, commment } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomAPIError.NotFoundError(`No review found with this id`);
    }
    checkPermissions(req.user, review.user);
    review.rating = rating
    review.title = title
    review.comment = comment
    await review.save();
    res.status(StatusCodes.OK).json({ review });
}
const deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomAPIError.NotFoundError(`No review found with this id`);
    }
    checkPermissions(req.user, review.user);
    await Review.remove({ _id: reviewId });

    res.status(StatusCodes.OK).json({ msg: ` Success! review deleted` });
}
const getSingleProductReviews = async(req,res) =>{
    const {id: productId} = req.params
    const reviews = await Review.find({product:productId});
    res.status(StatusCodes.OK).json({reviews, count :reviews.length});
}   
module.exports = {
    createReview, getAllReview,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}