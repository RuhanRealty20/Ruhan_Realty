import { Mail, Phone } from 'lucide-react';
import { contact } from '../data/site';
import { track } from '../services/analytics';

const socialProfiles=[
  {key:'instagram',label:'Instagram',handle:'Miami real-estate updates',mark:'@'},
  {key:'facebook',label:'Facebook',handle:'Property and market content',mark:'f'},
  {key:'linkedin',label:'LinkedIn',handle:'Professional profile',mark:'in'},
];

export function SocialLinks({labels=false,className=''}){
  const profiles=socialProfiles.filter(({key})=>contact.social[key]);
  return <div className={`social-links ${labels?'social-links-labeled':''} ${className}`.trim()} aria-label="Social media profiles">
    {profiles.map(({key,label,handle,mark})=><a key={key} href={contact.social[key]} target="_blank" rel="noreferrer" aria-label={`${label}: ${handle}`} onClick={()=>track('social_click',{platform:key})}><b className="social-mark" aria-hidden="true">{mark}</b>{labels&&<span><strong>{label}</strong><small>{handle}</small></span>}</a>)}
  </div>;
}

export function SocialDirectory({showPending=false,className=''}){
  return <div className={`social-directory ${className}`.trim()}>
    {socialProfiles.map(({key,label,handle,mark})=>{
      const href=contact.social[key];
      if(!href&&!showPending)return null;
      const content=<><b className="social-directory-mark" aria-hidden="true">{mark}</b><span><small>Follow on</small><strong>{label}</strong><em>{handle}</em></span><span className="social-directory-arrow" aria-hidden="true">↗</span></>;
      return href?<a key={key} href={href} target="_blank" rel="noreferrer" onClick={()=>track('social_click',{platform:key})}>{content}</a>:<div key={key} className="social-profile-pending" aria-label={`${label} profile link pending approval`}>{content}<span className="pending-label">Link pending</span></div>;
    })}
  </div>;
}

export function ContactLinks({className=''}){
  return <div className={`contact-links ${className}`.trim()}>
    <a href={`tel:${contact.phone}`} onClick={()=>track('call_click')}><Phone size={17}/><span><small>Call or text</small>{contact.phoneLabel}</span></a>
    <a href={`mailto:${contact.email}`} onClick={()=>track('email_click')}><Mail size={17}/><span><small>Email</small>{contact.email}</span></a>
  </div>;
}
