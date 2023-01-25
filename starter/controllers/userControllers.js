const User = require('../models/User')
const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require('../errors');
const UnauthenticatedError = require('../errors');

const {createTokenUser ,attachCookiesToResponse, checkPermissions} = require('../utils')
const getAllUser = async(req,res)=>{
    // const {name,email,role } = req.body;
    console.log(req);
    const users =await  User.find({role:'user'}).select('-password');
    res.status(StatusCodes.OK).json({users});
   
}
// const getSinglelUser = async(req,res)=>{
//     console.log('user');
// }
const getSinglelUser = async(req,res)=>{
   
    
    const user =await  User.findOne({_id : req.params.id}).select('-password');
    
    if(!user){
        throw new CustomAPIError.NotFoundError(`No user found`);
    }
    
    
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({user});
    

   
}
const showCurrentUser = async(req,res)=>{
   res.status(StatusCodes.OK).json({user:req.user});
}

// update user with user.save()
const updateUser = async(req,res)=>{
    const {name,email } = req.body;
    if(!email || !name){
        throw new CustomAPIError.BadRequestError('Please provide all values ');
    }

    const user = await User.findOne({ _id : req.user.userId});
    user.email = email;
    user.name = name;

    await user.save();
    
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({users});
}
const updateUserPassword = async(req,res)=>{
    const { oldPassword ,newPassword} = req.body;
    if(!oldPassword || !newPassword ) {
        console.log(oldPassword,newPassword);
        throw new CustomAPIError.BadRequestError('Please provide both ');
    }
    console.log(req.user);
    const user = await User.findOne({_id : req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomAPIError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({msg :'Password Sucessfully changed'});
}

module.exports = {
    getAllUser,
    getSinglelUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}

//update user with findOneAndUpdate
// const updateUser = async(req,res)=>{
//     const {name,email } = req.body;
//     if(!email || !name){
//         throw new CustomAPIError.BadRequestError('Please provide all values ');
//     }
//     const user = await User.findOneAndUpdate(
//         { _id : req.user.userId},
//         {email,name},
//         {new : true, runValidators: true}
//     );
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({res,user:tokenUser});
//     res.status(StatusCodes.OK).json({users});
// }