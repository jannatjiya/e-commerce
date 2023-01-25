const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide name of the products'],
        maxlength: [100, `Name can't be more than 100 characters`],

    },
    price: {
        type: String,
        required: [true, 'Please provide price of the products'],
        default: 0
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please provide name of the products'],
        maxlength: [1000, `Description can't be more than 100 characters`],
    },
    image: {
        type: String,
        default: '/uploads/example.jpg',

    },
    category: {
        type: String,
        require: [true, 'Please provide product categories'],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
        type: String,
        require: [true, 'Please provide company'],
        enum: {
            values: ['ikea', 'liddy', 'marcos','apple'],
            message: '{VALUE} is not supported',
        },
    },
    colors: {
        type: [String],
        default:['black'],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeshipping: {
        type: [String],
        default: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }

}, { timestamps: true,toJSON :{virtuals :true},toObject: {virtuals: true} }
)
ProductSchema.virtual('reviews',{
    ref:'Review',
    localField :'_id',
    foreignField:'product',
    justOne:false,
})

ProductSchema.pre('remove',async function (next){
    await this.model ('Review').deleteMany({product : this._id})
})

module.exports = mongoose.model('Product', ProductSchema)