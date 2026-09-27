import { Building2, ChartNoAxesCombined, CircleHelp, HardHat, House, KeyRound, MapPinned, MoveRight, Search, Signpost, Waves } from 'lucide-react';
import brickellImage from '../assets/brickell-waterfront-editorial.webp';
import beachImage from '../assets/miami-beach-editorial.webp';
import groveImage from '../assets/coconut-grove-editorial.webp';
import interiorImage from '../assets/luxury-interior-editorial.webp';
import ruhanPortrait from '../assets/ruhan-syed-color-portrait.webp';

export const contact = {
  phone: import.meta.env.VITE_RUHAN_PHONE || '+14078402959', phoneLabel: '407-840-2959',
  email: import.meta.env.VITE_RUHAN_EMAIL || 'rsyed@bhsusa.com', whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '+14078402959',
  officePhone: import.meta.env.VITE_BHS_OFFICE_PHONE || '+13056951111', officePhoneLabel: '305-695-1111',
  office: import.meta.env.VITE_BHS_OFFICE_ADDRESS || 'Miami Beach Continuum · 40 South Pointe Drive, Suite 110, Miami Beach, FL 33139',
  bhsProfile: import.meta.env.VITE_BHS_PROFILE_URL || 'https://bhsmiami.com/bhs_miami_profiles.asp?PPD=3647548&RNAME=Ruhan+Syed',
  portrait: import.meta.env.VITE_RUHAN_PORTRAIT_URL || ruhanPortrait,
  social: { instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/ruhan_realty/', facebook: import.meta.env.VITE_FACEBOOK_URL || '', linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/ruhan-syed-49068b176' },
};

export const navItems = [['Buy','/buy'],['Sell','/sell'],['Rent','/rent'],['Areas','/areas'],['Market','/market-today'],['About','/about'],['Contact','/contact']];

const resolveAreaImage=(name)=>{
  if(['Brickell','Downtown Miami','Edgewater','Aventura','North Miami Beach','Fort Lauderdale'].includes(name))return brickellImage;
  if(['Miami Beach','South Beach','Key Biscayne','Fisher Island','Sunny Isles','Bal Harbour'].includes(name))return beachImage;
  if(['Coconut Grove','Coral Gables'].includes(name))return groveImage;
  return interiorImage;
};

const areaDetails={
  Brickell:['High-rise condos','Waterfront','Urban core'], 'Downtown Miami':['Condo living','Transit access','Culture'],
  'Miami Beach':['Condos & homes','Oceanfront','Architecture'], 'South Beach':['Condos','Beach access','Art Deco'],
  Edgewater:['Bayfront condos','Newer towers','Central access'], 'Coconut Grove':['Homes & condos','Marinas','Village setting'],
  'Coral Gables':['Homes & condos','Historic core','Business district'], 'Key Biscayne':['Island living','Condos & homes','Water access'],
  'Fisher Island':['Private island','Luxury residences','Ferry access'], 'Sunny Isles':['Oceanfront condos','High-rise living','Beach access'],
  'Bal Harbour':['Luxury condos','Oceanfront','Shopping'], Aventura:['Condos & homes','Shopping','North-Dade access'],
  'North Miami Beach':['Mixed housing','Regional access','Parks'], 'Fort Lauderdale':['Waterfront','Condos & homes','Broward access'],
};

export const intents = [
  { label:'Buy a home', path:'/buy', icon:House }, { label:'Sell my property', path:'/sell', icon:Signpost },
  { label:'Rent a property', path:'/rent', icon:KeyRound }, { label:'List my rental', path:'/landlord', icon:Building2 },
  { label:'Relocate to Miami', path:'/relocate', icon:MoveRight }, { label:'Invest in real estate', path:'/invest', icon:ChartNoAxesCombined },
  { label:'New construction', path:'/new-construction', icon:HardHat }, { label:'General question', path:'/contact', icon:CircleHelp },
];

export const areas = ['Brickell','Downtown Miami','Miami Beach','South Beach','Edgewater','Coconut Grove','Coral Gables','Key Biscayne','Fisher Island','Sunny Isles','Bal Harbour','Aventura','North Miami Beach','Fort Lauderdale']
  .map((name,i)=>({name,slug:name.toLowerCase().replaceAll(' ','-'),icon:i%2?MapPinned:Waves,image:resolveAreaImage(name),tags:areaDetails[name]||[],summary:`An objective introduction to ${name}, its housing mix, access, amenities and approved IDX inventory when connected.`}));

export const editorialImages={brickell:brickellImage,beach:beachImage,grove:groveImage,interior:interiorImage};

export const conversionContent = {
  buy:{eyebrow:'Find your place',title:'Buy in Miami with clarity.',intro:'Tell Ruhan what matters to you. You’ll receive a focused, responsive search plan—not a stream of irrelevant listings.',formTitle:'Build my buyer brief'},
  sell:{eyebrow:'A thoughtful selling plan',title:'Request a personal CMA.',intro:'Every property and ownership goal is different. Request a considered comparative market analysis and conversation with Ruhan—never an automated estimate presented as fact.',formTitle:'Request my personal CMA'},
  rent:{eyebrow:'Your next Miami address',title:'Rent with a sharper search.',intro:'Share your timing, budget and priorities so Ruhan can help you navigate authorized rental inventory efficiently.',formTitle:'Create my rental brief'},
  landlord:{eyebrow:'Rental property owners',title:'List your rental with intention.',intro:'Start with the facts about your property, timing and goals. Ruhan will follow up to discuss positioning and next steps.',formTitle:'Tell Ruhan about my property'},
  invest:{eyebrow:'Strategy before property',title:'Invest with context, not hype.',intro:'Define your objective, timeframe and risk considerations. No guaranteed returns—just factual information and a disciplined property conversation.',formTitle:'Start an investment conversation'},
  relocate:{eyebrow:'A smoother move south',title:'Relocate to Miami with a local guide.',intro:'From renting before buying to neighborhood orientation and second-home considerations, build a practical move plan with Ruhan and Brown Harris Stevens resources.',formTitle:'Plan my Miami move'},
  'new-construction':{eyebrow:'Current. Authorized. Clear.',title:'Explore Miami new construction.',intro:'Availability, pricing and incentives change. Ask Ruhan for current, authorized information directly from approved sources.',formTitle:'Tell Ruhan what you’re looking for'},
  contact:{eyebrow:'A direct connection',title:'Talk to Ruhan.',intro:'Questions about buying, selling, renting, investing or relocating? Start here and expect a personal, responsive follow-up.',formTitle:'How can Ruhan help?'},
};

export const marketPlaceholders=[['Active listings','Awaiting approved source'],['New listings','Awaiting approved source'],['Median sale price','Awaiting approved source'],['Months of supply','Awaiting approved source'],['Days on market','Awaiting approved source'],['Mortgage rates','External source required'],['Rental trends','Awaiting approved source']];
export const leadMagnets=[['Miami Home Buying Guide','buy'],['Miami Property Seller Guide','sell'],['NY → Miami Relocation Guide','relocate'],['Miami Rental Checklist','rent'],['Miami Real Estate Investment Guide','invest']];
export const propertyFilters=['For Sale','For Rent','New Listings','Open Houses','Waterfront','New Construction','Price Reduced'];
export const quickSearchIcon=Search;
