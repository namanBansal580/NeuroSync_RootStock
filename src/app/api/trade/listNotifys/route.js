import connectDb from "../../../../../middleware/mongoose";
import requestSchema from "../../../../../models/requestSchema";

export async function POST(req,response) {
    try{
        await connectDb()
        let data=await req.json();
        console.log("Data i am Getting in Notifys:::",data);
        
        // data contains the wallet address
        // expired should be not true
        let findedReqs=await requestSchema.find({sender_address:data.sender_address });
        // this would list all the requests
        return Response.json({"success":true,"msg":"","data":findedReqs},{"data":200});
    }
    catch(err){
        console.log("My Error is:::",err);
        
        return Response.json({"success":false,"msg":err},{"status":400});
    }
}