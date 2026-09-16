import { Mail, Phone } from 'lucide-react';
import { contact } from '../data/site';
import { track } from '../services/analytics';

const socialProfiles=[
  {key:'instagram',label:'Instagram',handle:'@ruhan_realty',mark:'@'},
  {key:'facebook',label:'Facebook',handle:'Ruhan Realty',mark:'f'},
  {key:'linkedin',label:'LinkedIn',handle:'Ruhan Syed',mark:'in'},
];

export function SocialLinks({labels=false,className=''}){
  const profiles=socialProfiles.filter(({key})=>contact.social[key]);
  return <div className={`social-links ${labels?'social-links-labeled':''} ${className}`.trim()} aria-label="Ruhan Realty social profiles">
    {profiles.map(({key,label,handle,mark})=><a key={key} href={contact.social[key]} target="_blank" rel="noreferrer" aria-label={`${label}: ${handle}`} onClick={()=>track('social_click',{platform:key})}><b className="social-mark" aria-hidden="true">{mark}</b>{labels&&<span><strong>{label}</strong><small>{handle}</small></span>}</a>)}
  </div>;
}

export function ContactLinks({className=''}){
  return <div className={`contact-links ${className}`.trim()}>
    <a href={`tel:${contact.phone}`} onClick={()=>track('call_click')}><Phone size={17}/><span><small>Call or text</small>{contact.phoneLabel}</span></a>
    <a href={`mailto:${contact.email}`} onClick={()=>track('email_click')}><Mail size={17}/><span><small>Email</small>{contact.email}</span></a>
  </div>;
}
