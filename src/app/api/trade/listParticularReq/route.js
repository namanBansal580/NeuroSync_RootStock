import connectDb from "../../../../../middleware/mongoose";
import requestSchema from "../../../../../models/requestSchema";
import tradeInfo from "../../../../../models/tradeInfo";

export async function POST(request,response) {
    try{
      await connectDb()
        let data=await request.json();
        console.log("My Data Received is::::",data);
        
        // tradeInfo
         const trade = await tradeInfo.findOne({ _id: data.tradeId });
        
            if (!trade || trade.expired === true) {
              return new Response(JSON.stringify({
                success: false,
                msg: "Trade Request Expired"
              }), { status: 400 });
            }
        let p=await requestSchema.findOne({"sender_address":data.sender_address,"rec_address":data.rec_address,"tradeId":data.tradeId});
        if(!p)throw new Error("Unable To Find User")
        return Response.json({"success":true,"msg":"Trade Request",
            reqData:p,tradeData:trade},{status:200});
    }
    catch(err){
      console.log("my error is:::::",err);
      
        return Response.json({"success":false,"msg":err})
    }
        
}