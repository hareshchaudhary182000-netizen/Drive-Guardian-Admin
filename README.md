# DriveGuardian Admin

A web admin dashboard for the DriveGuardian mobile app, built with
**React-Admin + Supabase**. It connects to the **same Supabase project** as the
app and lets an admin review feedback, drivers, partners, safe-driving activity,
reports, and manage sponsored ads.

## Stack

- [React-Admin](https://marmelab.com/react-admin/) (Material UI)
- [ra-supabase](https://github.com/marmelab/ra-supabase) data provider
- Vite + React + TypeScript
- Recharts for the dashboard charts

## Setup

1. **Install** (already done):

   ```bash
   npm install
   ```

2. **Configure Supabase** — copy `.env.example` to `.env` and fill in your
   project URL + anon key (same as the mobile app):

   ```
   VITE_SUPABASE_URL=https://YOUR-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-anon-key
   ```

3. **Database policies** — run `supabase-admin-setup.sql` once in the Supabase
   SQL Editor. This grants admin users read access to all data (RLS otherwise
   limits each user to their own rows).

4. **Make yourself an admin** — set your `profiles.role` to `admin`
   (see the last line of the SQL file). Only admins can log in.

## Run

```bash
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deploy

Any static host works (Vercel / Netlify). Set the two `VITE_` env vars in the
host's dashboard, then deploy. Build command: `npm run build`, output: `dist`.

## Notes

- The `ads` resource assumes columns `title, body, image_url, link_url, active`.
  Adjust `src/resources/ads.tsx` if your `ads` table differs.
- All data is read live from Supabase; nothing is duplicated.
