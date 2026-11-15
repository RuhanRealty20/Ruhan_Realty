# Production launch checklist

## Automated gates

- [ ] `npm run production:check` passes with production `VITE_API_URL=/api/v1` and `VITE_SITE_URL=https://ruhanrealty.com`.
- [ ] Render build succeeds on Node 24.22.1.
- [ ] API readiness reports MongoDB connected.
- [ ] No source maps or server secrets exist in `client/dist`.
- [ ] Direct route requests return the correct prerendered title, description, canonical and robots directive.

## Client, broker and MLS approval

- [ ] BHS approves the domain, name lockup, logo usage, title, biography, office/contact details and calls to action.
- [ ] The IDX/MLS provider approves display rules, photos, attribution, disclaimers, caching and property URL indexing.
- [ ] Legal counsel approves Privacy, Terms, cookies/analytics, retention and messaging consent text.
- [ ] Equal Housing/Fair Housing language and all footer disclaimers are approved verbatim.
- [ ] All testimonials are authentic, documented and authorized.
- [ ] Every market statistic has source, geography, reporting period and last-updated date.

## Conversion and operations

- [ ] Every public form stores a lead and sends the configured email notification.
- [ ] Call, email and WhatsApp destinations are correct on desktop and mobile.
- [ ] UTM source, medium, campaign, content and term persist through submission.
- [ ] Admin login, refresh, logout, filters, status updates and notes work on production.
- [ ] A named person owns lead response, escalation, retention and deletion procedures.

## Search and performance

- [ ] Root and `www` redirect to one HTTPS canonical hostname.
- [ ] Search Console is verified and the sitemap is submitted.
- [ ] GA4 remains blocked until analytics consent.
- [ ] Mobile Lighthouse and Core Web Vitals are checked on production.
- [ ] Home, property, area, contact, about and 404 pages are tested at 390px, tablet and desktop widths.
- [ ] Social previews are tested for the production URL.
