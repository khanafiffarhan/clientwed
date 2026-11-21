# WedPlan — Client (Next.js)

**WedPlan** is a role-based wedding planning platform. Customers discover and book wedding services, vendors publish services and manage booking requests (with a Stripe-powered Premium plan), and admins moderate users, services and transactions.

- **Live website:** `https://YOUR-CLIENT.vercel.app`
- **Client repository:** `https://github.com/YOUR-USER/wedplan-client`
- **Server repository:** `https://github.com/YOUR-USER/wedplan-server`

## Important features
- Public home page (hero, featured services, categories, why choose WedPlan, how it works) with Framer Motion animations
- Browse Services: search by name, category and location filters, price sorting (asc/desc), pagination, loading and empty states
- Private Service Details (`/services/[id]`) with image gallery, vendor info, booking form and role rules
- Better Auth: email/password and Google sign-in/up, role selection (Vendor / Customer), password rules, ImgBB profile image upload
- Separate dashboards (sidebar + content) for **Customer**, **Vendor**, **Admin**; URL-tampering redirects, plus server-side role checks on every API
- Vendor: overview stats, add/edit/delete services, pause/activate, booking accept/reject, Free vs Premium plans, Stripe Checkout
- Customer: overview stats, my bookings, booking details, cancel pending bookings
- Admin: stats, user search/filter/block/unblock, service review (approve/reject/status/delete), read-only transactions
- Toast notifications (Sonner), confirmation dialogs, 404 and error pages, fully responsive

## Technology stack
Next.js 14 (App Router) · TypeScript · Tailwind CSS · ShadCN-style UI (Radix primitives) · Framer Motion · Better Auth client (+ JWT plugin) · Sonner · Lucide icons

## Installation & running locally
```bash
git clone https://github.com/YOUR-USER/wedplan-client.git
cd wedplan-client
npm install
cp .env.example .env.local   # set SERVER_URL
npm run dev                  # http://localhost:3000
```
Start the server first (see the server README). The client has **one** environment variable:

| Variable | Purpose |
| --- | --- |
| `SERVER_URL` | Base URL of the Express server (e.g. `http://localhost:5000`). Next.js proxies `/api/*` to it, so auth cookies stay first-party and there are no CORS or third-party cookie problems. |

All secrets (MongoDB, Better Auth, Google, Stripe, ImgBB) live **only on the server**.

## Required application URLs
- App: `http://localhost:3000`
- Google OAuth redirect URI: `{CLIENT_URL}/api/auth/callback/google`
- Stripe success / cancel: `{CLIENT_URL}/payment/success?session_id=…` and `{CLIENT_URL}/payment/cancel`

## Deployment (Vercel)
Set `SERVER_URL` in the project settings and deploy. Reloading any route works (App Router), private routes use the session cookie so users stay signed in after refresh.

## Scripts
`npm run dev` · `npm run build` · `npm start`
