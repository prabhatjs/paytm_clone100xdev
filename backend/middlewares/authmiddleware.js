const JWT_SECRATE=require('../config/config');
const jwt=require('jsonwebtoken');

const authmiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    // console.log(authHeader);
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({
            message:"not Decod token"
        })
    }
    const token=authHeader.split(' ')[1];
    console.log(token);
    try {
        const decode=jwt.verify(token,JWT_SECRATE);
        if(decode.userid){
            req.userid=decode.userid;
            next();
        }
        else{
            return res.status(403).json({})
        }
        
    } catch (error) {
            return res.status(403).json({})
    }
}

module.exports=authmiddleware;