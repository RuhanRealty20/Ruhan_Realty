import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CTAButton, PageHero } from '../components/ui';
import { editorialImages } from '../data/site';
export default function InsightDetail(){const {slug}=useParams();return <><SEO title="Insight not published" description="This insight is not currently available." noindex/><PageHero eyebrow="Ruhan-Realty insights" title="This article is not published." intro={`No reviewed content exists for “${slug}”. Draft and AI-assisted content stays private until approved.`} image={editorialImages.brickell}/><section className="section"><div className="container"><CTAButton to="/insights">Back to insights</CTAButton></div></section></>}
