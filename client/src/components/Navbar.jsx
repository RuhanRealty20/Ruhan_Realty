import { ArrowUpRight, Mail, Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { contact, navItems } from '../data/site';
import { ContactLinks, SocialLinks } from './ContactLinks';
import { BHSLogo } from './BHSLogo';

export function Navbar(){
  const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false); const location=useLocation(); const solid=location.pathname!=='/';
  useEffect(()=>{const onScroll=()=>setScrolled(scrollY>24);onScroll();addEventListener('scroll',onScroll,{passive:true});return()=>removeEventListener('scroll',onScroll)},[]);
  return <header className={`nav-shell ${solid?'solid':''} ${scrolled?'scrolled':''}`}>
    <div className="nav-utility"><div className="container nav-utility-inner"><span>Ruhan Syed · Realtor Associate · Brown Harris Stevens</span><div className="nav-utility-actions"><a href={`tel:${contact.phone}`}><Phone size={13}/>{contact.phoneLabel}</a><a href={`mailto:${contact.email}`}><Mail size={13}/>{contact.email}</a><SocialLinks/></div></div></div>
    <div className="container navbar"><div className="nav-brand-lockup"><Link className="brand" to="/" aria-label="Ruhan Syed Miami real estate home"><strong>RUHAN SYED</strong><span>Miami Real Estate</span></Link><BHSLogo/></div><nav aria-label="Main navigation" className="nav-links">{navItems.map(([label,to])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</nav><Link className="nav-cta" to="/contact">Talk to Ruhan <ArrowUpRight size={14}/></Link><button className="menu-button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button></div>
    {open&&<nav aria-label="Mobile navigation" className="mobile-menu"><p>Ruhan Syed · Realtor Associate · Brown Harris Stevens</p>{navItems.map(([label,to])=><Link key={to} to={to} onClick={()=>setOpen(false)}>{label}</Link>)}<Link className="mobile-menu-cta" to="/contact" onClick={()=>setOpen(false)}>Talk to Ruhan <ArrowUpRight size={16}/></Link><ContactLinks className="mobile-menu-contact"/><SocialLinks labels className="mobile-menu-social"/></nav>}
  </header>;
}
