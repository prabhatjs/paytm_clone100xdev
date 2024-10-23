const crypto=require('crypto');
const secrate=crypto.randomBytes(32).toString('hex');
const JWT_SECRATE="secrate";
module.exports=JWT_SECRATE