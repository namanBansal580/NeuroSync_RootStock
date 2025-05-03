// app/api/create-payment-intent/route.js
import Stripe from 'stripe';


export async function POST(request) {
    try {
      const stripe = new Stripe("sk_test_51RDvU7I1A72xH8GuzHrCbqmUvwdOJE02Dkev7UBbDxpNYcm4EgDcFNB48yvKBEarQl0t34Xr7r2IpLqhyTfIqqJE00EhgrQMGZ");
    const { amount,accountId } = await request.json();
        let acc=accountId;
    const usdAmount = 3 * 3 * 100; // Stripe expects cents
    const platformFee = usdAmount * 0.1; // 10% fee
   // const account = await stripe.accounts.retrieve('acct_1REQyZI63fbocn3a');
    //console.log("My Account Retrieved is:::::",account);
    

    const paymentIntent = await stripe.paymentIntents.create({
      amount: usdAmount,
      currency: 'usd',
      application_fee_amount: platformFee,
      transfer_data: {
        destination: accountId,
      },
    });
    console.log("my payment intent is::::",paymentIntent);

     
    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('[Stripe PaymentIntent Error]', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
}
