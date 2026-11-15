# Render production deployment

The repository is configured as one Render Node web service. The source remains split into `client/` and `server/`, but the Express process serves the production React build and `/api/v1` from the same HTTPS origin. This avoids cross-origin session and cookie failures and gives the application one readiness check.

## 1. Pre-deployment requirements

- Push the repository to a private GitHub/GitLab repository connected to Render.
- Confirm MongoDB Atlas has a least-privilege production database user and a network rule that permits the Render service.
- Have production SMTP credentials ready. Lead records are saved to MongoDB first; email notification failures are logged by lead ID without logging visitor contact data.
- Confirm the Bridge IDX dataset URL is the approved production dataset, not `/test/Property`.
- Confirm the Gemini key is restricted and server-side. The production model is `gemini-3.8-flash`.
- Obtain BHS/broker approval for the domain, BHS presentation, contact details, content and required disclaimers.
- Obtain counsel-approved Privacy Policy, Terms and consent wording. The current legal pages intentionally remain `noindex` placeholders.

## 2. Create the Render service

1. In Render, choose **New > Blueprint** and select this repository.
2. Render reads [`render.yaml`](../render.yaml), builds the Vite client, and starts the Express server.
3. Enter every environment value marked `sync: false` during Blueprint creation:

   - `MONGODB_URI`
   - `VITE_GA4_ID` (leave analytics disabled if approval is pending)
   - `VITE_GOOGLE_SITE_VERIFICATION`
   - `VITE_FACEBOOK_URL` (leave empty if there is no approved Facebook page)
   - `EMAIL_FROM`, `LEAD_NOTIFICATION_EMAIL`
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`
   - `IDX_API_URL`, `IDX_API_KEY`
   - `GEMINI_API_KEY`

4. Do not copy any server credential into a `VITE_*` variable. Only the public analytics/verification/contact values belong in the client build.
5. Confirm `ALLOWED_ORIGINS` contains the exact temporary Render hostname shown for the service. The Blueprint assumes `https://ruhan-realty.onrender.com`; update it if Render assigns a different hostname.
6. Wait for `/api/v1/health` to report HTTP 200 with `database: connected`. Production startup fails intentionally if required database, email, IDX or AI settings are missing.

Render configuration references: [Blueprint specification](https://render.com/docs/blueprint-spec), [Node/Express deployment](https://render.com/docs/deploy-node-express-app), and [environment variables](https://render.com/docs/configure-environment-variables).

## 3. Create the first administrator

Do not keep an initial admin password in Render environment variables. On a trusted local machine:

1. Temporarily point `server/.env` to the production MongoDB database.
2. Set `ADMIN_EMAIL` and a unique temporary `ADMIN_INITIAL_PASSWORD` of at least 14 characters.
3. Run `npm run seed:admin -w server` once.
4. Remove `ADMIN_INITIAL_PASSWORD` immediately and restore the local development database configuration.
5. Sign in at `https://ruhanrealty.com/admin/login` and verify refresh/session behavior.

The seed script is idempotent for the configured email and never prints the password.

## 4. Connect RuhanRealty.com

The Blueprint declares `ruhanrealty.com`. Render automatically provisions TLS after DNS verification and redirects HTTP to HTTPS. Adding the root domain also adds `www` and redirects it to the root domain.

1. Open the service’s **Settings > Custom Domains** section.
2. Copy the exact DNS records Render displays into the domain registrar/DNS provider.
3. Remove conflicting `AAAA` records while configuring Render, as required by Render’s current domain guidance.
4. Click **Verify** after DNS propagates.
5. Test both `https://ruhanrealty.com` and `https://www.ruhanrealty.com`.
6. After the custom domain is verified and monitored, optionally disable the `onrender.com` subdomain to remove the alternate public hostname.
7. If the Render hostname is disabled, remove it from `ALLOWED_ORIGINS` and keep only the canonical root and `www` origins.

See [Render custom domains](https://render.com/docs/custom-domains) and [managed TLS](https://render.com/docs/tls).

## 5. Production smoke test

Run each check after deployment:

- `/api/v1/health` returns HTTP 200 and `database: connected`.
- Home, properties, one property detail, one area page, contact and admin login load directly on a fresh browser request.
- An unknown URL returns the branded React 404 with HTTP 404, not a soft 200.
- Submit one test inquiry for web, WhatsApp and email. Confirm the same lead appears once in Admin > Leads and the notification reaches the configured inbox.
- Confirm a property inquiry stores property ID, URL, address/title and UTM attribution.
- Sign in, wait past the 15-minute access-token lifetime, and verify the refresh session keeps the admin signed in.
- Confirm Bridge production listings, photos, attribution, detail fields and map coordinates.
- Confirm chatbot responses and property links use authorized IDX results.
- Inspect `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/og-default.jpg` and `/.well-known/security.txt`.
- Test the home/contact/about share preview and validate the structured data.
- Verify the analytics consent banner appears only when `VITE_GA4_ID` is configured; no GA request should occur before opt-in.

## 6. Search launch

1. Add the exact Google Search Console verification token to `VITE_GOOGLE_SITE_VERIFICATION` and redeploy.
2. Verify the `https://ruhanrealty.com/` URL-prefix property.
3. Submit `https://ruhanrealty.com/sitemap.xml`.
4. Request indexing for the home, properties, buy, sell, contact, about and strongest reviewed area pages.
5. Keep filtered property searches, admin, legal placeholders, empty insights, and unsourced market pages out of the index.
6. Publish and index an area detail page only after it has substantive, broker-reviewed local content and approved data; placeholder area details are deliberately `noindex` and excluded from the sitemap.
7. Add property detail URLs to the sitemap only after the IDX provider confirms indexing is permitted and withdrawn-listing handling is approved.

## 7. Rollback and monitoring

- Render retains the previous successful deployment when a new build fails. Use **Rollback** for application regressions.
- Monitor 5xx responses, health-check failures, MongoDB connection errors, SMTP notification errors, IDX provider errors, Gemini rate limits and login rate limits.
- Rotate a leaked credential in its provider and Render. Never commit a replacement secret.
- Back up MongoDB Atlas according to the chosen tier and test restore procedures before launch.
