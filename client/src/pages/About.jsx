import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, ChefHat, GraduationCap, Handshake, Languages, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { BHSLogo } from '../components/BHSLogo';
import { SEO } from '../components/SEO';
import { CTAButton, PageHero, SectionHeading } from '../components/ui';
import { contact, editorialImages } from '../data/site';

const aboutSchema={'@context':'https://schema.org','@graph':[
  {'@type':'Person','@id':'https://ruhanrealty.com/#ruhan-syed',name:'Ruhan Syed',jobTitle:'Realtor Associate',url:'https://ruhanrealty.com/about',image:'https://ruhanrealty.com/images/ruhan-syed-miami-realtor.webp',telephone:contact.phone,email:contact.email,worksFor:{'@type':'Organization',name:'Brown Harris Stevens'},knowsLanguage:['English','Hindi','Urdu'],sameAs:[contact.bhsProfile,contact.social.instagram,contact.social.linkedin,contact.social.facebook].filter(Boolean)},
  {'@type':'AboutPage',name:'About Ruhan Syed',url:'https://ruhanrealty.com/about',mainEntity:{'@id':'https://ruhanrealty.com/#ruhan-syed'}},
]};

const principles=[
  [MapPin,'Miami perspective','Local context shaped by living, studying and building a career in Miami.'],
  [BriefcaseBusiness,'Business discipline','Clear priorities, thoughtful positioning and responsive follow-through.'],
  [GraduationCap,'Always informed','An MBA mindset paired with current, verified real-estate information.'],
  [Handshake,'Relationship first','Hospitality-informed service centered on trust and long-term relationships.'],
];

export default function About(){return <>
  <SEO title="About Ruhan Syed | Miami Realtor Associate" description="Meet Ruhan Syed of Ruhan-Realty, Realtor Associate at Brown Harris Stevens Miami Beach, and learn about his background and relationship-first approach." image={contact.portrait} schema={aboutSchema}/>
  <PageHero eyebrow="Ruhan-Realty · Meet Ruhan Syed" title="Business-minded. Hospitality-shaped. Relationship-first." intro="Personal Miami real-estate guidance in English, Hindi and Urdu, backed by the resources of Brown Harris Stevens." image={editorialImages.grove}/>

  <section className="section about-profile-section"><div className="container about-profile-shell">
    <div className="about-profile-visual"><img src={contact.portrait} width="1536" height="1024" alt="Ruhan Syed, Realtor Associate at Brown Harris Stevens Miami Beach" fetchPriority="high"/><div className="about-profile-overlay"/><div className="about-profile-bhs"><BHSLogo/></div><div className="about-profile-identity"><span>RUHAN SYED</span><h2>Your Miami real estate connection.</h2><p>Realtor Associate</p><strong>Brown Harris Stevens · Miami Beach</strong></div></div>
    <article className="about-profile-content"><div className="about-profile-topline"><span className="eyebrow">About Ruhan</span><span className="about-profile-trust"><ShieldCheck size={14}/> Personal, responsive guidance</span></div><h2 className="section-title">A global perspective.<br/><em>A personal Miami connection.</em></h2><p className="lead">Ruhan’s story begins in Mumbai, where an entrepreneurial environment shaped his curiosity, discipline and relationship-driven outlook.</p>
      <div className="about-profile-facts"><article><GraduationCap/><span><small>Perspective</small><strong>MBA & business experience</strong></span></article><article><Languages/><span><small>Languages</small><strong>English · Hindi · Urdu</strong></span></article><article><Handshake/><span><small>Service</small><strong>Relationship-first</strong></span></article></div>
      <div className="about-profile-copy"><p>Before real estate, he built experience across business and technology sales. After moving to the United States, Ruhan earned his MBA in Miami and worked in hospitality and front-office roles—experiences that sharpened his ability to listen, communicate clearly and respond with care.</p><p>Today, his approach begins with understanding the person behind the move: the priorities, timing, concerns and possibilities that make every decision different.</p></div>
      <div className="about-profile-actions"><CTAButton to="/contact">Talk to Ruhan <ArrowRight size={16}/></CTAButton>{contact.bhsProfile&&<a className="btn btn-outline" href={contact.bhsProfile} target="_blank" rel="noreferrer">Official BHS profile <ArrowUpRight size={15}/></a>}</div>
      <div className="about-profile-contact"><a href={`tel:${contact.phone}`}><Phone size={17}/><span><small>Call Ruhan</small>{contact.phoneLabel}</span></a><a href={`mailto:${contact.email}`}><Mail size={17}/><span><small>Email</small>{contact.email}</span></a></div>
    </article>
  </div></section>

  <section className="section about-why"><div className="container"><SectionHeading eyebrow="Why Ruhan" title="A thoughtful advisor for every stage of the move." intro="The work is grounded in preparation, responsive communication and guidance that stays objective."/><div className="about-principles">{principles.map(([Icon,title,text],index)=><article key={title}><span>0{index+1}</span><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

  <section className="section about-work"><div className="container about-work-grid"><div><span className="eyebrow">How I work</span><h2 className="section-title">Listen first.<br/>Clarify the goal.<br/><em>Move with purpose.</em></h2></div><div className="about-work-steps"><article><strong>01</strong><div><h3>Understand the decision</h3><p>We begin with your goal, budget, timing and the practical details that shape a useful plan.</p></div></article><article><strong>02</strong><div><h3>Build the right strategy</h3><p>Searches, CMAs and recommendations use authorized information and objective context—not pressure or assumptions.</p></div></article><article><strong>03</strong><div><h3>Stay personally connected</h3><p>You receive responsive communication and a clear next step throughout the process.</p></div></article></div></div></section>

  <section className="about-bhs"><div className="container about-bhs-grid"><div><BHSLogo className="about-bhs-logo"/><span className="eyebrow">Established resources. Personal delivery.</span><h2>Personal Service.<br/>Backed by a Trusted Real Estate Brand.</h2><p>Ruhan provides the direct relationship. Brown Harris Stevens provides an established real-estate platform, marketing capabilities, technology and market resources.</p><p className="about-compliance">BHS name, history, trademarks and brand presentation remain subject to final broker approval.</p></div><div className="about-bhs-facts"><article><Building2/><strong>Brown Harris Stevens</strong><span>Privately held real-estate platform founded in 1873.</span></article><article><Handshake/><strong>One personal point of contact</strong><span>Ruhan remains focused on your goals and communication.</span></article></div></div></section>

  <section className="section about-personal"><div className="container about-personal-grid"><div><img src={editorialImages.interior} width="1600" height="1024" alt="Warm contemporary Miami residence interior" loading="lazy"/></div><article><span className="eyebrow">Beyond real estate</span><h2 className="section-title">Curiosity, hospitality and connection.</h2><p className="lead">Outside work, Ruhan enjoys cooking, horse riding and discovering the people, places and experiences that give South Florida its energy.</p><div className="about-personal-note"><ChefHat/><p>That same hospitality mindset carries into his work: be prepared, make people feel heard and treat the relationship with care.</p></div></article></div></section>

  <section className="section final-cta"><div className="container"><span className="eyebrow">Ruhan-Realty · Brown Harris Stevens</span><h2 className="section-title">Real estate is personal.<br/>The service should be, too.</h2><p className="lead">Start with a direct conversation about what you want your next move to accomplish.</p><CTAButton to="/contact" variant="gold">Start a conversation</CTAButton></div></section>
</>}
