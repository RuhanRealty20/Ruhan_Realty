import { MessageCircle, Phone, Search, UserRound } from 'lucide-react';
import { ViewTransition } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { contact } from '../data/site';
import { track } from '../services/analytics';

export function PublicLayout(){const wa=contact.whatsapp?`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`:'/contact';const phone=contact.phone?`tel:${contact.phone}`:'/contact';return <><Navbar/><main id="main-content"><ViewTransition name="page-content" default="page-transition"><Outlet/></ViewTransition></main><Footer/><a className="floating-wa" href={wa} aria-label="WhatsApp Ruhan" onClick={()=>track('WhatsApp_click')}><MessageCircle/></a><nav className="mobile-actions" aria-label="Quick actions"><Link to="/properties"><Search size={20}/>Search</Link><a href={phone} onClick={()=>track('call_click')}><Phone size={20}/>Call</a><a href={wa} onClick={()=>track('WhatsApp_click')}><MessageCircle size={20}/>WhatsApp</a><Link to="/contact"><UserRound size={20}/>Talk</Link></nav></>}
