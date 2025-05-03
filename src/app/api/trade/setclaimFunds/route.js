import connectDb from "../../../../../middleware/mongoose";
import requestSchema from "../../../../../models/requestSchema";
import tradeInfo from "../../../../../models/tradeInfo";

export async function POST(request) {
  try {
    // when user clicks on buy request then waiting for the seller if he accepts then lock the funds in the contract okh!
    const data = await request.json();
    
    await connectDb();

    // Validate that trade exists and is not expired
    const trade = await tradeInfo.findOne({ _id: data.tradeId });

    if (!trade || trade.expired === true) {
      return new Response(JSON.stringify({
        success: false,
        msg: "Trade Request Expired"
      }), { status: 400 });
    }

    // Update seller's acceptance
    const updated = await requestSchema.findOneAndDelete(
      {
        sender_address: data.sender_address,
        rec_address: data.rec_address,
        tradeId: data.tradeId
      }
    );

    if (!updated) {
      return new Response(JSON.stringify({
        success: false,
        msg: "Request not found or update failed"
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      success: true,
      msg: "Successfully Deleted",
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      msg: err.message || "Something went wrong"
    }), { status: 500 });
  }
}
