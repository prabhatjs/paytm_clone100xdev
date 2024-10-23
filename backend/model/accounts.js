const mongoose=require('mongoose');

const accountShema= new mongoose.Schema({
   userid:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'user'
   },
   balance:{
    type:Number,
    required:true,
   }
})
const account=mongoose.model('account',accountShema);
module.exports=account;