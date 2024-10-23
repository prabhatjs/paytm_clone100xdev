const express=require("express");
const user=require('../model/user');
const zod=require('zod');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const JWT_SECRATE=require('../config/config');
const authmiddleware = require("../middlewares/authmiddleware");
const account = require("../model/accounts");
const router=express.Router();




//!zod validation--------------------

const singupValidation=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string(), 
});


const SingInValidation=zod.object({
    username:zod.string().email(),
    password:zod.string()
})

const updateValidation=zod.object({
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string()
})

//!-------------------------------------

router.post('/signup',async (req,res)=>{
    try{
    const {username,password,firstname,lastname}=req.body;
    const {success}=singupValidation.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message:"Incorect Inputs"
        })
    }
    //*check for username is exist or not------------------------

    const isUserExist=await user.findOne({username});
    console.log("me yhan hun "+isUserExist);
    if(isUserExist){
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    //*---------------------Encrypt Password-------------------------------------------
   
    let salt=await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(password,salt);

    const createduser=await user.create({
        username,
        password:hashedpassword,
        firstname,
        lastname
    })
    //?---------------------------Genrate Token-------------------------------------------
    const userid=createduser._id;

        //create new Account and add random amount int--
        await account.create({
            userid,
            balance: 1 + Math.random()*10000,
        });

    const token=jwt.sign({userid},JWT_SECRATE);

    console.log(createduser);
    return res.status(200).json({
        message:"Success Created User",
        token:token
    })
}
    catch(error){
        return res.status(500).json({
            message:"faild",
            Error:error.errmsg
        })
    }
});


router.post('/signin',async (req,res)=>{
    try {
        const {username,password}=req.body;

        const {success}=SingInValidation.safeParse(req.body);
        if(!success){
            return res.status(411).json({
                message:"Incorect Inputs"
            })
        }
        
        const userExist=await user.findOne({
            username:req.body.username,
        });
        if(!userExist){
            return res.status(400).json({
                message:"User is not registerd"
            })
        }
        const matchpasword=await bcrypt.compare(req.body.password,userExist.password);
        console.log(matchpasword);
        console.log(userExist);
        
        if(matchpasword){
            const token=jwt.sign({userid:userExist._id},JWT_SECRATE);
            res.json({token:token});
            return;
        }else{
            res.status(411).json({
                message: "Error while logging in"
            })
        }

    } catch (error) {
        res.status(411).json({
            message: error
        })
    }
});

router.put('/changepassword',authmiddleware, async (req,res)=>{
        const {succes}=updateValidation.safeParse(req.body);
        if(!succes){
            return res.status(411).json({
                message:'Error While updating Information'
            })
        }
        await user.updateOne({_id:req.userid},req.body);
        res.json({
            message: "Updated successfully"
        })
});

router.get('/bulk',(req,res)=>{
    const filter=req.query.filter||"";
    const users=user.find({
        $or: [{
            firstname:{
                "$regex":filter
            }
        },
            {
                lastname:{
                    "$regex":filter
            }
        }]
    })
        res.json({
            user:users.map(user=>({
                username:user.username,
                firstname:user.firstname,
                lastname:user.lastname,
                _id:user._id
            }))
        }
        )

})

module.exports=router;