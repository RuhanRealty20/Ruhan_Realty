import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/ui';
import { areas } from '../data/site';

export default function Areas(){return <><SEO title="Miami Area Guides" description="Objective guides to Miami and South Florida areas, housing types, access, amenities and authorized listings."/><PageHero eyebrow="Miami & South Florida" title="Area guides with useful context." intro="Explore housing mix, transportation, notable amenities and approved live inventory—without steering, demographic targeting or unsupported safety claims."/><section className="section"><div className="container area-grid">{areas.map((a,i)=><Link className="area-card" to={`/areas/${a.slug}`} key={a.slug} style={{background:`linear-gradient(${120+i*8}deg,#102431,#${i%3===0?'7a5b3a':'315f6f'})`}}><div><span className="eyebrow" style={{color:'#e5c995'}}>Miami guide</span><h3>{a.name}</h3><p>{a.summary}</p><ArrowRight/></div></Link>)}</div></section></>}
