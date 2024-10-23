const mongoose=require('mongoose');

async function connectDB(){
try {
    await mongoose.connect('mongodb://localhost:27017/paytm_cloneDB');
    console.log("DB Connect");
} catch (error) 
    {
    console.log("DB Error Happain");
    console.log(error);
    }
}
module.exports=connectDB;