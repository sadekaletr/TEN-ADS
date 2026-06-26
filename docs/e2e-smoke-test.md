# E2E Smoke Test — شحن Spark حتى أول استرداد

## Prerequisites

- `npm run dev` or staging URL
- Demo seed (`npm run db:seed`) or real accounts
- Admin: `admin@tenegta.com` / `admin1234`
- Creator: `+963900000001` / `demo1234`

## Flow

### 1. Creator login

1. Open `/login`
2. Sign in with creator credentials
3. Expect redirect to `/dashboard`

### 2. Wallet top-up

1. Go to `/dashboard/wallet/topup`
2. Select package → ShamCash step → upload proof image → enter bank reference → submit
3. Expect timeline `طلب الإنشاء` → `إثبات التحويل` active

### 3. Admin approval

1. Open `/admin/wallet` as admin
2. Verify proof image preview visible
3. Approve top-up
4. Creator receives notification with amount + ShamCash context

### 4. Wallet credit

1. Creator `/dashboard/wallet` — balance increased
2. Transaction shows: `شحن N Spark · ShamCash · …`

### 5. Create campaign

1. `/dashboard/campaigns/new` — complete wizard or use best template
2. Launch campaign (sufficient balance)

### 6. Public surfaces

1. `/campaign/[slug]` — OG metadata, sponsor verified badge if applicable
2. Landing — case study section if campaign qualifies
3. Redemption demo iframe uses real code when case study exists

### 7. Consumer redeem

1. Open `/c/[code]` from campaign
2. Welcome → Preview → Claim → Receipt PNG save
3. Creator notification for milestone/ending if thresholds hit

### 8. Sponsor portal

1. `/sponsor/login` — view ROI and leads

## Pass criteria

- No 500 errors in flow
- `npm run build` succeeds
- Mobile 375px: wallet + redeem usable without horizontal scroll
