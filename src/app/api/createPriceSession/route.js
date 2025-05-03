export async function POST(req,res ) {
    try {
        const data = await req.json();
        const address = data.address; // Expected target price from client
        const tokenId = data.tokenId; // Expected target price from client
        const tokens = data.tokens;
        const expPrice = data.expPrice;

        const url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=rif-token`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': 'CG-hqMGzd5r3hMZFU7A9EZ1Mkcw'
            }
        };

        const checkPrice = async () => {
            const response = await fetch(url, options);
            const priceData = await response.json();
            const currentPrice = priceData[tokenId]?.usd;
            console.log("Current Price:::",currentPrice);
            
            if (!currentPrice) {
                throw new Error("Invalid coin or response from API");
            }

            if (currentPrice >= expPrice) {
                fetch(`${process.env.NEXT_PUBLIC_NEUROHOST}/api/trade/createSellReq`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      address: address, // Use connected wallet or fallback
                      userName: "abc",
                      tokenId:tokenId,
                      tokens:tokens,
                      expPrice: tokens*expPrice,
                    }),
                  })
                return Response.json({ success: true, msg: "Target price reached", currentPrice });
            } else {
                return null;
            }
        };

        // Poll every 5 seconds up to a max duration (e.g. 2 minutes)
        const maxRetries = 24;
        for (let i = 0; i < maxRetries; i++) {
            const result = await checkPrice();
            if (result) return result;
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        }

        return Response.json({ success: false, msg: "Price not reached within timeout" });

    } catch (error) {
        return Response.json({ success: false, msg: error.message || "Unknown error" });
    }
}
