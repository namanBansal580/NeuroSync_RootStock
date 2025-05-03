import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    address:{type:String,require:true,unique:true},
    userName:{type:String},
    email:{type:String,require:true},
    account_id:{type:String},

},{timestamps:true})

export default mongoose.models.UserInfo || mongoose.model("UserInfo", userSchema);
