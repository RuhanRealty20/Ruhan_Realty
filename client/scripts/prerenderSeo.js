import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const site=(process.env.VITE_SITE_URL||'https://ruhanrealty.com').replace(/\/$/,'');
const suffix=' | Ruhan-Realty · Brown Harris Stevens';
const areas=['Brickell','Downtown Miami','Miami Beach','South Beach','Edgewater','Coconut Grove','Coral Gables','Key Biscayne','Fisher Island','Sunny Isles','Bal Harbour','Aventura','North Miami Beach','Fort Lauderdale'];
const slug=value=>value.toLowerCase().replaceAll(' ','-');
const routes=[
  {path:'/',title:'Your Miami Real Estate Connection',description:'Personal help buying, selling, renting or relocating in Miami and South Florida, supported by Brown Harris Stevens.'},
  {path:'/properties',title:'Miami Properties for Sale and Rent',description:'Search authorized Miami and South Florida MLS/IDX listings and request personal property guidance.'},
  {path:'/buy',title:'Buy a Home in Miami',description:'Build a focused Miami home-buying plan around your goals, budget, timing and preferred property type.'},
  {path:'/sell',title:'Request a Personal Miami Property CMA',description:'Request a personal comparative market analysis and a thoughtful strategy for selling your Miami property.'},
  {path:'/rent',title:'Rent a Property in Miami',description:'Create a focused Miami rental brief and search authorized rental inventory with personal guidance.'},
  {path:'/landlord',title:'List a Miami Rental Property',description:'Share your rental property details, timing and goals to begin a personal listing conversation.'},
  {path:'/invest',title:'Miami Real Estate Investment Guidance',description:'Explore Miami real estate investment opportunities with objective context around budget, financing, strategy and timeframe.'},
  {path:'/relocate',title:'Relocate to Miami',description:'Plan a move to Miami with practical housing, location and timing guidance backed by Brown Harris Stevens resources.'},
  {path:'/new-construction',title:'Miami New Construction',description:'Request current, authorized information about Miami new-construction properties, pricing and availability.'},
  {path:'/contact',title:'Contact Ruhan-Realty',description:'Start a personal conversation about buying, selling, renting, investing or relocating in Miami and South Florida.'},
  {path:'/ny-nj-to-miami',title:'New York and New Jersey to Miami Relocation',description:'Compare buying, renting, area orientation and practical logistics for a considered move from NY or NJ to Miami.'},
  {path:'/areas',title:'Miami and South Florida Area Guides',description:'Explore objective Miami and South Florida area guides covering housing types, access, amenities and authorized listings.'},
  {path:'/about',title:'About the Miami Real Estate Advisor',description:'Learn about the business, hospitality and relationship-first approach behind Ruhan-Realty at Brown Harris Stevens Miami Beach.'},
  {path:'/market-today',title:'Miami Real Estate Market Today',description:'Review sourced Miami real-estate market information with reporting periods, geography and update dates.',noindex:true},
  {path:'/insights',title:'Miami Real Estate Insights',description:'Reviewed and source-attributed Miami real estate insights.',noindex:true},
  {path:'/privacy',title:'Privacy Policy',description:'Privacy information for RuhanRealty.com.',noindex:true},
  {path:'/terms',title:'Terms of Use',description:'Terms of use for RuhanRealty.com.',noindex:true},
  {path:'/cookies',title:'Cookie and Analytics Preferences',description:'Cookie and analytics preferences for RuhanRealty.com.',noindex:true},
  ...areas.map(name=>({path:`/areas/${slug(name)}`,title:`${name} Real Estate Guide`,description:`Explore ${name} real estate, housing types, access, notable amenities and authorized property listings with objective Miami-area guidance.`,noindex:true})),
];

const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const replaceMeta=(html,selector,value)=>html.replace(selector,match=>match.replace(/content="[^"]*"/,`content="${escape(value)}"`));
function render(template,route){
  const url=`${site}${route.path}`;const title=`${route.title}${suffix}`;const robots=route.noindex?'noindex,nofollow':'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  let html=template.replace(/<title>[^<]*<\/title>/,`<title>${escape(title)}</title>`).replace(/<link rel="canonical" href="[^"]*" \/>/,`<link rel="canonical" href="${url}" />`);
  html=replaceMeta(html,/<meta name="description"[^>]*>/,route.description);
  html=replaceMeta(html,/<meta name="robots"[^>]*>/,robots);
  html=replaceMeta(html,/<meta name="googlebot"[^>]*>/,robots);
  html=replaceMeta(html,/<meta property="og:title"[^>]*>/,title);
  html=replaceMeta(html,/<meta property="og:description"[^>]*>/,route.description);
  html=replaceMeta(html,/<meta property="og:url"[^>]*>/,url);
  html=replaceMeta(html,/<meta name="twitter:title"[^>]*>/,title);
  html=replaceMeta(html,/<meta name="twitter:description"[^>]*>/,route.description);
  return html;
}

const template=await readFile(path.join(dist,'index.html'),'utf8');
await Promise.all(routes.map(async route=>{
  const target=route.path==='/'?path.join(dist,'index.html'):path.join(dist,route.path.slice(1),'index.html');
  await mkdir(path.dirname(target),{recursive:true});
  await writeFile(target,render(template,route));
}));
console.log(`Prerendered metadata for ${routes.length} public routes.`);
