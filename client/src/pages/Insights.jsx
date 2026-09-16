import { ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { CTAButton, PageHero } from '../components/ui';

export default function Insights(){return <><SEO title="Miami Real Estate Insights" description="Reviewed Miami real estate insights, factual takeaways and source-attributed market context from Ruhan Syed."/><PageHero eyebrow="Reviewed. Sourced. Useful." title="News & insights." intro="Market reporting and practical guides with visible sources, publication dates and factual takeaways. Draft or AI-assisted content is never auto-published."/><section className="section"><div className="container"><div className="placeholder-panel"><h2 style={{fontFamily:'var(--font-display)',fontSize:'2.2rem'}}>Editorial system ready</h2><p>Published articles will appear here after human review. No fabricated news has been seeded.</p><CTAButton to="/market-today">Miami Market Today <ArrowRight size={15}/></CTAButton></div></div></section></>}
