# Seller Centry Dashboard

Multi-tenant Amazon seller dashboard for viewing account health violations.

## Features

- Google Sheets integration (real-time violation data)
- Multi-tenant subdomain routing
- Email/password authentication
- Tenant access control
- Mobile-first responsive design
- Active/Resolved violations toggle

## Tech Stack

- React + Vite + TypeScript
- Supabase (Auth + Edge Functions)
- Google Sheets API
- Tailwind CSS
- Vercel

## Local Development

### Prerequisites

- Node.js 18+
- Supabase account
- Google Service Account credentials

### Setup

1. Clone repository
```bash
git clone https://github.com/MajestIQ-org/seller-centry-dashboard
cd seller-centry-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```
VITE_SUPABASE_URL=https://byaaliobjjdffkhnxytv.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

4. Run development server
```bash
npm run dev
```

## Database Setup

Run the following SQL in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS user_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, merchant_id)
);

CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_merchant_id ON user_tenants(merchant_id);

ALTER TABLE user_tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own tenants" ON user_tenants;
CREATE POLICY "Users can view their own tenants"
  ON user_tenants FOR SELECT
  USING (auth.uid() = user_id);
```

## Architecture

### Multi-Tenant Flow

1. User visits subdomain (e.g., example.sellercentry.com)
2. System detects subdomain from hostname
3. Looks up client in mapping Google Sheet
4. Fetches violations from client's specific sheet
5. Verifies user has access to this merchant_id
6. Displays dashboard with violations data

### Security

- Row Level Security on database tables
- Protected routes require authentication
- Tenant access verification per request
- One user can access multiple merchants

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Environment variables are configured in Vercel dashboard.

## Edge Function Deployment

Deploy the Google Sheets sync function:

```bash
supabase functions deploy google-sheets-sync
```

## Test Users Setup

Create users in Supabase Auth and insert tenant records:

```sql
INSERT INTO user_tenants (user_id, merchant_id) VALUES
((SELECT id FROM auth.users WHERE email = 'joe@sellercentry.com'), 'EXAMPLE'),
((SELECT id FROM auth.users WHERE email = 'kristen@sellercentry.com'), 'EXAMPLE');
```

## Future Enhancements

- Google OAuth login
- Password reset flow
- Invite system for onboarding
- Submit ticket email functionality
- Advanced filtering and search
- Real-time sync
- Status updates
- PDF export
- Analytics

## License

Private - MajestIQ Organization
