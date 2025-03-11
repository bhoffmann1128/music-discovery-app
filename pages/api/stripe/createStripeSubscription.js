const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createSubscription = async (req, res) => {
    try {
        
        const { customerId, priceId, artistId } = req.body;

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            metadata: {
                artist_id: artistId
            },
            expand: ['latest_invoice.payment_intent'],
        });

        res.status(200).json({
            code: 'subscription_created',
            subscriptionId: subscription.id,
            clientSecret:
                subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'subscription_creation_failed',
            error: e,
        });
    }
};

export default createSubscription;
