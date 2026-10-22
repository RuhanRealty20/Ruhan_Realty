import { Calendar, CalendarDays, CheckCircle2, ExternalLink, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
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
  const schema={'@context':'https://schema.org','@type':'Offer',name:property.title,url:window.location.href,price:property.rawPrice,priceCurrency:'USD',itemOffered:{'@type':'Residence',name:property.title,address:property.address,image:property.gallery?.map(image=>image.url).filter(Boolean)}};

  return <><SEO title={property.title} description={property.description} image={property.image} noindex={!property.indexable||property.dataMode==='test'} schema={schema}/>
    <section className="property-detail-hero"><div className="container"><Breadcrumbs items={[{label:'Properties',to:'/properties'},{label:property.title}]}/><div className="property-detail-heading"><div><span className="property-detail-status">{property.status}</span><h1>{property.title}</h1><p><MapPin size={17}/>{property.location}</p></div><div><small>Offered at</small><strong>{property.price}</strong></div></div></div></section>
    {property.dataMode==='test'&&<div className="property-sandbox-note"><div className="container"><ShieldCheck size={17}/><span>Bridge sandbox listing: property facts are synthetic test data and the sandbox photo CDN may be unavailable. Replace the test dataset with the approved production feed for live Miami inventory.</span></div></div>}
    <section className="property-detail-content"><div className="container">
      <div className="property-gallery"><div className="property-gallery-main"><PropertyImage key={selected.url||activeImage} src={selected.url} alt={selected.alt||property.imageAlt} loading="eager" fetchPriority="high"/><span>{activeImage+1} / {gallery.length}</span></div>{gallery.length>1&&<div className="property-gallery-thumbs" aria-label="Property photo gallery">{gallery.slice(0,8).map((image,index)=><button type="button" className={activeImage===index?'active':''} key={`${image.url}-${index}`} onClick={()=>setGalleryState({slug,index})} aria-label={`View photo ${index+1}`}><PropertyImage src={image.url} alt=""/></button>)}</div>}</div>
      <div className="property-detail-grid"><main className="property-detail-main">
        <section className="property-fact-section" aria-labelledby="property-facts-title"><div className="property-section-heading"><span>At a glance</span><h2 id="property-facts-title">Property facts</h2></div><div className="property-fact-grid">{property.facts?.map(fact=><article key={fact.label}><small>{fact.label}</small><strong>{fact.value}</strong></article>)}</div></section>
        <section className="property-copy-section"><div className="property-section-heading"><span>The residence</span><h2>About this property</h2></div><p>{property.description}</p></section>
        {property.featureSections?.length>0&&<section className="property-feature-section"><div className="property-section-heading"><span>Details</span><h2>Features & amenities</h2></div><div className="property-feature-grid">{property.featureSections.map(section=><article key={section.title}><h3>{section.title}</h3><ul>{section.items.map(item=><li key={item}><CheckCircle2 size={15}/>{item}</li>)}</ul></article>)}</div></section>}
        <section className="property-location-section"><div className="property-section-heading"><span>Location & listing</span><h2>Additional information</h2></div><div className="property-additional-grid"><article><MapPin/><div><small>Location</small><strong>{property.subdivision||property.county||property.location}</strong><span>{property.county&&`${property.county} County`}</span></div></article>{property.onMarketDate&&<article><CalendarDays/><div><small>On market</small><strong>{dateLabel(property.onMarketDate)}</strong><span>{property.updatedAt&&`Updated ${dateLabel(property.updatedAt)}`}</span></div></article>}<article><ShieldCheck/><div><small>Listing identification</small><strong>MLS #{property.listingId}</strong><span>{property.listingOffice||'Approved IDX listing office'}</span></div></article></div><div className="property-external-actions"><a className="btn btn-outline" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer"><MapPin size={16}/>View map</a>{property.virtualTourUrl&&<a className="btn btn-outline" href={property.virtualTourUrl} target="_blank" rel="noreferrer"><ExternalLink size={16}/>Virtual tour</a>}</div></section>
        <section className="property-listing-disclosure"><strong>Listing information</strong><p>{property.attribution}</p>{property.listingAgent&&<p>Listing agent: {property.listingAgent}{property.listingOffice&&` · ${property.listingOffice}`}</p>}<small>Availability, price and property information can change. Verify all material facts through the approved IDX source and appropriate professionals.</small></section>
      </main>
      <aside className="card property-ruhan-card"><div className="property-agent property-agent-bhs"><BHSLogo/><div><span>YOUR MIAMI CONNECTION</span><strong>Personal property guidance</strong><small>Realtor Associate · Brown Harris Stevens</small></div></div><h2>Interested in this property?</h2><p>Ask a question, request a showing, or connect directly. The listing ID and page are attached to your inquiry automatically.</p><div className="property-agent-actions"><CTAButton to="#inquiry"><Calendar size={16}/>Ask a question / schedule</CTAButton><a className="btn btn-outline" href={wa} onClick={()=>track('WhatsApp_click',{propertyId:property.id})}><MessageCircle size={16}/>Continue on WhatsApp</a><a className="btn btn-outline" href={`tel:${contact.phone}`} onClick={()=>track('call_click',{propertyId:property.id})}><Phone size={16}/>Call directly</a><a className="btn btn-outline" href={`mailto:${contact.email}?subject=${encodeURIComponent(`Question about ${property.title}`)}&body=${message}`}><Mail size={16}/>Send an email</a></div><small className="property-verified"><ShieldCheck size={13}/>Property details supplied by the approved IDX feed.</small></aside>
      </div>
    </div></section>
    <section id="inquiry" className="section property-inquiry"><div className="container"><LeadForm intent={property.status==='For Rent'?'rent':'buy'} title="Ask about this property" property={property}/></div></section>
  </>;
}
