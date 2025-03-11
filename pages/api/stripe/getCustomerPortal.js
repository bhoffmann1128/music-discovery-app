import Stripe from 'stripe';

const getCustomerPortal = async (req, res) => {
    try {
        
        const body = req.body;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });
        const session = await stripe.billingPortal.sessions.create({
            customer: body.customerid,
            return_url: `${process.env.APP_URL}/profile/editAccount`,
          });
        
          //console.log("SESH", session);
        //res.redirect(session.url);
        res.status(200).json({
            code: 'customer_portal_url',
            session,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'customer_portal_failed',
            error: e,
        });
    }
};

export default getCustomerPortal;

