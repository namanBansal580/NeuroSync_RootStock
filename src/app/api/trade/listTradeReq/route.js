import connectDb from "../../../../../middleware/mongoose";
import tradeInfo from "../../../../../models/tradeInfo";

export async function POST(request, response) {
  try {
    await connectDb()
    const data = await request.json();
    const { tokenId } = data;

    const now = new Date();

    // Step 1: Find all non-expired tradeInfos for the tokenId
    const nonExpiredDocs = await tradeInfo.find({ tokenId, expired: false });

    // Step 2: Check time difference for each document
    for (let doc of nonExpiredDocs) {
      const createdAt = new Date(doc.createdAt);
      const diffInMinutes = (now - createdAt) / (1000 * 60);

      if (diffInMinutes > 115) {
        // Expire the document if it's older than 1 minute
        await tradeInfo.updateOne({ _id: doc._id }, { $set: { expired: true } });
      }
    }

    // Step 3: Fetch updated non-expired docs
    const validNonExpiredDocs = await tradeInfo.find({ tokenId, expired: false });

    return Response.json(
      { success: true, msg: "Valid non-expired tradeInfos", data: validNonExpiredDocs },
      { status: 202 }
    );
  } catch (err) {
    return Response.json(
      { success: false, msg: err.message || "Error occurred", data: "" },
      { status: 400 }
    );
  }
}
