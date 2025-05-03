
import connectDb from "../../../../../middleware/mongoose";
import tradeInfo from "../../../../../models/tradeInfo";
export async function POST(request,response) {
    // we have to send the sell request to seller after then payement is confirmed than further proceed then
    // response from seller comes it then it send back to seller
    // if reponse is ok then release my token to seller else not
    try{  
        const data=await request.json();
        // now data contains my token id,sender address,name,tokens ,expected price
        await connectDb()
        let p=new tradeInfo({
            address:data.address,
            userName:data.userName,
            tokenId:data.tokenId,
            tokens:data.tokens,
            expPrice:data.expPrice
        })
        await p.save();
        return Response.json({"success":true,"msg":"Sell Request Created Successfully"})
    }
    catch(err){
        return Response.json({"success":false,"msg":err})
    }
    // now my api contains /trade/listTradeReq/tokenId
}