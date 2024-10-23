const express = require('express');
const authmiddleware = require('../middlewares/authmiddleware');
const account = require('../model/accounts');
const router=express.Router();

router.get('/checkbalance', authmiddleware,async(req,res)=>{
    console.log(req.userid);
    const accountb=await account.findOne({
        userid:req.userid
    });

    res.json({
       accountbalance:accountb.balance
    })
});
router.post('/transfer',async (req,res)=>{
  const session=await mongoose.startSession();
  session.startTransaction();
  const {amount,to}=req.body;
    //check you balance
    const accountb=await account.findOne({userid:req.userid}).session(session);
    if(!accountb||accountb.balance<account){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Insufficient balance"
        })
    }
    //check reciver account is exist or not
    const toaccount=await account.findOne({userid:to}).session(session);
    if(!toaccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid Account"
        })
    }
    //send money //
    await account.updateOne({userid:req.userid},{$inc :{balance:-amount}}).session(session);
    await account.updateOne({userid:to},{$inc: {balance:amount}}).session(session);
    await session.commitTransaction();
    res.json({
        message:"Transfer successfull"
    });
})

module.exports=router;