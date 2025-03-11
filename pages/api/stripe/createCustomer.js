import Stripe from 'stripe';

const createCustomer = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });
        const { email, name, artist_id } = req.body;

        let customer = "";
        if(req.body.customer_id){
            console.log("existing", req.body.customer_id);
            customer = await stripe.customers.update(
                req.body.customer_id,
                {
                    metadata: {
                        "artist_id": artist_id
                    }
                }   
            );
            
        }else {
            customer = await stripe.customers.create({
                email,
                name,
                metadata: {
                    "artist_id": artist_id
                }
            });
        }
        

        // Optional but recommended
        // Save the customer object or ID to your database

        res.status(200).json({
            code: 'customer_created',
            customer,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'customer_creation_failed',
            error: e,
        });
    }
};

export default createCustomer;
