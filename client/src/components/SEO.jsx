import { useEffect } from 'react';

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://ruhanrealty.com';
export function SEO({ title, description, image='/og-default.jpg', type='website', noindex=false, schema }) {
  useEffect(() => {
    document.title = `${title} | Ruhan Syed · Miami Real Estate`;
    const url = `${siteUrl}${window.location.pathname}`;
    const values = { description, 'og:title':title, 'og:description':description, 'og:url':url, 'og:type':type, 'og:image':image.startsWith('http')?image:`${siteUrl}${image}`, 'twitter:card':'summary_large_image', 'twitter:title':title, 'twitter:description':description, robots:noindex?'noindex,nofollow':'index,follow' };
    Object.entries(values).forEach(([name,content]) => { const attr=name.startsWith('og:')?'property':'name'; let element=document.head.querySelector(`meta[${attr}="${name}"]`); if(!element){element=document.createElement('meta');element.setAttribute(attr,name);document.head.append(element);} element.content=content; });
    let canonical=document.head.querySelector('link[rel="canonical"]'); if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);} canonical.href=url;
    const id='page-schema'; document.getElementById(id)?.remove(); if(schema){const script=document.createElement('script');script.id=id;script.type='application/ld+json';script.text=JSON.stringify(schema);document.head.append(script);}
    return () => document.getElementById(id)?.remove();
  }, [title,description,image,type,noindex,schema]);
  return null;
}
