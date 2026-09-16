import { AlertCircle, DatabaseZap } from 'lucide-react';
import { MarketSnapshot } from '../components/MarketSnapshot';
import { SEO } from '../components/SEO';
import { CTAButton, PageHero, SectionHeading } from '../components/ui';
import { editorialImages, marketPlaceholders } from '../data/site';

export default function Market(){return <>
  <SEO title="Miami Market Today" description="A sourced Ruhan-Realty market dashboard with geography, reporting period and update dates for every statistic."/>
  <PageHero eyebrow="Sourced market context" title="Miami Market Today." intro="A clearer view of active inventory, prices, supply, days on market, mortgage rates and rental trends. Monthly data is always labeled monthly." image={editorialImages.brickell}/>
  <section className="section dark-section"><div className="container"><MarketSnapshot/><div className="card" style={{marginTop:'1rem',padding:'1rem',background:'rgba(255,255,255,.06)',borderColor:'rgba(255,255,255,.16)'}}><AlertCircle size={18} style={{display:'inline',marginRight:'.5rem'}}/> Live sources are not configured. Ruhan-Realty will show the last successful update when a provider fails, never an invented value.</div></div></section>
  <section className="section"><div className="container"><SectionHeading eyebrow="Data with discipline" title="Every number carries its context." intro="Brown Harris Stevens resources and approved external sources can be connected without sacrificing transparency."/><div className="area-grid">{marketPlaceholders.map(([label])=><article className="card elevated-card" key={label}><DatabaseZap color="#a8814a"/><h3>{label}</h3><p className="muted">Value · source · geography · reporting period · last updated · freshness status</p></article>)}</div><div style={{textAlign:'center',marginTop:'3rem'}}><p>Want to understand what current conditions could mean for your plans?</p><CTAButton to="/contact">Talk to Ruhan</CTAButton></div></div></section>
</>}
