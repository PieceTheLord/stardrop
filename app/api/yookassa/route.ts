import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'


export async function POST(request: Request) {
  const checkout = new YooCheckout({ shopId: process.env.YOOKASSA_SHOP_ID!, secretKey: process.env.YOOKASSA_SECRET_KEY! });

  const idempotenceKey = uuidv4();

  const createPayload: ICreatePayment = {
    amount: {
      value: '2.00',
      currency: 'RUB'
    },
    payment_method_data: {
      type: 'sbp'
    },
    confirmation: {
      type: 'redirect',
      return_url: 'http://localhost:3000'
    },
    capture: true,
  };

  try {
    const payment = await checkout.createPayment(createPayload, idempotenceKey);
    console.log(payment)
    return NextResponse.json({ result: payment.status }, { status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: `error: ${error}` }, { status: 500 })
  }
}