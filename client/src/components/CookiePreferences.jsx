import { Cookie, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const storageKey='rr_cookie_preferences';
const analyticsId=import.meta.env.VITE_GA4_ID;

function readPreference(){try{return localStorage.getItem(storageKey)||'undecided'}catch{return 'undecided'}}

function enableAnalytics(){
  if(!analyticsId||document.getElementById('rr-ga4'))return;
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments)}
  gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('js',new Date());
  gtag('config',analyticsId,{anonymize_ip:true,allow_google_signals:false});
  const script=document.createElement('script');script.id='rr-ga4';script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;document.head.append(script);
}

export function CookiePreferences(){
  const [preference,setPreference]=useState(readPreference);
  useEffect(()=>{if(preference==='analytics')enableAnalytics();const reopen=()=>setPreference('undecided');window.addEventListener('open-cookie-preferences',reopen);return()=>window.removeEventListener('open-cookie-preferences',reopen)},[preference]);
  if(!analyticsId||preference!=='undecided')return null;
  const choose=value=>{try{localStorage.setItem(storageKey,value)}catch{/* preference remains in memory */}setPreference(value)};
  return <section className="cookie-banner" role="dialog" aria-label="Cookie and analytics preferences" aria-live="polite"><div className="cookie-banner-icon"><Cookie/></div><div><strong>Your privacy choices</strong><p>The public website works without analytics cookies. With permission, anonymous usage analytics helps improve property search and lead forms. Advertising storage remains disabled.</p><Link to="/cookies">Review cookie information</Link></div><div className="cookie-banner-actions"><button className="btn btn-outline" type="button" onClick={()=>choose('necessary')}><ShieldCheck size={15}/>Necessary only</button><button className="btn btn-gold" type="button" onClick={()=>choose('analytics')}>Allow analytics</button></div></section>;
}

