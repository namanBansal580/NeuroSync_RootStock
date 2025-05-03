 // adjust this import path as needed
import connectDb from "../../../../../middleware/mongoose";
import requestSchema from "../../../../../models/requestSchema";

export async function POST(req,res) {
  try {
    // Parse incoming data
    const data = await req.json();
    console.log("my Data is:::::",data);
    
    const { paymentId,sender_address,rec_address,trade_id } = data;

    if (!paymentId) {
      return Response.json({ success: false, msg: "Missing tradeId or paymentId" });
    }

    // Connect to MongoDB (if not already connected)
    await connectDb()

    // Update the request document
    const updatedDoc = await requestSchema.findOneAndUpdate(
      { "sender_address":sender_address,"rec_address":rec_address,"trade_id":trade_id }, // Find by tradeId
      {
        $set: {
          paybyBuyer: true,
          paymentDone:true,
          payment_id: paymentId,
        },
      },
      { new: true }
    );

    if (!updatedDoc) {
      return Response.json({ success: false, msg: "Trade not found" });
    }


    return Response.json({ success: true, data: updatedDoc });
  } catch (err) {
    return Response.json({ success: false, msg: err.message || "Internal Server Error" });
  }
}
