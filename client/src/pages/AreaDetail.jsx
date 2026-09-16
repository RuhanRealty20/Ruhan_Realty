import { useParams } from 'react-router-dom';
import { LeadForm } from '../components/forms/LeadForm';
import { MarketSnapshot } from '../components/MarketSnapshot';
import { SEO } from '../components/SEO';
import { FAQAccordion, PageHero, SectionHeading } from '../components/ui';
import { areas, editorialImages } from '../data/site';

export default function AreaDetail(){
  const {slug}=useParams();
  const area=areas.find(a=>a.slug===slug)||{name:'Miami',summary:'Explore Miami real estate with objective, current information.',image:editorialImages.beach};
  const faq=[{q:`What types of homes are found in ${area.name}?`,a:'The mix varies by location and changes over time. This guide will publish current, sourced housing information after content review.'},{q:`Can I see live listings in ${area.name}?`,a:'Yes, once an approved IDX provider is connected. Ruhan-Realty never substitutes invented listings for an authorized feed.'},{q:'How should I compare locations?',a:'Consider objective factors such as housing type, budget, transportation, access and personal priorities. Ruhan does not steer based on protected characteristics.'}];
  return <>
    <SEO title={`${area.name} Real Estate Guide`} description={area.summary}/>
    <PageHero eyebrow="Ruhan-Realty area guide" title={area.name} intro={area.summary} image={area.image}/>
    <section className="section"><div className="container"><div className="split" style={{alignItems:'start'}}><div><SectionHeading eyebrow="Understand the area" title={`${area.name}, in useful context.`}/><p className="lead">This Brown Harris Stevens–supported guide is structured for a reviewed overview, property types, transportation and access, notable points of interest, and objective local context.</p><h3 className="editorial-subtitle">Housing & property types</h3><p>Reviewed area-specific content is pending broker/content approval. Authorized live listings will populate through the shared IDX adapter.</p><h3 className="editorial-subtitle">Transportation & access</h3><p>Only verifiable access and transportation facts should be published here. Travel times are never presented as guaranteed.</p></div><div className="editorial-image-wrap area-detail-image"><img src={area.image} alt={`${area.name} architectural editorial`} width="1000" height="800"/><span className="image-caption">Editorial area imagery · not a listing</span></div></div></div></section>
    <section className="section dark-section"><div className="container"><SectionHeading eyebrow="Current context" title={`${area.name} market snapshot.`}/><MarketSnapshot/></div></section>
    <section className="section-tight"><div className="container"><SectionHeading eyebrow="Approved inventory" title={`Available properties in ${area.name}`}/><div className="placeholder-panel branded-placeholder">Approved IDX feed pending. No fake inventory is shown.</div></div></section>
    <section className="section"><div className="container split"><div><SectionHeading eyebrow="Questions" title="Before you narrow your search."/><FAQAccordion items={faq}/></div><LeadForm intent="buy" title={`Ask Ruhan about ${area.name}`}/></div></section>
  </>;
}
