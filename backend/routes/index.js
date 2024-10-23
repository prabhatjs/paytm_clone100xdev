const express=require("express");
const userRouter=require('../routes/userrouter');
const transationRouter=require('../routes/transationRouter')
const router=express.Router();

router.use('/user',userRouter);
router.use('/account',transationRouter);

module.exports=router;