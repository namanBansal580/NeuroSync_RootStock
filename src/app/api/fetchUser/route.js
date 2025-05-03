import connectDb from "../../../../middleware/mongoose";
import userInfo from "../../../../models/userInfo";

export async function POST(req,res) {
    try{
        await connectDb();
        let data=await req.json();
        console.log("My Data is::",data);
        
        let m=await userInfo.find({address:data.sellerAddress})
        if(!m){
            return Response.json({"success":false,data,"msg":error,"data":m})
        }
        return Response.json({"success":true,data,"msg":error,"data":m})
    }
    catch(error){
        return Response.json({"success":false,"msg":error})
    }
}