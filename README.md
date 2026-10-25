# NovaCart — Vercel-ready demo

Google AI Studio/Gemini integration removed. Existing React storefront, admin views and API routes retained. Assistant and inquiry categorization now use rule-based fallback.

## Deploy
1. Upload this project to a GitHub repository.
2. Import the repository at https://vercel.com/new. Framework: Vite; build: `npm run build`; output: `dist`.
3. Deploy. No Google API key is required.

## Local frontend
`npm install` then `npm run dev`. API routes require Vercel dev (`npx vercel dev`) or a separate API environment.

## Important limitations
- API stores orders, products and inquiries in process memory. Vercel functions are stateless: changes may disappear or differ across requests. **Not suitable for real customer orders or production e-commerce without a database.**
- Admin routes have no authentication. Do not collect real customer data or accept real orders before adding authentication, persistent storage and appropriate security.
- Assistant is rule-based, not generative AI.
