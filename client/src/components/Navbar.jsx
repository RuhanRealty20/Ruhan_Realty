import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../data/site';

export function Navbar() {
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const location=useLocation();
  const solid=location.pathname!=='/';
  useEffect(()=>{const onScroll=()=>setScrolled(scrollY>24);onScroll();addEventListener('scroll',onScroll,{passive:true});return()=>removeEventListener('scroll',onScroll)},[]);
  return <header className={`nav-shell ${solid?'solid':''} ${scrolled?'scrolled':''}`}>
    <div className="container navbar">
      <Link className="brand" to="/" aria-label="Ruhan-Realty home"><strong>RUHAN-REALTY</strong><span>Ruhan Syed · Brown Harris Stevens</span></Link>
      <nav aria-label="Main navigation" className="nav-links">{navItems.map(([label,to])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</nav>
      <span className="nav-broker">Brown Harris Stevens<br/><small>Miami Beach</small></span>
      <button className="menu-button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
    </div>
    {open&&<nav aria-label="Mobile navigation" className="mobile-menu"><p>Ruhan Syed · Brown Harris Stevens</p>{navItems.map(([label,to])=><Link key={to} to={to} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>}
  </header>;
}
