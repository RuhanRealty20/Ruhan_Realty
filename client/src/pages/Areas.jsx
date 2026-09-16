import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/ui';
import { areas } from '../data/site';

export default function Areas(){return <>
  <SEO title="Miami Area Guides" description="Objective Ruhan-Realty guides to Miami and South Florida areas, housing types, access, amenities and authorized listings."/>
  <PageHero eyebrow="Ruhan-Realty area collection" title="Find the Miami that feels like yours." intro="Explore housing mix, transportation, notable amenities and approved live inventory—without steering, demographic targeting or unsupported safety claims." image={areas[0].image}/>
  <section className="section"><div className="container area-grid">{areas.map(a=><Link className="area-card" to={`/areas/${a.slug}`} key={a.slug}><img src={a.image} alt={`${a.name} editorial area view`} width="800" height="600" loading="lazy"/><div><span className="eyebrow">Miami guide</span><h3>{a.name}</h3><p>{a.summary}</p><span className="area-link">Discover the area <ArrowRight size={15}/></span></div></Link>)}</div></section>
</>}
