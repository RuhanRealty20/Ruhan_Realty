# RuhanRealty.com

Production-oriented Miami real-estate lead-generation platform for **Ruhan Syed, Realtor Associate, Brown Harris Stevens — Miami Beach**. The product is a personal marketing and lead-management platform, not an independent brokerage website. It is intentionally fail-closed around MLS inventory, market claims, legal copy, testimonials and brand assets until approved sources are connected.

## What is included

- React 19.3, Vite 8.3 and Tailwind CSS 4.3 public website with route-level code splitting and React View Transitions
- Intent funnels for buy, sell/CMA, rent, landlord, invest, relocate, new construction and contact
- Provider-neutral approved IDX/MLS search and property-detail boundary—no fake production listings
- Persistent first-touch UTM attribution plus GA4-compatible event hooks
- Multi-step accessible lead forms with validation, honeypot, consent, rate limiting and property context
- Express 5 ES Modules API, MongoDB Atlas/Mongoose models, Zod validation and consistent response envelopes
- Argon2 admin authentication, short-lived JWT access tokens, rotating HTTP-only refresh sessions and RBAC
- Lead CRM with lifecycle statuses, filters, notes/activity data model, quick contact actions and dashboard metrics
- CMS schemas for areas, articles, testimonials, FAQs, lead magnets and editable site content
- Market metric model requiring source, geography, reporting period, last update and last successful update
- Email adapter and extension seams for SMS, WhatsApp, analytics and optional provider-neutral AI assistance
- Dynamic page metadata, canonical tags, JSON-LD, robots.txt, sitemap generation and noindex controls
- Original development hero artwork with AVIF/WebP output. It is marketing imagery, never MLS inventory.

## Architecture

```text
client/
  public/                 robots, generated sitemap, manifest
  scripts/                asset optimization and sitemap generation
  src/
    assets/               replaceable non-MLS marketing imagery
    components/           UI, SEO, property, market and form components
    context/              attribution and toast state
    data/                 public navigation/content defaults
    hooks/                page/event instrumentation
    layouts/              public and protected admin shells
    pages/                public funnels, discovery, CMS and admin views
    services/             REST client and analytics adapter
server/
  scripts/                controlled admin and development draft seeds
  src/
    config/               environment, database and structured logging
    controllers/          HTTP orchestration
    integrations/         swappable IDX and notification providers
    middleware/           auth, audit, validation and error handling
    models/               User, Lead, Content, MarketMetric and AuditLog
    routes/                versioned REST endpoints
    services/             auth and lead business logic
    validators/           Zod request contracts
  tests/                  API contract/security tests
docs/                     launch and integration notes
```

## Local setup

Requirements: Node.js 24 LTS+, npm 11+, and a MongoDB Atlas database (or local compatible MongoDB for development).

1. Copy `client/.env.example` to `client/.env` and `server/.env.example` to `server/.env`.
2. Set `MONGODB_URI`, strong independent JWT secrets, frontend/backend origins, and approved public contact values.
3. Install dependencies: `npm install`.
4. Create the first admin only after MongoDB is connected:

   ```bash
   npm run seed:admin -w server
   ```

   Set `ADMIN_EMAIL` and a temporary `ADMIN_INITIAL_PASSWORD` of at least 14 characters, run the command once, then remove the password from the environment.

5. Run both apps: `npm run dev`.

Public web: `http://localhost:5173`  
API health: `http://localhost:5000/api/v1/health`  
Admin: `http://localhost:5173/admin/login`

## Environment variables

The example files are authoritative and contain no secrets.

- Client: API/site URLs, approved phone/email/WhatsApp/office/profile values, GA4 ID and Search Console verification.
- Server: MongoDB URI, allowed origins, separate JWT secrets/TTLs, SMTP settings, notification destinations, IDX provider configuration, optional messaging/analytics/AI provider selectors, proxy and log settings.
- Never expose IDX, email, messaging, database or AI credentials through `VITE_*` variables.

## Commands

```bash
npm run dev                    # web + API
npm run lint                   # both workspaces
npm run test                   # API contract tests
npm run build                  # optimized production client
npm run check                  # lint + tests + build
npm run assets:optimize -w client
npm run sitemap -w client
npm run seed:demo -w server    # draft labels only; never fake public facts
```

## REST API

All endpoints use `/api/v1` and `{ success, data }` or `{ success:false, error:{ code, message, details? } }` envelopes.

- `GET /health`
- `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- `POST /leads` (public, validated and rate-limited)
- `GET/PATCH /leads`, `POST /leads/:id/notes` (protected)
- `GET /properties`, `GET /properties/:slug`
- `GET /content/public/:type`; protected CMS list/create/update endpoints
- `GET /admin/dashboard` (protected)

## MongoDB Atlas

Create a least-privilege application user scoped to the production database, restrict network access, enable backups/PITR appropriate to the Atlas tier, and use a separate database/project for staging. Mongoose creates defined indexes; review index creation strategy before high-volume production rollout. Never run the seed scripts against an unintended database.

## IDX/MLS integration

`server/src/integrations/idx/index.js` is the only boundary the public property UI depends on. The default adapter returns an empty, clearly labeled unconfigured result. After provider/broker approval:

1. Confirm the provider contract, display rules, caching limits, photo authorization, update cadence, sold-data permissions, attribution and disclaimer text.
2. Add a named provider adapter implementing `search(filters)` and `getBySlug(slug)`.
3. Map only authorized objective fields to the frontend property contract.
4. Add provider credentials to the server environment; never copy listing photos or keys into the repo/client.
5. Add dynamic property URLs to the sitemap only when the provider permits indexing and canonical strategy is approved.
6. Test withdrawn/expired listings, stale photos, provider outages and last-update behavior.

## Analytics and Search Console

The analytics service emits `page_view`, `property_view`, `search`, `search_filter`, `CTA_click`, `form_start`, `form_step_complete`, `form_submit`, `WhatsApp_click`, `call_click` and other extension-ready events through `window.dataLayer`. Load GA4 only after the approved consent decision, using `VITE_GA4_ID`; keep ad/remarketing consent separate where required. Verify the production domain in Search Console, submit `/sitemap.xml`, inspect canonicals/noindex rules and monitor indexing errors. IDs are never hardcoded.

## Deployment

Recommended split deployment:

- Static/CDN host for `client/dist`, with SPA fallback to `index.html`, immutable hashed assets and short-cache HTML.
- Container or Node host for `server`, behind TLS and a trusted proxy, with health checks on `/api/v1/health`.
- MongoDB Atlas plus a transactional SMTP provider. Keep staging and production secrets separate.
- Route `/api` to the backend at the edge or set `VITE_API_URL` before building.
- Set `NODE_ENV=production`, precise `ALLOWED_ORIGINS`, `TRUST_PROXY`, independent 32+ character JWT secrets and secure contact/provider values.
- Add monitoring for 5xx rates, lead-notification failure, database health, IDX failure/staleness and authentication abuse. Logs redact authorization, cookies, passwords and tokens.

The included Dockerfile builds the client and provides an API runtime stage. A deployment platform may serve the client artifact separately; do not expose source maps publicly unless access is controlled.

## SEO launch checklist

- Replace placeholder site/contact data and verify every title/description/canonical.
- Add an approved default OG image and social preview tests.
- Connect sitemap generation to published CMS and indexable approved IDX URLs.
- Verify `robots.txt`, admin/search noindex behavior, 404 status/fallback and redirect map.
- Validate Person, WebSite, BreadcrumbList, Article and any approved real-estate schema; do not add misleading claims.
- Publish only substantive reviewed area pages; avoid thin or duplicate neighborhood pages.
- Run Lighthouse/Core Web Vitals on representative mobile hardware and production CDN.

## BHS, MLS and compliance launch checklist

- Obtain Brown Harris Stevens broker/compliance approval for the site, biography, titles, domain presentation, office/contact details and all calls to action.
- Use official BHS logo, trademarks, profile links and photography only with permission and supplied usage rules.
- Obtain IDX/MLS approval; insert exact attribution, Equal Housing/Fair Housing and provider disclaimers.
- Confirm Ruhan is presented as a Realtor Associate with Brown Harris Stevens—not an independent brokerage or team.
- Confirm English, Hindi and Urdu only unless service languages change and are approved.
- Review every market number for source, geography, reporting period and update date.
- Use authentic, documented, authorized testimonials only.
- Review seller CMA language, new-construction content, financing/mortgage language and investment content for prohibited guarantees.
- Have counsel approve Privacy, Terms, cookies/analytics consent, SMS/WhatsApp consent and data-retention wording.
- Check all area copy for objective language and Fair Housing compliance; no steering, demographic targeting or unsupported safety claims.
- Confirm legal/tax/mortgage/contractual disclaimers and escalation to qualified professionals.

## Post-launch lead tracking checklist

- Submit each intent flow and a property inquiry from desktop/mobile; verify field mapping and property context.
- Test Instagram, Facebook, LinkedIn, Google, referral and paid-campaign UTM links through submission.
- Confirm immediate email delivery, suppression of secrets/PII in logs, and notification-failure alerts.
- Verify CRM status changes, notes, activity timeline, filters, pagination and audit records.
- Reconcile analytics `form_submit` events with saved leads; browser events alone are not source-of-truth conversions.
- Test call, email and WhatsApp actions with approved contact values.
- Document lead response ownership, response-time expectations, nurturing rules, retention and deletion workflows.

## Deliberate launch blockers

The repository is technically runnable, but production publication must wait for approved contact/office details, full supplied biography copy, BHS assets/permissions, IDX credentials and disclaimers, market sources, legal/consent language, any authentic testimonials, and broker/compliance sign-off. Those omissions are visible and intentional.
