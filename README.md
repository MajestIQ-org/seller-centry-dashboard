# Seller Centry Dashboard - Next.js Multi-Tenant

Multi-tenant violation tracking dashboard with subdomain-based routing using Next.js and Supabase.

## Architecture

- **Framework**: Next.js 16 with App Router
- **Backend**: Supabase (Auth, Edge Functions, Database)
- **Multi-tenancy**: Subdomain-based routing via middleware
- **Styling**: Tailwind CSS
- **Data Source**: Google Sheets API

## Features

- ✅ Subdomain-based multi-tenant architecture
- ✅ Automatic client detection from subdomain
- ✅ Google Sheets integration for violation data
- ✅ Real-time violation tracking
- ✅ Responsive design with orange accent theme

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. **Run development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

## Multi-Tenant Setup

### DNS Configuration

Add a wildcard CNAME record in your DNS provider (GoDaddy):
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: 1 Hour
```

### Subdomain Routing

Each client gets their own subdomain:
- `example.sellercentry.com` → Example Client
- `alwayz-on-sale.sellercentry.com` → Alwayz On Sale Client

The middleware automatically:
1. Detects the subdomain from the hostname
2. Passes it to the API route via header
3. Fetches client configuration from Google Sheets
4. Loads client-specific violation data

## Project Structure

```
dashboard-nextjs/
├── app/
│   ├── api/tenant/       # Tenant detection API
│   ├── page.tsx          # Main dashboard
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── ViolationsList.tsx
│   ├── SummaryCards.tsx
│   ├── SubmitTicket.tsx
│   └── InviteUser.tsx
├── lib/
│   ├── contexts/
│   │   └── TenantContext.tsx  # Multi-tenant state
│   └── supabase/
│       ├── client.ts     # Browser client
│       └── server.ts     # Server client
└── middleware.ts         # Subdomain detection
```

## Deployment

### Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables (Vercel)

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Recommended (production, for subdomain SSO):
- `NEXT_PUBLIC_COOKIE_DOMAIN` (example: `.sellercentry.com`)

## Client Mapping

Clients are mapped in Google Sheet (ID: `1ASxjV1Cb0W5exhYBi_D3hE3chUU2eUMGdR6ZDKmF_hY`):
- Column A: Subdomain
- Column D: Google Sheet ID for client data

## Development

```bash
# Run dev server
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```
