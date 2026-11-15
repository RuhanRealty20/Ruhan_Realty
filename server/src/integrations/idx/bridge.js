import { ApiError, pagination } from '../../utils/api.js';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const escapeOData = (value) => String(value).replaceAll("'", "''");

const slugify = (value) => String(value || 'property')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 72) || 'property';

const encodeListingKey = (value) => Buffer.from(String(value), 'utf8').toString('base64url');

export function listingKeyFromSlug(slug) {
  if (!String(slug).includes('--')) return String(slug);
  const encoded = String(slug).split('--').at(-1);
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString('utf8');
    return decoded || String(slug);
  } catch {
    return String(slug);
  }
}

const textValue = (value) => Array.isArray(value) ? value.join(', ') : value;

const listValue = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return value === undefined || value === null || value === '' ? [] : [String(value)];
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const displayText = (value) => unique(listValue(value)).join(', ');

const displayBoolean = (value) => value === true ? 'Yes' : value === false ? 'No' : '';

const detailItem = (label, value) => ({ label, value });

const displayNumber = (value) => {
  const number = safeNumber(value);
  return number === undefined ? '' : new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(number);
};

const displayDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

const isRental = (property) => {
  const searchable = [property.PropertyType, property.PropertySubType, property.ListingAgreement]
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return safeNumber(property.LeaseAmount) > 0 || /rent|lease/.test(searchable);
};

const listingStatus = (property) => {
  if (isRental(property)) return 'For Rent';
  if (property.NewConstructionYN) return 'New Construction';
  if (safeNumber(property.PreviousListPrice) > safeNumber(property.ListPrice)) return 'Price Reduced';
  return property.StandardStatus === 'Coming Soon' ? 'Coming Soon' : 'For Sale';
};

const propertyAddress = (property) => property.UnparsedAddress || [
  property.StreetNumber,
  property.StreetDirPrefix,
  property.StreetName,
  property.StreetSuffix,
  property.UnitNumber ? `#${property.UnitNumber}` : '',
].filter(Boolean).join(' ') || property.BuildingName || `Listing ${property.ListingId || property.ListingKey}`;

const propertyLocation = (property) => [
  property.SubdivisionName,
  property.City,
  property.StateOrProvince,
  property.PostalCode,
].filter(Boolean).join(' · ');

const listingPhotos = (property) => [...(Array.isArray(property.Media) ? property.Media : [])]
  .filter((media) => media?.MediaURL && (!media.MediaCategory || /photo|image/i.test(media.MediaCategory)))
  .sort((left, right) => (safeNumber(left.Order) ?? 999) - (safeNumber(right.Order) ?? 999))
  .map((media,index)=>({url:media.MediaURL,alt:media.ShortDescription||`Authorized listing photo ${index+1}`}));

export function normalizeBridgeProperty(property,{details=false}={}) {
  if (!property || typeof property !== 'object') return null;
  const id = String(property.ListingKey || property.ListingId || property.PropertyUniversalID || '');
  if (!id) return null;
  const address = propertyAddress(property);
  const rental = isRental(property);
  const rawPrice = rental ? safeNumber(property.LeaseAmount) : safeNumber(property.ListPrice);
  const photos = listingPhotos(property);
  const photo = photos[0];
  const office = property.ListOfficeName || property.OriginatingSystemName || property.SourceSystemName;
  const providerDisclaimer = textValue(property.CopyrightNotice || property.Disclaimer);
  const squareFeet=safeNumber(property.LivingArea)||safeNumber(property.BuildingAreaTotal)||safeNumber(property.AboveGradeFinishedArea);
  const lotSquareFeet=safeNumber(property.LotSizeSquareFeet);
  const associationFee=safeNumber(property.AssociationFee);
  const lotDisplay=lotSquareFeet?`${displayNumber(lotSquareFeet)} sq ft`:property.LotSizeArea?`${displayNumber(property.LotSizeArea)} ${property.LotSizeUnits||''}`.trim():'';
  const stories=safeNumber(property.Stories)||safeNumber(property.Levels);
  const rooms=safeNumber(property.RoomsTotal);
  const facts=[
    {label:'Bedrooms',value:displayNumber(property.BedroomsTotal)},
    {label:'Bathrooms',value:displayNumber(property.BathroomsTotalInteger??property.BathroomsTotalDecimal)},
    {label:'Interior',value:squareFeet?`${displayNumber(squareFeet)} sq ft`:''},
    {label:'Property type',value:textValue(property.PropertySubType||property.PropertyType)},
    {label:'Year built',value:property.YearBuilt?String(property.YearBuilt):''},
    {label:'Parking',value:safeNumber(property.ParkingTotal)!==undefined?`${displayNumber(property.ParkingTotal)} spaces`:''},
    {label:'Garage',value:safeNumber(property.GarageSpaces)!==undefined?`${displayNumber(property.GarageSpaces)} spaces`:''},
    {label:'Rooms',value:rooms!==undefined?displayNumber(rooms):''},
    {label:'Stories',value:stories!==undefined?displayNumber(stories):''},
    {label:'Lot size',value:lotDisplay},
    {label:'Days on market',value:displayNumber(property.DaysOnMarket)},
    {label:'Association fee',value:associationFee?`${money.format(associationFee)}${property.AssociationFeeFrequency?` / ${String(property.AssociationFeeFrequency).toLowerCase()}`:''}`:''},
    {label:'MLS number',value:property.ListingId},
    {label:'Status',value:property.MlsStatus||property.StandardStatus},
  ].filter((fact)=>fact.value!==''&&fact.value!==undefined&&fact.value!==null);
  const featureSections=[
    {title:'Interior',items:unique([...listValue(property.InteriorFeatures),...listValue(property.Appliances),...listValue(property.Flooring),...listValue(property.LaundryFeatures),...listValue(property.FireplaceFeatures)])},
    {title:'Building & exterior',items:unique([...listValue(property.ArchitecturalStyle),...listValue(property.ConstructionMaterials),...listValue(property.ExteriorFeatures),...listValue(property.PatioAndPorchFeatures),...listValue(property.Roof)])},
    {title:'Amenities',items:unique([...listValue(property.AssociationAmenities),...listValue(property.BuildingFeatures),...listValue(property.CommunityFeatures),...listValue(property.PoolFeatures),...listValue(property.SpaFeatures)])},
    {title:'Setting & views',items:unique([...listValue(property.View),...listValue(property.WaterfrontFeatures),...listValue(property.LotFeatures),...listValue(property.Vegetation)])},
    {title:'Parking & access',items:unique([...listValue(property.ParkingFeatures),...listValue(property.AccessibilityFeatures),...listValue(property.EntryLocation)])},
  ].filter((section)=>section.items.length);

  const detailGroups=[
    {title:'Property & construction',items:[
      detailItem('Property subtype',displayText(property.PropertySubType)),detailItem('Structure type',displayText(property.StructureType)),
      detailItem('Architectural style',displayText(property.ArchitecturalStyle)),detailItem('Construction',displayText(property.ConstructionMaterials)),
      detailItem('Property condition',displayText(property.PropertyCondition)),detailItem('Roof',displayText(property.Roof)),
      detailItem('Foundation',displayText(property.FoundationDetails)),detailItem('Levels',displayText(property.Levels)||displayNumber(stories)),
      detailItem('Year built',property.YearBuilt?String(property.YearBuilt):''),detailItem('Year built details',displayText(property.YearBuiltDetails)),
    ]},
    {title:'Interior & systems',items:[
      detailItem('Interior features',displayText(property.InteriorFeatures)),detailItem('Appliances',displayText(property.Appliances)),
      detailItem('Flooring',displayText(property.Flooring)),detailItem('Laundry',displayText(property.LaundryFeatures)),
      detailItem('Heating',displayText(property.Heating)),detailItem('Cooling',displayText(property.Cooling)),
      detailItem('Fireplace',displayText(property.FireplaceFeatures)||displayBoolean(property.FireplaceYN)),detailItem('Security',displayText(property.SecurityFeatures)),
      detailItem('Utilities',displayText(property.Utilities)),detailItem('Electric',displayText(property.Electric)),
      detailItem('Water source',displayText(property.WaterSource)),detailItem('Sewer',displayText(property.Sewer)),
    ]},
    {title:'Exterior, land & views',items:[
      detailItem('Exterior features',displayText(property.ExteriorFeatures)),detailItem('Patio and porch',displayText(property.PatioAndPorchFeatures)),
      detailItem('Lot features',displayText(property.LotFeatures)),detailItem('Fencing',displayText(property.Fencing)),
      detailItem('Pool',displayText(property.PoolFeatures)||displayBoolean(property.PoolPrivateYN)),detailItem('Spa',displayText(property.SpaFeatures)||displayBoolean(property.SpaYN)),
      detailItem('Waterfront',displayText(property.WaterfrontFeatures)||displayBoolean(property.WaterfrontYN)),detailItem('View',displayText(property.View)),
      detailItem('Vegetation',displayText(property.Vegetation)),
    ]},
    {title:'Community & association',items:[
      detailItem('Building name',displayText(property.BuildingName)),detailItem('Subdivision',displayText(property.SubdivisionName)),
      detailItem('Association amenities',displayText(property.AssociationAmenities)),detailItem('Building features',displayText(property.BuildingFeatures)),
      detailItem('Community features',displayText(property.CommunityFeatures)),detailItem('Association fee includes',displayText(property.AssociationFeeIncludes)),
      detailItem('Common interest',displayText(property.CommonInterest)),detailItem('Pets allowed',displayText(property.PetsAllowed)),
    ]},
    {title:'Parking & access',items:[
      detailItem('Parking features',displayText(property.ParkingFeatures)),detailItem('Total parking',safeNumber(property.ParkingTotal)!==undefined?displayNumber(property.ParkingTotal):''),
      detailItem('Garage spaces',safeNumber(property.GarageSpaces)!==undefined?displayNumber(property.GarageSpaces):''),detailItem('Carport spaces',safeNumber(property.CarportSpaces)!==undefined?displayNumber(property.CarportSpaces):''),
      detailItem('Accessibility',displayText(property.AccessibilityFeatures)),detailItem('Entry level',displayNumber(property.EntryLevel)),detailItem('Entry location',displayText(property.EntryLocation)),
    ]},
    {title:'Financial & terms',items:[
      detailItem('Annual taxes',safeNumber(property.TaxAnnualAmount)!==undefined?money.format(property.TaxAnnualAmount):''),detailItem('Tax year',displayNumber(property.TaxYear)),
      detailItem('Ownership',displayText(property.Ownership)),detailItem('Listing terms',displayText(property.ListingTerms)),
      detailItem('Possession',displayText(property.Possession)),detailItem('Furnished',displayText(property.Furnished)),
      detailItem('Land lease',displayBoolean(property.LandLeaseYN)),detailItem('Zoning',displayText(property.ZoningDescription)||displayText(property.Zoning)),
    ]},
  ].map((group)=>({...group,items:group.items.filter((item)=>item.value!==''&&item.value!==undefined&&item.value!==null)})).filter((group)=>group.items.length);

  const normalized={
    id,
    slug: `${slugify(address)}--${encodeListingKey(id)}`,
    title: address,
    address,
    location: propertyLocation(property),
    price: rawPrice === undefined ? 'Price available on request' : `${money.format(rawPrice)}${rental && property.LeaseAmountFrequency ? ` / ${String(property.LeaseAmountFrequency).toLowerCase()}` : ''}`,
    rawPrice,
    beds: safeNumber(property.BedroomsTotal) ?? 0,
    baths: safeNumber(property.BathroomsTotalInteger) ?? safeNumber(property.BathroomsTotalDecimal) ?? 0,
    livingArea: squareFeet,
    type: textValue(property.PropertySubType || property.PropertyType) || 'Property',
    status: listingStatus(property),
    image: photo?.url || '',
    imageAlt: photo?.alt || `Authorized listing photo for ${address}`,
    description: property.PublicRemarks || 'Contact the real-estate advisor for authorized listing details.',
    attribution: providerDisclaimer || `Listing courtesy of ${office || 'the listing broker'} via the approved Bridge IDX feed. Information is deemed reliable but is not guaranteed.`,
    indexable: property.IDXParticipationYN !== false && property.InternetEntireListingDisplayYN !== false,
    provider: 'bridge',
    sourceUpdatedAt: property.ModificationTimestamp || property.MajorChangeTimestamp,
  };
  if(!details)return normalized;
  return{
    ...normalized,
    gallery:photos.slice(0,40).map((item,index)=>({...item,alt:item.alt||`Authorized listing photo ${index+1} for ${address}`})),
    photoCount:safeNumber(property.PhotosCount)??photos.length,
    facts,
    featureSections,
    detailGroups,
    listingId:property.ListingId||id,
    standardStatus:property.StandardStatus,
    mlsStatus:property.MlsStatus,
    county:property.CountyOrParish,
    subdivision:property.SubdivisionName,
    buildingName:property.BuildingName,
    latitude:safeNumber(property.Latitude),
    longitude:safeNumber(property.Longitude),
    yearBuilt:safeNumber(property.YearBuilt),
    parkingFeatures:listValue(property.ParkingFeatures),
    furnished:textValue(property.Furnished),
    petsAllowed:textValue(property.PetsAllowed),
    waterfront:Boolean(property.WaterfrontYN),
    pool:Boolean(property.PoolPrivateYN)||listValue(property.PoolFeatures).length>0,
    taxAnnualAmount:safeNumber(property.TaxAnnualAmount),
    taxYear:safeNumber(property.TaxYear),
    onMarketDate:displayDate(property.OnMarketDate),
    updatedAt:displayDate(property.ModificationTimestamp||property.MajorChangeTimestamp),
    listingAgent:property.ListAgentFullName,
    listingOffice:office,
    virtualTourUrl:property.VirtualTourURLUnbranded||'',
  };
}

function normalizeEndpoint(baseUrl) {
  const url = new URL(baseUrl);
  url.search = '';
  url.hash = '';
  url.pathname = url.pathname.replace(/\/+$/, '');
  if (!/\/Propert(?:y|ies)$/i.test(url.pathname)) url.pathname += '/Property';
  return url;
}

function bridgeFilters(filters) {
  const clauses = ['IDXParticipationYN eq true', 'InternetEntireListingDisplayYN eq true'];
  const status = String(filters.status || '').trim();
  const priceField = status === 'For Rent' ? 'LeaseAmount' : 'ListPrice';
  const minPrice = safeNumber(filters.minPrice);
  const maxPrice = safeNumber(filters.maxPrice);
  const beds = safeNumber(filters.beds);
  const location = String(filters.location || '').trim();

  if (status === 'For Sale') clauses.push('ListPrice gt 0');
  if (status === 'For Rent') clauses.push('LeaseAmount gt 0');
  if (status === 'Waterfront') clauses.push('WaterfrontYN eq true');
  if (status === 'New Construction') clauses.push('NewConstructionYN eq true');
  if (status === 'Price Reduced') clauses.push('PreviousListPrice gt ListPrice');
  if (status === 'New Listings') {
    const recent = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    clauses.push(`OnMarketDate ge ${recent}`);
  }
  if (minPrice !== undefined) clauses.push(`${priceField} ge ${Math.max(0, minPrice)}`);
  if (maxPrice !== undefined) clauses.push(`${priceField} le ${Math.max(0, maxPrice)}`);
  if (beds !== undefined) clauses.push(`BedroomsTotal ge ${Math.max(0, Math.floor(beds))}`);
  if (location) {
    const value = escapeOData(location);
    clauses.push(`(City eq '${value}' or SubdivisionName eq '${value}' or PostalCode eq '${value}')`);
  }
  return clauses.join(' and ');
}

export class BridgeIdxAdapter {
  status = 'connected';

  constructor({ baseUrl, apiKey, fetcher = fetch }) {
    this.endpoint = normalizeEndpoint(baseUrl);
    this.apiKey = apiKey;
    this.fetcher = fetcher;
    this.dataMode = /\/test\/Property$/i.test(this.endpoint.pathname) ? 'test' : 'live';
  }

  async request(params = {}) {
    const url = new URL(this.endpoint);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    });

    let response;
    try {
      response = await this.fetcher(url, {
        headers: { Authorization: `Bearer ${this.apiKey}`, Accept: 'application/json' },
        signal: AbortSignal.timeout(12_000),
      });
    } catch (error) {
      throw new ApiError(502, 'The listing provider could not be reached. Please try again shortly.', 'IDX_UNAVAILABLE', { provider: 'bridge', reason: error.name });
    }

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(502, 'The listing provider rejected the request. Verify the Bridge dataset URL, server token and feed approval.', 'IDX_UNAVAILABLE', { provider: 'bridge', providerStatus: response.status });
    }
    return body || {};
  }

  async search(filters = {}) {
    const { page, limit, skip } = pagination({ page: filters.page, limit: filters.limit || 12 });
    const body = await this.request({
      '$top': limit,
      '$skip': skip,
      '$count': 'true',
      '$orderby': 'ModificationTimestamp desc',
      '$filter': bridgeFilters(filters),
    });
    const items = (Array.isArray(body.value) ? body.value : []).map(normalizeBridgeProperty).filter(Boolean);
    const total = Number(body['@odata.count']) || items.length;
    return {
      items,
      total,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
      providerStatus: this.status,
      provider: 'bridge',
      dataMode: this.dataMode,
      notice: this.dataMode === 'test' ? 'Bridge sandbox data is connected. These are synthetic test listings, not live Miami MLS inventory.' : '',
    };
  }

  async getBySlug(slug) {
    const listingKey = listingKeyFromSlug(slug);
    const body = await this.request({
      '$top': 1,
      '$filter': `ListingKey eq '${escapeOData(listingKey)}' and IDXParticipationYN eq true and InternetEntireListingDisplayYN eq true`,
    });
    const property = normalizeBridgeProperty(body.value?.[0],{details:true});
    if (!property) throw new ApiError(404, 'This property is not available from the approved IDX feed.', 'PROPERTY_UNAVAILABLE');
    return {...property,dataMode:this.dataMode};
  }
}
