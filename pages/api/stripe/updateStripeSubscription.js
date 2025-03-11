const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const updateSubscription = async (req, res) => {
    try {
        
        const { customerId, priceId, subscriptionId } = req.body;
        const subscription = await stripe.subscriptions.update(
            subscriptionId,
            {
            cancel_at_period_end: false,
            metadata: {
                // You can save details about your user here
                // Or any other metadata that you would want as reference.
            }
        });
        res.status(200).json({
            code: 'subscription_updated',
            subscriptionId: subscription.id,
            clientSecret:
                subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'subscription_update_failed',
            error: e,
        });
    }
};

export default updateSubscription;
