const mongoose = require("mongoose")

const mongoURI=process.env.MONGO_URL


const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then((res)=>{
        console.log("Connected To Mongo Successfully")
    }).catch((error)=>{
        console.log('error encountered',error)
    });
       
    }

module.exports=connectToMongo;