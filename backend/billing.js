const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('./supabase');
const router = express.Router();

// 1. Создание сессии оплаты
router.post('/create-checkout-session', async (req, res) => {
  const { businessId, ownerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AuraSync Pro Subscription',
              description: 'Ежемесячная подписка на систему записи',
            },
            unit_amount: 1500, // $15.00
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/billing?payment=cancelled`,
      metadata: {
        businessId: businessId,
      },
      customer_email: ownerEmail,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Session Error:', err.message);
    res.status(500).json({ error: 'Не удалось создать сессию оплаты' });
  }
});

// 2. Webhook для подтверждения оплаты
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработка успешной оплаты
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const businessId = session.metadata.businessId;

    // Обновляем статус в базе
    const { error } = await supabase
      .from('businesses')
      .update({ 
        subscription_status: 'active',
        stripe_customer_id: session.customer 
      })
      .eq('id', businessId);

    if (error) console.error('DB Update Error after payment:', error);
    console.log(`Business ${businessId} successfully subscribed!`);
  }

  res.json({ received: true });
});

module.exports = router;
