# Bitcoin Bénin Gallery

This is a [Next.js](https://nextjs.org) project for the Bitcoin Bénin community gallery, built with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Gallery management with albums and images
- Admin interface for content management
- Supabase backend with Row Level Security
- Responsive design with modern UI

## Prerequisites

- Node.js 18+ 
- Supabase project (create one at [supabase.com](https://supabase.com))

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd bitcoinbenin.org
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL setup script from `supabase-setup-new.sql` in your Supabase SQL Editor
3. Copy your project credentials from Settings > API

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: 
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` is server-side only and bypasses RLS policies
- Never commit your `.env.local` file to version control

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access

The admin interface is available at `/admin/gallery`. This uses the service role key to bypass Row Level Security policies for admin operations.

## Database Schema

The application uses three main tables:
- `albums` - Photo albums
- `gallery_images` - Individual images with metadata
- `events` - Community events

See `supabase-setup-new.sql` for the complete schema and RLS policies.

## Troubleshooting

### "new row violates row-level security policy" Error

This error occurs when:
1. Missing `SUPABASE_SERVICE_ROLE_KEY` in your environment
2. Invalid service role key
3. Service role key has incorrect permissions

**Solution**: Ensure your `.env.local` contains the correct service role key from Supabase Settings > API.

### Images Not Loading

Check that:
1. Supabase storage bucket 'gallery' exists
2. RLS policies are correctly configured
3. Environment variables are properly set

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
