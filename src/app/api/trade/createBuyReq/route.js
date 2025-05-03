import connectDb from "../../../../../middleware/mongoose";
import requestSchema from "../../../../../models/requestSchema";
import tradeInfo from "../../../../../models/tradeInfo";

export async function POST(request,response) {
    let data=await request.json();
    // i want to buy from this owner
    // now the buyer creates buy request 
    // provide end to end comunication between buyer and seller
    await connectDb();
    
      const trade = await tradeInfo.findOne({ _id: data.tradeId });
        if (!trade || trade.expired === true) {
          return new Response(JSON.stringify({
            success: false,
            msg: "Trade Request Expired"
          }), { status: 400 });
        }
    let p=await requestSchema({
        rec_address:data.rec_address,
        sender_address:data.sender_address,
        userName:data.userName,
        tradeId:data.tradeId,// received trade id from trade info when user buys
        isBuyerAccepted:true
    })
    // this is my schema that i have made
    await p.save();
    return Response.json({"success":true,"msg":"Request Created Successfully"});
}