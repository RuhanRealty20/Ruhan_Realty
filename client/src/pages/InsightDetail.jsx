import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CTAButton, PageHero } from '../components/ui';
export default function InsightDetail(){const {slug}=useParams();return <><SEO title="Insight not published" description="This insight is not currently available." noindex/><PageHero eyebrow="Insights" title="This article is not published." intro={`No reviewed content exists for “${slug}”. Draft and AI-assisted content stays private until approved.`}/><section className="section"><div className="container"><CTAButton to="/insights">Back to insights</CTAButton></div></section></>}
