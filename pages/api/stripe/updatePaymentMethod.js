import Stripe from 'stripe';

const updatePaymentMethod = async (req, res) => {
    try {
        
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });
        const customerupdate = await stripe.customers.update(
            req.body.customerid,
            {metadata: {source: req.body.carddata}}
          );

        /*const card = await stripe.customers.updateSource(
            'cus_MzLcaJqQbqspz8',
            'card_1MTaHMLZCEBSyZeaf1LB33QV',
        );*/
        
        // Optional but recommended
        // Save the customer object or ID to your database

        res.status(200).json({
            code: 'customer_updated',
            customerupdate,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'customer_update_failed',
            error: e,
        });
    }
};

export default updatePaymentMethod;