# WedPlan — Submission & Testing Guide

## What to submit (fill these in)
| Item | Value |
| --- | --- |
| Admin Email | `admin@wedplan.com` (or whatever you set in `ADMIN_EMAIL` before `npm run seed`) |
| Admin Password | the `ADMIN_PASSWORD` you used (must have an uppercase and a lowercase letter, 6+ chars) |
| Live Site Link | https://YOUR-CLIENT.vercel.app |
| GitHub (Server) | https://github.com/YOUR-USER/wedplan-server |
| GitHub (Client) | https://github.com/YOUR-USER/wedplan-client |

## Additional instructions for the evaluator
1. Sign in as admin with the credentials above → `/dashboard/admin`.
2. Demo accounts (created by the seed script): vendor `vendor@wedplan.demo` / `Vendor123`, customer `customer@wedplan.demo` / `Customer123`. (Delete these before submission if you don't want them public.)
3. Stripe is in **test mode**. Pay with card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
4. Premium turns on only after Stripe's webhook reaches the server. The success page waits for it (a few seconds).
5. New or edited vendor services start as **Pending**; approve them in Admin → Manage Services before they appear publicly.
6. Free vendors can keep 3 active services; the 4th is blocked until Premium.
7. Google sign-up asks once for Vendor or Customer.

## Database architecture (matches the assignment)
| Collection | Fields |
| --- | --- |
| `users` (Better Auth) | name, email, image, role, isBlocked, businessName, subscriptionPlan, subscriptionExpiresAt (+ phone, bio, needsRoleSelection, Better Auth fields) |
| `services` | vendorId → users, serviceName, category, description, price, location, images, status (`pending/approved/rejected`), createdAt (+ isActive, updatedAt) |
| `bookings` | serviceId → services, vendorId → users, customerId → users, eventDate, eventLocation, message, status (`pending/accepted/rejected/cancelled`), createdAt (+ updatedAt) |
| `transactions` | vendorId → users, plan, amount, currency, stripeSessionId, stripeSubscriptionId, status (`paid/failed`), createdAt (+ eventKey for idempotency) |

Better Auth owns `session`, `account`, `verification`, `jwks`. No other business collections exist.

## Automated check (run after seeding, against a running server)
```bash
cd server
API_URL=http://localhost:5000 CLIENT_URL=http://localhost:3000 npm run smoke
# or against production:
API_URL=https://YOUR-SERVER... CLIENT_URL=https://YOUR-CLIENT... npm run smoke
```
It verifies: JWT obtained for all 3 roles; missing/garbage/tampered tokens → 401; cross-role API access → 403; price ascending/descending; only approved+active services public; weak password and public admin signup rejected; role/plan cannot be changed via profile; invalid/unknown service IDs; booking rules (create, duplicate, past date, admin, own service); accept once only; accepted can't be cancelled; free-plan limit; no transaction write endpoint; unsigned Stripe webhook rejected.
It does **not** cover Stripe Checkout or Google login — test those by hand.

## Manual test checklist (tick each on the LIVE site)
- [ ] Home: banner, 6 featured services, categories link to filtered list, animations smooth
- [ ] Browse: search, category, location, price asc/desc, loading + empty state
- [ ] Logged out → View Details redirects to Sign In, then returns to the service
- [ ] Sign up customer (with image upload), sign up vendor, Google login, wrong password message
- [ ] Navbar updates immediately on login/logout; dropdown shows name + image
- [ ] Reload every route (incl. `/dashboard/...`, `/services/ID`) → no 404/error, still logged in
- [ ] Customer typing `/dashboard/admin` or `/dashboard/vendor` → redirected away
- [ ] Customer: book, duplicate blocked, cancel pending, cannot cancel accepted
- [ ] Vendor: add service (image upload) → pending; edit; pause; delete; accept/reject once
- [ ] Vendor sees own booking on own service blocked from booking it
- [ ] Admin: approve service → visible publicly; reject → hidden; block user → user logged out and refused; unblock
- [ ] Stripe test checkout → success page → Premium badge + unlimited services; cancel page; Transactions page shows the payment
- [ ] Stripe Dashboard shows webhook deliveries succeeding (200)
- [ ] Browser devtools/Network: no secret keys in responses; no `.env` in either GitHub repo
- [ ] Mobile, tablet, desktop layouts

## Deploy order
1. Deploy **server** (Vercel/Render/Railway) with all env vars, with `BETTER_AUTH_URL` = your future client URL.
2. Deploy **client** with `SERVER_URL` = server URL.
3. Add Google redirect `{CLIENT_URL}/api/auth/callback/google` and Stripe webhook `{SERVER_URL}/api/webhooks/stripe`.
4. In MongoDB Atlas allow the server's IPs (or `0.0.0.0/0` for testing).
5. Run `npm run seed` once (locally, pointing `MONGODB_URI` at the production DB).
6. Run `npm run smoke` against production, then the manual checklist.
