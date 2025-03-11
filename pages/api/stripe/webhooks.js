import Stripe from 'stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';
import { VisualElement } from 'framer-motion';

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.WEBHOOK_SECRET_KEY;
export const config = {
  api: {
    bodyParser: false,
  },
};
const cors = Cors({
  allowMethods: ['POST', 'GET','HEAD'],
});

const handler = async (req, res) => {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    console.log(`Webhook Error: ${err.message}`);
    return;
  }
  const data = JSON.parse(buf);

  switch (event.type) {
    case 'payment_intent.created':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent was created for:`, paymentIntent);
      break;
    case 'payment_intent.succeeded':
      const paymentMethod = event.data.object;
      console.log(
        `PaymentIntent was successfull for:`, paymentMethod
      );
      break;
    case 'customer.created':
        const customerCreated = event.data.object;
        console.log(`customer created:`, customerCreated);
        break;
    case 'customer.updated':
          const customerUpdated = event.data.object;
          console.log(`customer updated:`, customerUpdated);
          break;
    case 'customer.subscription.created':
        const subscriptionCreated = event.data.object;
        console.log(`subscription created for:`, subscriptionCreated);
        break;
    case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        console.log(`subscription deleted for: ${data.data.object}`);
        break;
    case 'customer.subscription.pending_update_expired':
        const subscriptionExpired = event.data.object;
        console.log(`subscription expired for: ${data.data.object}`);
        break;
    case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        console.log(`subscription updated for:`, subscriptionUpdated);
        //if subscription cancelled
        if(subscriptionUpdated.cancel_at_period_end == true){
          //record cancelled to database using artist_id, customer_id and subscription_id
          let senddata = {
            customer_id: subscriptionUpdated.customer,
            artist_id: subscriptionUpdated.metadata.artist_id,
            cancel_token: "abreak_67152iX2qL90",
            subscription_id: subscriptionUpdated.id,
            subscription_status: "cancelled",
            subscription_end_date: subscriptionUpdated.cancel_at,
            date_cancelled: subscriptionUpdated.canceled_at
          }
          let url = process.env.API_BASE + "/artist/cancelaccount";
          const data = await fetch(url, {
              method: 'post',
              body: JSON.stringify(senddata)
          });
        }else {
          //record subscription update
          //everything but payment_intent
          let senddata = {
            customer_id: subscriptionUpdated.customer,
            artist_id: subscriptionUpdated.metadata.artist_id,
            subscription_id: subscriptionUpdated.id,
            subscription_status: "active",
            subscription_end_date: null,
            date_cancelled: null
          }
        }
        break;
    case 'subscription_schedule.canceled':
        const subscriptionCanceled = event.data.object;
        console.log(`subscription schedule canceled:`, subscriptionCanceled);
        break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });
};
//export default handler;
export default cors(handler);