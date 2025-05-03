
import connectDb from "../../../../../middleware/mongoose";
import requestSchema from "../../../../../models/requestSchema";

export async function GET(req,res) {
  try {
    // Parse incoming data

    // Connect to MongoDB (if not already connected)
    await connectDb()

    // Update the request document
    const updatedDoc = await requestSchema.findOneAndUpdate(
      { tradeId }, // Find by tradeId
      {
        $set: {
        isSellerRejected: "false",
        },
      },
      { new: true }
    );

    if (!updatedDoc) {
      return Response.json({ success: false, msg: "Unable To Rejected" });
    }


    return Response.json({ success: true,msg:"Request Rejected" });
  } catch (err) {
    return Response.json({ success: false, msg: err.message || "Internal Server Error" });
  }
}
