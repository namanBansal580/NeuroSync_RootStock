export function checkTradeExpired(){

    const now = new Date();
    
    // Step 1: Find all non-expired tradeInfos for the tokenId
  //  const nonExpiredDocs = await tradeInfo.find({ tokenId, expired: false });
    
    // Step 2: Check time difference for each document
    for (let doc of nonExpiredDocs) {
        const createdAt = new Date(doc.createdAt);
        const diffInMinutes = (now - createdAt) / (1000 * 60);
        
        if (diffInMinutes > 115) {
            // Expire the document if it's older than 1 minute
            //await tradeInfo.updateOne({ _id: doc._id }, { $set: { expired: true } });
        }
    }
}