import { NextResponse } from 'next/server';
import { stripe } from '@/src/lib/stripe';
import { CheckoutItem } from '@/src/types/types';

export async function POST(req: Request) {
  try {
    const { items }: { items: CheckoutItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.nome,
            description: item.descricao,
            images: item.imagem ? [item.imagem] : undefined,
          },
          unit_amount: Math.round(item.preco * 100),
        },
      })),
      success_url: `${process.env.NEXT_PUBLIC_URL}/orders`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error('Erro no checkout:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}