import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    rec_address: { type: String, required: true },
    sender_address: { type: String, required: true },
    userName: { type: String },
    tradeId: { type: String, required: true },
    isSellerAccepted: { type: Boolean, default: false },
    isBuyerAccepted: { type: Boolean, default: false },
    isSellerRejected: { type: Boolean, default: false },
    msg: { type: String },
    paybySeller: { type: Boolean, default: false },
    paybyBuyer: { type: Boolean, default: false },
    paymentDone: { type: Boolean, default: false },
    payment_id: { type: String }
});

// ✅ Compound unique index to ensure tradeId is unique per sender-recipient pair
requestSchema.index(
    { rec_address: 1, sender_address: 1, tradeId: 1 },
    { unique: true }
);

// ✅ Correct Next.js-safe export with PascalCase model name
export default mongoose.models.Request || mongoose.model("Request", requestSchema);
