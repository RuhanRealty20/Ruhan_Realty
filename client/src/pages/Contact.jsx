import { ArrowUpRight, Building2, Clock3, Languages, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { ContactLinks, SocialDirectory } from '../components/ContactLinks';
import { LeadForm } from '../components/forms/LeadForm';
import { SEO } from '../components/SEO';
import { PageHero, SectionHeading } from '../components/ui';
import { contact, editorialImages } from '../data/site';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { track } from '../services/analytics';

const phoneHref=`tel:${contact.phone}`;
const emailHref=`mailto:${contact.email}`;
const whatsappHref=`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent('Hello Ruhan, I would like to discuss Miami real estate.')}`;

const methods=[
  {label:'Call or text',value:contact.phoneLabel,detail:'A direct conversation with Ruhan',href:phoneHref,Icon:Phone,event:'call_click'},
  {label:'WhatsApp',value:contact.phoneLabel,detail:'Send a message anytime',href:whatsappHref,Icon:MessageCircle,event:'WhatsApp_click',external:true},
  {label:'Email',value:contact.email,detail:'Share details at your convenience',href:emailHref,Icon:Mail,event:'email_click'},
  {label:'BHS Miami Beach',value:contact.officePhoneLabel,detail:'Continuum office',href:`tel:${contact.officePhone}`,Icon:Building2,event:'call_click'},
];

export default function Contact(){
  const revealRef=useScrollReveal();
  return <div ref={revealRef} className="contact-page">
    <SEO title="Contact Ruhan Syed | Miami Real Estate" description="Talk directly with Ruhan Syed, Realtor Associate at Brown Harris Stevens Miami Beach, about buying, selling, renting, investing or relocating."/>
    <PageHero eyebrow="A direct Miami connection" title="Let’s talk about your next move." intro="One thoughtful conversation can bring clarity to buying, selling, renting, investing or relocating in Miami and South Florida." image={editorialImages.beach}>
      <div className="contact-hero-actions">
        <a href={phoneHref} onClick={()=>track('call_click')}><Phone size={16}/> Call {contact.phoneLabel}</a>
        <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={()=>track('WhatsApp_click')}><MessageCircle size={16}/> WhatsApp Ruhan</a>
        <a href={emailHref} onClick={()=>track('email_click')}><Mail size={16}/> {contact.email}</a>
      </div>
    </PageHero>

    <section className="section contact-methods-section"><div className="container">
      <div data-reveal><SectionHeading eyebrow="Choose what feels easiest" title="Ruhan is one message away." intro="Use the form for a detailed brief, or connect directly through your preferred channel."/></div>
      <div className="contact-method-grid">{methods.map(({label,value,detail,href,Icon,event,external},index)=><a data-reveal style={{'--reveal-delay':`${index*80}ms`}} className="contact-method-card" href={href} target={external?'_blank':undefined} rel={external?'noreferrer':undefined} onClick={()=>track(event,{location:'contact_method'})} key={label}><span className="contact-method-icon"><Icon/></span><span><small>{label}</small><strong>{value}</strong><em>{detail}</em></span><ArrowUpRight className="contact-method-arrow" size={18}/></a>)}</div>
    </div></section>

    <section className="section contact-conversation"><div className="container contact-conversation-grid">
      <div className="contact-story" data-reveal>
        <span className="eyebrow">Personal service · established support</span>
        <h2 className="section-title">Start with the goal.<br/><em>Build the right plan.</em></h2>
        <p className="lead">Tell Ruhan where you are today and what you want the next step to accomplish. The short form adapts to your intent and sends the useful details directly into the Ruhan-Realty CRM.</p>
        <div className="contact-trust-list"><p><ShieldCheck/> Private, secure inquiry</p><p><Clock3/> Responsive personal follow-up</p><p><Languages/> English, Hindi and Urdu</p></div>
        <div className="contact-editorial-collage"><div className="contact-collage-main"><img src={editorialImages.grove} width="1600" height="1024" alt="Tropical Miami residential architecture" loading="lazy"/></div><div className="contact-collage-small"><img src={editorialImages.interior} width="1600" height="1024" alt="Refined Miami waterfront residence interior" loading="lazy"/></div><span>Miami perspective · personal attention</span></div>
      </div>
      <div className="contact-form-column" data-reveal style={{'--reveal-delay':'120ms'}}><div className="contact-form-intro"><span>01</span><p>Share your priorities<br/><small>Usually takes less than two minutes.</small></p></div><LeadForm intent="contact" title="How can Ruhan help?"/></div>
    </div></section>

    <section className="section dark-section contact-social-section"><div className="container contact-social-grid">
      <div data-reveal><span className="eyebrow">Ruhan-Realty, beyond the website</span><h2 className="section-title">Follow the Miami conversation.</h2><p className="lead">Property perspectives, Miami area content, market context and the work behind a relationship-first real-estate practice.</p><a className="contact-bhs-link" href={contact.bhsProfile} target="_blank" rel="noreferrer"><Building2/> <span><small>Professional profile</small><strong>Brown Harris Stevens</strong></span><ArrowUpRight/></a></div>
      <div data-reveal style={{'--reveal-delay':'100ms'}}><SocialDirectory showPending/></div>
    </div></section>

    <section className="section contact-office"><div className="container contact-office-grid">
      <div className="contact-office-image" data-reveal><img src={editorialImages.brickell} width="1600" height="1024" alt="Miami waterfront skyline and contemporary architecture" loading="lazy"/><span>Brown Harris Stevens · Miami Beach</span></div>
      <div data-reveal style={{'--reveal-delay':'100ms'}}><span className="eyebrow">Office & availability</span><h2 className="section-title">Meet in Miami Beach.</h2><div className="contact-office-address"><MapPin/><div><strong>Miami Beach Continuum</strong><p>{contact.office.replace('Miami Beach Continuum · ','')}</p></div></div><ContactLinks/><p className="contact-expectation"><Clock3/> Send a message anytime. Ruhan will personally follow up as soon as reasonably possible; the website does not promise instant 24/7 personal responses.</p></div>
    </div></section>
  </div>;
}
