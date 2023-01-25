const User = require('../models/User');
const {StatusCodes} =require('http-status-codes');

// const { CustomAPIError } = require('../errors');
const CustomAPIError = require('../errors');
const {createjwt,attachCookiesToResponse, createTokenUser,isTokenValid, createJwt} = require('../utils/index')
const crypto = require('crypto');
const register = async( req,res) =>{
    const { email,password,name,} = req.body;
    const emailAlereadyexist = await User.findOne({email});
    if(emailAlereadyexist){
        throw new CustomAPIError.BadRequestError('email already exists');
    }
    // first registerd user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' :'user'; 
    const verificationToken = crypto.randomBytes((40)).toString('hex');

    // const verificationToken = 'fake token';

    
    const user = await User.create({email,password,name ,role, verificationToken});
    // const tokenUser= { name:name,userId:user._id,email:email,role:role}//payload -->what we have to pass
    const tokenUser = createTokenUser(user);
    // attachCookiesToResponse ({res,user:tokenUser});
    //we are writing this all in attachCookies function in jwt file{
    // const token = createJwt({payload: tokenUser});
    // const oneDay = 1000*60*60*24;
    // res.cookie('token',token,{
    //     httpOnly:true,
    //     expires: new Date(Date.now()+oneDay)
    // })}

    res.status(StatusCodes.CREATED)
    .json({msg :'success! please check your email to verify account',verificationToken: user.verificationToken});
    // res.send ('register user')
}


const login = async( req,res) =>{
    const {name,email,password,role} = req.body;
    if(!email || !password){
        throw new CustomAPIError.BadRequestError('Invalid Credentials');
    }
    const user = await User.findOne ({email});
    // if(!user){
    //     throw new CustomAPIError.BadRequestError('User does not exist');
    // }
    // const isPasswordCorrect = await user.comparePassword(password);
   
    // if (!isPasswordCorrect) {
    //     throw new CustomAPIError.UnauthenticatedError('Invalid Credentials');
    //   }
    //   if (!user.isVerified) {
    //     throw new CustomAPIError.UnauthenticatedError('please veryify your email');
    //   }
    // const tokenUser= { name:user.name,userId:user._id,email:user.email,role:user.role}//payload -->what we have to pass
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse ({res,user:tokenUser});
    res.status(StatusCodes.CREATED).json({user: tokenUser});
    console.log({user: tokenUser})
    // const user = User.create({

    // })

    
}


const logout = async( req,res) =>{
    res.cookie('token','logout'),{//here second argument is to change the first name of the token passed
        httpOnly:true,
        expires : new Date(Date.now() ),

    }
    res.status(StatusCodes.OK).json({msg:'user log out successfully'});
}

module.exports = {
    register,
    login,
    logout,
}