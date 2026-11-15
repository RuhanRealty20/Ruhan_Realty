import { Accessibility, Building2, Calendar, CalendarDays, Car, CookingPot, Dumbbell, Eye, ExternalLink, Flame, Mail, MapPin, MessageCircle, PawPrint, Phone, ShieldCheck, Snowflake, Sparkles, Trees, WashingMachine, Waves, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BHSLogo } from '../components/BHSLogo';
import { PropertyImage } from '../components/PropertyImage';
import { SEO } from '../components/SEO';
import { LeadForm } from '../components/forms/LeadForm';
import { Breadcrumbs, CTAButton, LoadingSkeleton } from '../components/ui';
import { contact } from '../data/site';
import { track } from '../services/analytics';
import { api } from '../services/api';

const dateLabel=(value)=>value?new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(value)):'';

function AmenityIcon({label=''}){
  const value=label.toLowerCase();
  let icon=<Sparkles size={16}/>;
  if(/pool|spa|water|ocean|bay|dock|beach/.test(value))icon=<Waves size={16}/>;
  else if(/parking|garage|carport|valet/.test(value))icon=<Car size={16}/>;
  else if(/gym|fitness|exercise|sport/.test(value))icon=<Dumbbell size={16}/>;
  else if(/pet|dog|cat/.test(value))icon=<PawPrint size={16}/>;
  else if(/air condition|cooling|central air/.test(value))icon=<Snowflake size={16}/>;
  else if(/fireplace|fire pit/.test(value))icon=<Flame size={16}/>;
  else if(/kitchen|appliance|oven|range|refrigerator|dishwasher/.test(value))icon=<CookingPot size={16}/>;
  else if(/laundry|washer|dryer/.test(value))icon=<WashingMachine size={16}/>;
  else if(/view|skyline|intracoastal/.test(value))icon=<Eye size={16}/>;
  else if(/garden|landscape|tree|patio|balcony|terrace|yard/.test(value))icon=<Trees size={16}/>;
  else if(/security|guard|gated|doorman|key|alarm/.test(value))icon=<ShieldCheck size={16}/>;
  else if(/accessible|wheelchair/.test(value))icon=<Accessibility size={16}/>;
  else if(/electric|generator|solar|energy/.test(value))icon=<Zap size={16}/>;
  else if(/building|club|community|lobby|elevator/.test(value))icon=<Building2 size={16}/>;
  return <span className="property-amenity-icon" aria-hidden="true">{icon}</span>;
}

export default function PropertyDetail(){
  const {slug}=useParams();
  const [result,setResult]=useState({slug:'',property:undefined,error:''});
  const [galleryState,setGalleryState]=useState({slug:'',index:0});

  useEffect(()=>{let active=true;api.properties.one(slug).then(item=>{if(!active)return;setResult({slug,property:item,error:''});track('property_view',{propertyId:item.id})}).catch(reason=>{if(active)setResult({slug,property:undefined,error:reason.message})});return()=>{active=false}},[slug]);
  const property=result.slug===slug?result.property:undefined;
  const error=result.slug===slug?result.error:'';
  const activeImage=galleryState.slug===slug?galleryState.index:0;
  if(error)return <div className="page-hero"><div className="container"><h1 className="section-title">Property not available</h1><p>{error}</p><CTAButton to="/properties" variant="light">Back to search</CTAButton></div></div>;
  if(!property)return <div className="page-loader"><LoadingSkeleton lines={8}/></div>;

  const gallery=property.gallery?.length?property.gallery:[{url:property.image,alt:property.imageAlt}];
  const selected=gallery[Math.min(activeImage,gallery.length-1)]||{};
  const message=encodeURIComponent(`Hello, I’m interested in ${property.title}: ${window.location.href}`);
  const wa=contact.whatsapp?`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}?text=${message}`:'/contact';
  const mapQuery=encodeURIComponent([property.address,property.location].filter(Boolean).join(', '));
  const hasCoordinates=Number.isFinite(property.latitude)&&Number.isFinite(property.longitude);
  const mapDelta=.015;
  const mapEmbed=hasCoordinates?`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude-mapDelta}%2C${property.latitude-mapDelta}%2C${property.longitude+mapDelta}%2C${property.latitude+mapDelta}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`:'';
  const mapLink=hasCoordinates?`https://www.openstreetmap.org/?mlat=${property.latitude}&mlon=${property.longitude}#map=15/${property.latitude}/${property.longitude}`:`https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const schema={'@context':'https://schema.org','@type':'Offer',name:property.title,url:window.location.href,price:property.rawPrice,priceCurrency:'USD',itemOffered:{'@type':'Residence',name:property.title,address:property.address,image:property.gallery?.map(image=>image.url).filter(Boolean)}};

  return <><SEO title={property.title} description={property.description} image={property.image} noindex={!property.indexable||property.dataMode==='test'} schema={schema}/>
    <section className="property-detail-hero"><div className="container"><Breadcrumbs items={[{label:'Properties',to:'/properties'},{label:property.title}]}/><div className="property-detail-heading"><div><span className="property-detail-status">{property.status}</span><h1>{property.title}</h1><p><MapPin size={17}/>{property.location}</p></div><div><small>Offered at</small><strong>{property.price}</strong></div></div></div></section>
    {property.dataMode==='test'&&<div className="property-sandbox-note"><div className="container"><ShieldCheck size={17}/><span>Bridge sandbox listing: property facts are synthetic test data and the sandbox photo CDN may be unavailable. Replace the test dataset with the approved production feed for live Miami inventory.</span></div></div>}
    <section className="property-detail-content"><div className="container">
      <div className="property-gallery"><div className="property-gallery-main"><PropertyImage key={selected.url||activeImage} src={selected.url} alt={selected.alt||property.imageAlt} loading="eager" fetchPriority="high"/><span>{activeImage+1} / {gallery.length}</span></div>{gallery.length>1&&<div className="property-gallery-thumbs" aria-label="Property photo gallery">{gallery.slice(0,8).map((image,index)=><button type="button" className={activeImage===index?'active':''} key={`${image.url}-${index}`} onClick={()=>setGalleryState({slug,index})} aria-label={`View photo ${index+1}`}><PropertyImage src={image.url} alt=""/></button>)}</div>}</div>
      <div className="property-detail-grid"><main className="property-detail-main">
        <section className="property-fact-section" aria-labelledby="property-facts-title"><div className="property-section-heading"><span>At a glance</span><h2 id="property-facts-title">Property facts</h2></div><div className="property-fact-grid">{property.facts?.map(fact=><article key={fact.label}><small>{fact.label}</small><strong>{fact.value}</strong></article>)}</div></section>
        <section className="property-copy-section"><div className="property-section-heading"><span>The residence</span><h2>About this property</h2></div><p>{property.description}</p></section>
        {property.featureSections?.length>0&&<section className="property-feature-section"><div className="property-section-heading"><span>Details</span><h2>Features & amenities</h2><p className="property-section-intro">Explore the features supplied by the approved listing feed.</p></div><div className="property-feature-grid">{property.featureSections.map(section=><article key={section.title}><h3>{section.title}</h3><ul>{section.items.map(item=><li key={item}><AmenityIcon label={item}/><span>{item}</span></li>)}</ul></article>)}</div></section>}
        {property.detailGroups?.length>0&&<section className="property-complete-section" aria-labelledby="complete-property-details"><div className="property-section-heading"><span>Complete listing record</span><h2 id="complete-property-details">All available property information</h2><p className="property-section-intro">Every public detail currently supplied by the authorized IDX record is organized below. Blank or private MLS-only fields are never shown.</p></div><div className="property-detail-groups">{property.detailGroups.map(group=><article key={group.title}><h3><Building2 size={18}/>{group.title}</h3><dl>{group.items.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></article>)}</div></section>}
        <section className="property-location-section"><div className="property-section-heading"><span>Location & listing</span><h2>Additional information</h2></div><div className="property-additional-grid"><article><MapPin/><div><small>Location</small><strong>{property.subdivision||property.county||property.location}</strong><span>{property.county&&`${property.county} County`}</span></div></article>{property.onMarketDate&&<article><CalendarDays/><div><small>On market</small><strong>{dateLabel(property.onMarketDate)}</strong><span>{property.updatedAt&&`Updated ${dateLabel(property.updatedAt)}`}</span></div></article>}<article><ShieldCheck/><div><small>Listing identification</small><strong>MLS #{property.listingId}</strong><span>{property.listingOffice||'Approved IDX listing office'}</span></div></article></div><div className="property-external-actions"><a className="btn btn-outline" href={mapLink} target="_blank" rel="noreferrer"><MapPin size={16}/>Open full map</a>{property.virtualTourUrl&&<a className="btn btn-outline" href={property.virtualTourUrl} target="_blank" rel="noreferrer"><ExternalLink size={16}/>Virtual tour</a>}</div></section>
        <section className="property-listing-disclosure"><strong>Listing information</strong><p>{property.attribution}</p>{property.listingAgent&&<p>Listing agent: {property.listingAgent}{property.listingOffice&&` · ${property.listingOffice}`}</p>}<small>Availability, price and property information can change. Verify all material facts through the approved IDX source and appropriate professionals.</small></section>
      </main>
      <aside className="card property-ruhan-card"><div className="property-agent property-agent-bhs"><BHSLogo/><div><span>YOUR MIAMI CONNECTION</span><strong>Personal property guidance</strong><small>Realtor Associate · Brown Harris Stevens</small></div></div><h2>Interested in this property?</h2><p>Ask a question, request a showing, or connect directly. The listing ID and page are attached to your inquiry automatically.</p><div className="property-agent-actions"><CTAButton to="#inquiry"><Calendar size={16}/>Ask a question / schedule</CTAButton><a className="btn btn-outline" href={wa} onClick={()=>track('WhatsApp_click',{propertyId:property.id})}><MessageCircle size={16}/>Continue on WhatsApp</a><a className="btn btn-outline" href={`tel:${contact.phone}`} onClick={()=>track('call_click',{propertyId:property.id})}><Phone size={16}/>Call directly</a><a className="btn btn-outline" href={`mailto:${contact.email}?subject=${encodeURIComponent(`Question about ${property.title}`)}&body=${message}`}><Mail size={16}/>Send an email</a></div><small className="property-verified"><ShieldCheck size={13}/>Property details supplied by the approved IDX feed.</small></aside>
      </div>
    </div></section>
    <section className="property-map-section" aria-labelledby="property-map-title"><div className="container"><div className="property-map-heading"><div className="property-section-heading"><span>Explore the location</span><h2 id="property-map-title">Property map</h2></div><a className="btn btn-outline" href={mapLink} target="_blank" rel="noreferrer"><ExternalLink size={16}/>Open interactive map</a></div><div className={`property-map-shell ${hasCoordinates?'has-map':'map-unavailable'}`}>{hasCoordinates?<iframe src={mapEmbed} title={`Map showing ${property.title}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>:<div className="property-map-placeholder"><MapPin size={34}/><h3>Map coordinates are not available</h3><p>Open the property address in your map app for directions and nearby places.</p></div>}<div className="property-map-card"><span><MapPin size={15}/>Listing location</span><strong>{property.address}</strong><p>{property.location}</p>{property.dataMode==='test'&&<small>Sandbox coordinates and addresses are synthetic and are shown only for integration testing.</small>}</div></div>{hasCoordinates&&<p className="property-map-attribution">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>. Location should be independently verified.</p>}</div></section>
    <section id="inquiry" className="section property-inquiry"><div className="container"><LeadForm intent={property.status==='For Rent'?'rent':'buy'} title="Ask about this property" property={property}/></div></section>
  </>;
}
