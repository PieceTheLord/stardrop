import { Telegraf } from 'telegraf';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Setup Supabase & Telegraf
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY! // Use Service Role for backend actions
);

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// 2. Handle the "/start order_123" command
bot.start(async (ctx) => {
  
  const payload = ctx.payload; // This is the "order_123" part
  // console.log(ctx);

  if (!payload || !payload.startsWith('order_')) {
    return ctx.reply('Welcome! To buy a file, please use the link from the website.');
  }

  const orderId = payload.replace('order_', '');

  // Fetch file details from Supabase
  const { data: order } = await supabase
    .from('orders').select('*, files(*)')
    .eq('id', orderId).single();

  if (!order || order.status === 'paid') return ctx.reply('Order not found or already paid.');
  console.log("Get the order", order, "and send the offer to the user");

  // SEND THE INVOICE (Stars Payment)
  await ctx.replyWithInvoice({
    title: "My Digital File",
    description: "Unlock full access to this file",
    payload: orderId, // Your internal tracking ID
    // 👇 THESE TWO LINES ACTIVATE STARS 👇
    provider_token: "", // MUST BE EMPTY STRING
    currency: "XTR",    // MUST BE 'XTR'

    prices: [{ label: "File Access", amount: order.files.price }],
  });
});

// 3. Handle Pre-Checkout (Telegram asks: "Can we take the money?")
bot.on('pre_checkout_query', (ctx) => {
  return ctx.answerPreCheckoutQuery(true);
});

// 4. Handle Successful Payment
bot.on('successful_payment', async (ctx) => {
  const payment = ctx.message.successful_payment;
  const orderId = payment.invoice_payload; // We recover the Order ID
  console.log(orderId);


  // A. Mark Order as Paid
  await supabase.from('orders').update({
    status: 'paid',
    telegram_user_id: ctx.from.id
  }).eq('id', orderId);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, files(*)') // This is the join
    .eq('id', orderId)
    .single();

  console.log("Order", order, "\n Order sell_count:", order.files.sell_count, "\n Order id:", order.files.id);

  const { data: sellCountUpdate, error: SellCountUpdateError } =
    await supabase.from("files")
      .update({
        sell_count: order.files.sell_count + 1
      })
      .eq('id', order.files.id).select()

  if (SellCountUpdateError)
    return console.error("error, while updating sell_count on successful_payemnt notification", SellCountUpdateError);


  console.log("Update the sell count field:", sellCountUpdate);


  if (orderError) return console.error("error, while retrieving file's details on successful_payemnt notification", orderError);


  const { data: downloadLink, error: downloadLinkError } =
    await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
      .createSignedUrl(order.files.storage_path, 3600 * 24, {
        download: order.files.filename
      })

  if (downloadLinkError) return console.error("download link error on successful_payment");


  // B. Send the Link to User
  await ctx.reply("✅ Payment Successful!");
  await ctx.reply(`Here is your secure download link: ${downloadLink.signedUrl}`);
  await ctx.reply("(This link is valid for 24 hours)");
});

// 5. Connect Next.js Request to Telegraf
export async function POST(req: Request) {
  const body = await req.json();
  await bot.handleUpdate(body);
  return NextResponse.json({ ok: true });
}
export async function GET(req: Request) {
  return NextResponse.json("All good!", { status: 200 })
}

if (!process.env.VERCEL) {
  bot.launch()
    .then(() => console.log('Telegram bot started!'))
    .catch(err => console.error("Failed to launch bot:", err));
}
