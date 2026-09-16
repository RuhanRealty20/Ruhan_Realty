import { SEO } from '../components/SEO';
import { CTAButton, PageHero } from '../components/ui';
export default function NotFound(){return <><SEO title="Page not found" description="The requested page could not be found." noindex/><PageHero eyebrow="404" title="This page moved—or never existed." intro="Let’s get you back to useful Miami real-estate information."><div className="button-row"><CTAButton to="/" variant="light">Return home</CTAButton><CTAButton to="/properties" variant="outline">Search properties</CTAButton></div></PageHero></>}
