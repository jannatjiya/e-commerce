const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        require: [true, 'Please provide rating'],
    },
    title: {
        type: String,
        trim: true,
        require: [true, 'Please provide review title'],
        maxlength: 100,
    },
    comment: {
        type: String,
        require: [true, 'Please provide review title'],
        maxlength: 100,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,

    }
}, { timestamp: true })

//we are not using unique properties like in email for user schema because here we want to set up index for both user & product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.statics.calculateAverageRating = async function(productId){
    console.log(productId);
}

ReviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product);
    // console.log('post save hook called')
})
ReviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product);
    // console.log('post remove hook called')
})
module.exports = mongoose.model('Review', ReviewSchema);