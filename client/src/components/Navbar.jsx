import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../data/site';

export function Navbar() {
  const [open,setOpen] = useState(false); const [scrolled,setScrolled] = useState(false); const location=useLocation(); const solid=location.pathname!=='/';
  useEffect(()=>{const onScroll=()=>setScrolled(scrollY>24);onScroll();addEventListener('scroll',onScroll,{passive:true});return()=>removeEventListener('scroll',onScroll)},[]);
  return <header className={`nav-shell ${solid?'solid':''} ${scrolled?'scrolled':''}`}><div className="container navbar"><Link className="brand" to="/" aria-label="Ruhan Syed home"><strong>RUHAN SYED</strong><span>Miami Real Estate · Brown Harris Stevens</span></Link><nav aria-label="Main navigation" className="nav-links">{navItems.map(([label,to])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</nav><button className="menu-button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button></div>{open&&<nav aria-label="Mobile navigation" style={{background:'#fbfaf7',color:'#0b1721',padding:'1rem 1rem 2rem',display:'grid',gap:'.2rem',boxShadow:'0 15px 30px rgba(0,0,0,.14)'}}>{navItems.map(([label,to])=><Link key={to} to={to} style={{padding:'.7rem',borderBottom:'1px solid #e2ded6'}}>{label}</Link>)}</nav>}</header>;
}
