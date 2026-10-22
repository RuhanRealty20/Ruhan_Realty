# Bridge IDX / MLS adapter

The provider selector lives at `server/src/integrations/idx/index.js`, and the Bridge RESO/OData implementation lives at `server/src/integrations/idx/bridge.js`.

Configure the backend only—never place a Bridge server token in the React environment:

```env
IDX_PROVIDER=bridge
IDX_API_URL=https://api.bridgedataoutput.com/api/v2/OData/your-approved-dataset/Property
IDX_API_KEY=your-bridge-server-token
```

Restart the backend after changing `.env`, then verify the connection without printing the token:

```bash
npm run idx:check -w server
```

The `test` dataset contains synthetic sandbox listings. It proves the integration works, but it is not Miami MLS inventory. Live Miami listings require the dataset identifier, server token, IDX feed approval, display rules and attribution supplied for the production Bridge feed.

The public properties page requests 12 records at a time and uses OData pagination. Do not load every record in one browser request. The adapter enforces `IDXParticipationYN` and `InternetEntireListingDisplayYN`, normalizes authorized media, and provides a clear sandbox warning when the configured endpoint uses `/test/Property`.

## Normalized response

Expected normalized search output:

```json
{
  "items": [{
    "id": "provider-stable-id",
    "slug": "approved-seo-slug",
    "title": "provider-authorized title/address",
    "address": "provider-authorized address",
    "location": "city or area",
    "price": "$1,250,000",
    "rawPrice": 1250000,
    "beds": 2,
    "baths": 2,
    "type": "Condominium",
    "status": "For Sale",
    "image": "provider-authorized CDN URL",
    "imageAlt": "objective image description",
    "attribution": "exact required attribution",
    "indexable": true
  }],
  "total": 1,
  "providerStatus": "connected"
}
```

Never proxy or persist photos unless the agreement explicitly allows it. Cache only for the permitted TTL. Normalize provider errors to `IDX_UNAVAILABLE`; do not backfill from fabricated records. Property leads already attach provider ID, URL, title/address and attribution metadata.
