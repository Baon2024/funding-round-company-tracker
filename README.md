This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Funding round company tracker tool for Inaugural AI

launch as usual, with npm dev/pnpm dev in root folder

in two other terminals:
  (1) cd src > app > backend > expressServer, then run "node extractCompanyNames.js"
  (2) cd src -> app > backend > serverSidePolling, then run "node serverSidePolling.js"

serverSidePolling requires your own api keys for: Resend api key, cohere client api token (its a free model), NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (last two can easily be found in your supabase 'connect to your project' pop-up box). RESEND_ACCOUNT_EMAIL should be the account you want the email notifications to be send to (and if its the same as your email registered with Resend, it's free). POLLING_FREQUENCY is the env for how often you want to check for new funding articles for the companies on the watchlist. it should be a number: 60 for every hour, 30 for every 30 mins etc cetera.


then, upload your csv as normal in frontend. look at company names presented, and click to add them to your watchlist

## How It Works

this project uses the News Api to retrieve new article about funding round events for the companies in the watchlist, every hour (adjustable).

if there are, they will be send to the CMS' email (Resend account email env value). The app's main page will show up to 10 most recent of these articles.

Every time the user uploads new companies from a csv file to the watchlist, the existing companies and funding round articles are cleaned. 




## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
