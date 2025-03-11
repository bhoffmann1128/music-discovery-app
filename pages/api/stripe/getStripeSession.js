const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function GetStripeSession(req, res) {
    const body = req.body;
    let sessionId = body.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customer = await stripe.customers.retrieve(session.customer);
    
    res.json({ session: session, customer: customer });
  }

  export default GetStripeSession;