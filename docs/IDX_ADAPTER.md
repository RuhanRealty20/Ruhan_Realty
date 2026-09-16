# IDX provider adapter contract

The current adapter lives at `server/src/integrations/idx/index.js`. Replace the generic HTTP example with a provider-specific module after approval.

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
