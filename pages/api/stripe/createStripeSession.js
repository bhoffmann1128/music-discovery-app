const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function CreateStripeSession(req, res) {
    const body = req.body;
  
    const redirectURL =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/payment-confirmation'
        : 'https://stripe-checkout-next-js-demo.vercel.app';

    const transformedItem = {
        quantity: 1,
    }

    if(body.type == "monthly"){
      transformedItem.price = "price_1MEfCOLZCEBSyZea9mCi0HRa";
    }
    if(body.type == "yearly"){
      transformedItem.price = "price_1MHBMeLZCEBSyZeacg2qmwVQ";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [transformedItem],
      mode: 'subscription',
      success_url: 'http://localhost:3000/order/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: redirectURL + 'http://localhost:3000/order/cancel?session_id={CHECKOUT_SESSION_ID}',
      metadata: {
        images: body.item.image,
      },
    });
  
    res.json({ data: session });
  }

  export default CreateStripeSession;