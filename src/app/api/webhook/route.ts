// pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/src/lib/stripe';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const rawBody = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).json({ error: 'Webhook inválido' });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Pagamento confirmado:', session.id);
      break;

    case 'invoice.payment_failed':
      break;
  }

  return res.status(200).json({ received: true });
}