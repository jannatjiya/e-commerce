const CustomAPIError = require('../errors');
const { removeListener } = require('../models/User');
const {isTokenValid} = require('../utils');

const authenticateUser = async(req,res,next) =>{
    const token = req.signedCookies.token;
    const {name,userId,email,role} = isTokenValid({token});
        
    req.user = {name,userId,email,role};
    // console.log(req.user.role);
    next();
    // console.log(token)

    // if(!token){
    //     throw new CustomAPIError.UnauthenticatedError('Authentication Invalid');
    // }
    // try{
       
    //     const {name,userId,email,role} = isTokenValid({token});
        
    //     req.user = {name,userId,email,role};
    //     // console.log(req.user.role);
    //     next();
    // }catch(error){
    //     throw new CustomAPIError.UnauthenticatedError('Authentication Invalid');
       
    // }
    
};
// const authorizePermissions = (req,res,next) =>{
    
//     if(req.user.role !== 'admin'){
//         throw new CustomAPIError.UnauthenticatedError(
//             'Unauthorized to access this route'
//         )
//     }
//     console.log('admiin route');
//     next();
// }
const authorizePermissions = (...roles) =>{
    console.log(roles);
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            throw new CustomAPIError.UnauthenticatedError(
                'Unauthorized to access this route'
            )
        }
        next();
    };
}
module.exports = {
    authenticateUser,
    authorizePermissions
};