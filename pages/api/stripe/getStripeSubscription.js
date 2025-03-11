const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function GetStripeSession(req, res) {
    const body = req.body;
    const subscription = await stripe.subscriptions.retrieve(
        body.subscription_id
      );
    
    res.json({ data: subscription });
  }

  export default GetStripeSession;
