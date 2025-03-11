const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function cancelStripeSubscription(req, res) {
    const body = req.body;
    const update = await stripe.subscriptions.update(body.subscription_id, {cancel_at_period_end: true});
    res.json({ data: update });
  }

  export default cancelStripeSubscription;