# StarDrop ✦

**Monetize your Telegram Channel with digital downloads. No Stripe. No Banks. Just Stars.**

## 🚀 The Problem
Beginner creators cannot easily start to sell digital products because of KYC, taxes and so on. 
**StarDrop** solves this by using **Telegram Stars** (internal currency) to act as the payment gateway.

## ✨ Features
- **Zero Config Payments:** Uses native Telegram Stars (`XTR`).
- **Secure Delivery:** Files are locked until payment is confirmed on the blockchain.
- **Crypto Payouts:** Sellers withdraw earnings via TON (Toncoin).
- **Merchant Dashboard:** Analytics, sales tracking, and file management.
- **Bot Integration:** Automated invoice generation and secure link delivery.

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + Lucide Icons
- **Payments:** Telegram Bot API (Telegraf)
- **Infrastructure:** Vercel (Frontend) + Supabase (Backend)

## ⚡️ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/stardrop.git
cd stardrop
npm install
```

### 2. Create **.env.local** file

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TELEGRAM_BOT_TOKEN=your_bot_father_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Locally (with Ngrok)

Since Telegram needs SSL to communicate with your bot:

# Terminal 1
```bash
npm run dev
```

# Terminal 2
```bash
ngrok http 3000
```
Copy the Ngrok URL and set your webhook: 
https://api.telegram.org/bot<TOKEN>/setWebhook?url=<NGROK_URL>/api/telegram
## 📦 Deployment

This project is optimized for Vercel.

1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables in Vercel Dashboard.
4. Set the Production Webhook:
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/telegram


## 🛡 License
**This project is licensed under the MIT License.**

