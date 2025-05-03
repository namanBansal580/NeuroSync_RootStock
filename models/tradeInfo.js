// models/tradeInfo.js
import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  address: { type: String, required: true },
  userName: { type: String, required: true },
  tokenId: { type: String, required: true },
  tokens: { type: String, required: true },
  expPrice: { type: String, required: true },
  expired: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.tradeInfo || mongoose.model("tradeInfo", tradeSchema);
