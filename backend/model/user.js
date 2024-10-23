const mongoose=require('mongoose');

const userschema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minLength: 6,
        maxLength: 20
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstname:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30,
        trim:true,
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    }
});

const user=mongoose.model("user",userschema);
module.exports=user;