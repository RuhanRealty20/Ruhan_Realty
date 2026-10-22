import { describe, expect, it, vi } from 'vitest';
import { BridgeIdxAdapter, listingKeyFromSlug, normalizeBridgeProperty } from '../src/integrations/idx/bridge.js';

const sample={
  ListingKey:'bridge-key-1',ListingId:'A100',UnparsedAddress:'100 Ocean Drive #4A',City:'Miami Beach',StateOrProvince:'FL',PostalCode:'33139',
  ListPrice:1250000,BedroomsTotal:2,BathroomsTotalInteger:2,PropertySubType:'Condominium',StandardStatus:'Active',PublicRemarks:'Authorized public remarks.',
  IDXParticipationYN:true,InternetEntireListingDisplayYN:true,ListOfficeName:'Example Brokerage',ModificationTimestamp:'2026-10-20T12:00:00Z',
  Media:[{MediaURL:'https://images.example.test/listing.webp',MediaCategory:'Photo',Order:1,ShortDescription:'Oceanfront condominium exterior'}],
};

describe('Bridge IDX adapter',()=>{
  it('normalizes a RESO property into the public card contract',()=>{
    const property=normalizeBridgeProperty(sample);
    expect(property.id).toBe('bridge-key-1');
    expect(property.slug).toContain('100-ocean-drive-4a--');
    expect(listingKeyFromSlug(property.slug)).toBe('bridge-key-1');
    expect(property.price).toBe('$1,250,000');
    expect(property.image).toContain('images.example.test');
    expect(property.indexable).toBe(true);
  });

  it('queries Bridge with server-side authentication, display rules and pagination',async()=>{
    const fetcher=vi.fn(async()=>new Response(JSON.stringify({value:[sample],'@odata.count':25}),{status:200,headers:{'content-type':'application/json'}}));
    const adapter=new BridgeIdxAdapter({baseUrl:'https://api.bridgedataoutput.com/api/v2/OData/test/Property',apiKey:'server-token',fetcher});
    const result=await adapter.search({page:2,limit:12,beds:2});
    const [url,options]=fetcher.mock.calls[0];
    expect(url.searchParams.get('$skip')).toBe('12');
    expect(url.searchParams.get('$filter')).toContain('IDXParticipationYN eq true');
    expect(url.searchParams.get('$filter')).toContain('BedroomsTotal ge 2');
    expect(options.headers.Authorization).toBe('Bearer server-token');
    expect(result.pagination).toEqual({page:2,limit:12,total:25,pages:3});
    expect(result.dataMode).toBe('test');
  });

  it('returns expanded facts and gallery data for a property detail page',()=>{
    const property=normalizeBridgeProperty({...sample,LivingArea:1420,YearBuilt:2019,InteriorFeatures:['Walk-In Closet'],AssociationAmenities:['Pool']},{details:true});
    expect(property.gallery).toHaveLength(1);
    expect(property.facts).toEqual(expect.arrayContaining([{label:'Interior',value:'1,420 sq ft'},{label:'Year built',value:'2019'}]));
    expect(property.featureSections.flatMap(section=>section.items)).toContain('Walk-In Closet');
  });
});
