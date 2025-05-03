import Stripe from 'stripe';
import userInfo from '../../../../models/userInfo';
import connectDb from '../../../../middleware/mongoose';

const stripe = new Stripe('sk_test_51RDvU7I1A72xH8GuzHrCbqmUvwdOJE02Dkev7UBbDxpNYcm4EgDcFNB48yvKBEarQl0t34Xr7r2IpLqhyTfIqqJE00EhgrQMGZ');  // Your platform's secret key

export async function POST(req, res) {
  // Check if the request is a POST request
    try {
      await connectDb();
      const { sellerEmail,sellerAddress} = await req.json();
      if(!sellerEmail || !sellerAddress){
        return Response.json({"success":false,"msg":"SellerEmail && Seller Address"});
      }
      console.log("My data Received in Stripe connect is:::"+sellerEmail+":::::"+sellerAddress);
      
      // Step 1: Create a new Express account for the seller
      
      const account = await stripe.accounts.create({
        type: 'express',
        email: sellerEmail,  // Seller's email
      });
      
      const accountId = account.id;  // This is the seller's connected account ID
      let isFinded=await userInfo.find({address:sellerAddress})
      if(!isFinded){
        let p=await userInfo({
          address:sellerAddress,
          email:sellerEmail,
          account_id:accountId
        })
        await p.save();
      }
    await userInfo.findOneAndUpdate({address:sellerAddress},{account_id:accountId});
      
      // Step 2: Generate the onboarding link for the seller to complete their setup
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: 'https://neuro-sync-iota.vercel.app/reauth',  // URL to redirect if they need to re-authenticate
        return_url: 'https://neuro-sync-iota.vercel.app/return',   // URL to redirect after successful onboarding
        type: 'account_onboarding',  // Type of link for onboarding
      });

      // Step 3: Respond with the onboarding URL for the seller to complete their setup
      const onboardingUrl = accountLink.url;

      // Send the onboarding URL to the seller (could be email or through a front-end response)
      return Response.json({ success:true,onboardingUrl, accountId });



    } catch (error) {
      console.log('Error creating seller account or processing payment:', error,error);
      return Response.json({ success:false,msg: error });
    }
 
}
