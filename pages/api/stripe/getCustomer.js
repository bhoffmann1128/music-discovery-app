import Stripe from 'stripe';

const getCustomer = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });
        const { customer_id } = req.body;
        let customer = await stripe.customers.retrieve(
            customer_id
        );

        res.status(200).json({
            code: 'customer_retrieved',
            customer,
        });
    } catch (e) {
        res.status(400).json({
            code: 'customer_retrieval_failed',
            error: e,
        });
    }
};

export default getCustomer;
