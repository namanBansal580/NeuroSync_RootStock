import mongoose from "mongoose";
const connectDb=async()=>{
    try{

        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
        })
        console.log("Mongo DB Connected Successfully");
    }
    catch(error){
        console.log("Error Connecting To MongoDb",error);
    }
    
}
export default connectDb
