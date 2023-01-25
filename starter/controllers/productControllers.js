const  Product = require('../models/Product');
const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require('../errors');

const path = require('path');
const createProduct = async(req,res)=>{
    req.body.user = req.user.userId;
    console.log(req.body);
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product});
    
}
const getAllProducts = async(req,res)=>{
    const products = await Product.find({});
    if(!products){
        throw new CustomAPIError.NotFoundError(`products not found`);
    }
    res.status(StatusCodes.OK).json({products });
}
const getSingleProduct = async(req,res)=>{
    const productId = req.params.id;
    
    //or const {id: productId } = req.params;
    const product = await Product.find({_id :productId}).populate('reviews');
    if(!product){
        throw new CustomAPIError.NotFoundError(`No product with id " ${productId}`);
    }
    res.status(StatusCodes.OK).json({product});
    // console.log(productId);
    

}
const updateProduct = async(req,res)=>{
    const productId = req.params.id;
    //or const {id: productId } = req.params;
    const product = await Product.findOneAndUpdate({_id :productId},req.body,{
        new:true,
        runValidators : true,  
    });

    if(!product){
        throw new CustomAPIError.NotFoundError(`No product with id " ${productId}`);
    }
    res.status(StatusCodes.OK).json({product });
   
}

const deleteProduct = async(req,res)=>{
    const productId = req.params.id;
    //or const {id: productId } = req.params;
    const product = await Product.findOne({_id :productId});

    if(!product){
        throw new CustomAPIError.NotFoundError(`No product with id " ${productId}`);
    }
    await product.remove();
    res.status(StatusCodes.OK).json({msg:'Success ! Product Removed'});
}
const uploadImage = async(req,res)=>{
   if(!req.files){
    throw new CustomAPIError.BadRequestError('no file uploaded');

   }
   const productImage = req.files.image;
   //mimetype is the name of the property and startsWith is a method available in js
   if(!productImage.mimetype.startsWith('image')){
        throw new CustomAPIError.BadRequestError('Please upload image');
   }
   const maxSize = 1024* 1024;
   if(productImage.size >  maxSize){
    throw new CustomAPIError.BadRequestError('Please upload image size smaller than 1MB ');
   }
   const imagePath = path.join(__dirname,'../public/uploads.' + `${productImage.name}`)
   await productImage.mv(imagePath);
   res.status(StatusCodes.OK).json({image:`uploads/${productImage.name}`})
}
module.exports = {
    createProduct,getAllProducts,getSingleProduct,updateProduct,uploadImage,
    deleteProduct
}