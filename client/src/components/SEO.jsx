import { useEffect } from 'react';

const siteUrl=(import.meta.env.VITE_SITE_URL||'https://ruhanrealty.com').replace(/\/$/,'');
const siteName='Ruhan-Realty | Ruhan Syed · Miami Real Estate';

function setMeta(name,content,property=false){
  if(content===undefined||content===null||content==='')return;
  const attribute=property?'property':'name'; let element=document.head.querySelector(`meta[${attribute}="${name}"]`);
  if(!element){element=document.createElement('meta');element.setAttribute(attribute,name);document.head.append(element)}
  element.setAttribute('content',String(content));
}

function setLink(rel,href,hreflang){
  const selector=hreflang?`link[rel="${rel}"][hreflang="${hreflang}"]`:`link[rel="${rel}"]:not([hreflang])`; let element=document.head.querySelector(selector);
  if(!element){element=document.createElement('link');element.rel=rel;if(hreflang)element.hreflang=hreflang;document.head.append(element)}
  element.href=href;
}

export function SEO({title,description,image='/og-default.jpg',imageAlt,titleTemplate=true,type='website',noindex=false,schema,publishedTime,modifiedTime}){
  useEffect(()=>{
    const pageTitle=titleTemplate?`${title} | Ruhan-Realty · Brown Harris Stevens`:title;
    const canonicalPath=window.location.pathname==='/'?'/':window.location.pathname.replace(/\/$/,'');
    const url=`${siteUrl}${canonicalPath}`; const absoluteImage=image.startsWith('http')?image:`${siteUrl}${image.startsWith('/')?'':'/'}${image}`;
    document.title=pageTitle; document.documentElement.lang='en';
    setMeta('description',description); setMeta('robots',noindex?'noindex,nofollow':'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    setMeta('googlebot',noindex?'noindex,nofollow':'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    setMeta('geo.region','US-FL'); setMeta('geo.placename','Miami'); setMeta('theme-color','#0d2d3b');
    setMeta('og:title',pageTitle,true); setMeta('og:description',description,true); setMeta('og:url',url,true); setMeta('og:type',type,true); setMeta('og:site_name',siteName,true); setMeta('og:locale','en_US',true); setMeta('og:image',absoluteImage,true); setMeta('og:image:alt',imageAlt||title,true);
    setMeta('twitter:card','summary_large_image'); setMeta('twitter:title',pageTitle); setMeta('twitter:description',description); setMeta('twitter:image',absoluteImage); setMeta('twitter:image:alt',imageAlt||title);
    if(publishedTime)setMeta('article:published_time',publishedTime,true); if(modifiedTime)setMeta('article:modified_time',modifiedTime,true);
    setLink('canonical',url); setLink('alternate',url,'en'); setLink('alternate',url,'x-default');
    const supplied=schema?.['@graph']||(schema?[schema]:[]);
    const graph=[
      {'@type':'WebPage','@id':`${url}#webpage`,url,name:pageTitle,description,isPartOf:{'@id':`${siteUrl}/#website`},about:{'@id':`${siteUrl}/#ruhan-syed`},primaryImageOfPage:{'@type':'ImageObject',url:absoluteImage},inLanguage:'en-US'},
      {'@type':'WebSite','@id':`${siteUrl}/#website`,url:`${siteUrl}/`,name:siteName,inLanguage:'en-US'},
      {'@type':'Person','@id':`${siteUrl}/#ruhan-syed`,name:'Ruhan Syed',jobTitle:'Realtor Associate',url:`${siteUrl}/about`,worksFor:{'@type':'Organization',name:'Brown Harris Stevens'}},
      ...supplied.map(item=>{const copy={...item};delete copy['@context'];return copy}),
    ];
    const id='page-schema';document.getElementById(id)?.remove();const script=document.createElement('script');script.id=id;script.type='application/ld+json';script.text=JSON.stringify({'@context':'https://schema.org','@graph':graph});document.head.append(script);
    return()=>document.getElementById(id)?.remove();
  },[title,description,image,imageAlt,titleTemplate,type,noindex,schema,publishedTime,modifiedTime]);
  return null;
}
