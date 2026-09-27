import { Calendar, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LeadForm } from '../components/forms/LeadForm';
import { SEO } from '../components/SEO';
import { Breadcrumbs, CTAButton, LoadingSkeleton } from '../components/ui';
import { contact } from '../data/site';
import { api } from '../services/api';
import { track } from '../services/analytics';

export default function PropertyDetail(){
  const {slug}=useParams(); const [property,setProperty]=useState(); const [error,setError]=useState('');
  useEffect(()=>{api.properties.one(slug).then(item=>{setProperty(item);track('property_view',{propertyId:item.id})}).catch(reason=>setError(reason.message))},[slug]);
  if(error)return <div className="page-hero"><div className="container"><h1 className="section-title">Property not available</h1><p>{error}</p><CTAButton to="/properties" variant="light">Back to search</CTAButton></div></div>;
  if(!property)return <div className="page-loader"><LoadingSkeleton lines={6}/></div>;
  const message=encodeURIComponent(`Hello Ruhan, I’m interested in ${property.title}: ${window.location.href}`); const wa=contact.whatsapp?`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}?text=${message}`:'/contact';
  return <><SEO title={property.title} description={property.description} image={property.image} noindex={!property.indexable} schema={{'@context':'https://schema.org','@type':'Offer',name:property.title,url:window.location.href,price:property.rawPrice,priceCurrency:'USD'}}/>
    <section className="page-hero"><div className="container"><Breadcrumbs items={[{label:'Properties',to:'/properties'},{label:property.title}]}/><h1 className="section-title">{property.title}</h1><p className="lead">{property.location}</p></div></section>
    <section className="section-tight"><div className="container"><div className="property-detail-grid"><div><div className="property-image property-detail-image">{property.image&&<img src={property.image} alt={property.imageAlt} width="1200" height="800"/>}</div><p className="listing-attribution">{property.attribution}</p><h2 className="property-detail-price">{property.price}</h2><p>{property.beds} beds · {property.baths} baths · {property.type}</p><p className="lead">{property.description}</p></div>
      <aside className="card property-ruhan-card"><div className="property-agent"><img src={contact.portrait} width="72" height="90" alt="Ruhan Syed"/><div><span>YOUR MIAMI CONNECTION</span><strong>Ruhan Syed</strong><small>Realtor Associate · Brown Harris Stevens</small></div></div><h2>Interested in this property?</h2><p>Ask a question, request a showing, or connect directly. The property ID and page are attached to your inquiry automatically.</p><div className="property-agent-actions"><CTAButton to="#inquiry"><Calendar size={16}/>Ask Ruhan / schedule</CTAButton><a className="btn btn-outline" href={wa} onClick={()=>track('WhatsApp_click',{propertyId:property.id})}><MessageCircle size={16}/>WhatsApp Ruhan</a><a className="btn btn-outline" href={`tel:${contact.phone}`} onClick={()=>track('call_click',{propertyId:property.id})}><Phone size={16}/>Call Ruhan</a><a className="btn btn-outline" href={`mailto:${contact.email}?subject=${encodeURIComponent(`Question about ${property.title}`)}&body=${message}`}><Mail size={16}/>Email Ruhan</a></div><small className="property-verified"><ShieldCheck size={13}/>Listings require approved IDX verification.</small></aside>
    </div></div></section>
    <section id="inquiry" className="section property-inquiry"><div className="container"><LeadForm intent="buy" title="Ask about this property" property={property}/></div></section>
  </>;
}
