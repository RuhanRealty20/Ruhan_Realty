import { PageHero } from '../components/ui';
import { SEO } from '../components/SEO';
import { editorialImages } from '../data/site';
import { openCookiePreferences } from '../services/cookiePreferences';

const titles={privacy:'Privacy Policy',terms:'Terms of Use',cookies:'Cookie & Analytics Preferences'};

export default function Legal({type}){
  const title=titles[type];
  return <><SEO title={title} description={`${title} for RuhanRealty.com.`} noindex/><PageHero eyebrow="Legal & preferences" title={title} intro="Configurable placeholder content pending legal and broker review." image={editorialImages.grove}/><section className="section"><article className="container legal-layout"><img src={editorialImages.interior} alt="Miami waterfront interior editorial" loading="lazy"/><div><h2>Review required before launch</h2><p>This page intentionally does not fabricate approved legal language. Counsel and broker compliance should provide or approve final text covering data collection, retention, service providers, user rights, consent, analytics and applicable law.</p><h2>Current implementation</h2><p>The site captures inquiry information, first-touch attribution and limited device context when a visitor submits a form. Optional analytics IDs and providers are disabled until configured. Authentication refresh tokens use secure cookie settings in production.</p><p>Analytics is opt-in and advertising storage remains disabled. Visitors can revisit their choice at any time.</p>{type==='cookies'&&<button className="btn btn-primary" type="button" onClick={openCookiePreferences}>Open cookie preferences</button>}</div></article></section></>;
}
