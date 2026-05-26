# Next.js template

This is a Next.js template with shadcn/ui.

## Running locally

Create `ScoliosisBraceApp/.env.local` with your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Then install dependencies and start the app from this directory:

```bash
npm install --package-lock=false
npm run dev
```

The app requires the Supabase URL and publishable key at startup. If those values
are missing, the Supabase middleware will fail before pages can load.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
