import { MessageSquareText } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from './ui';

export function Assistant(){const [open,setOpen]=useState(false);return <><button className="btn btn-outline" onClick={()=>setOpen(true)}><MessageSquareText size={16}/> Ask the site guide</button><Modal open={open} onClose={()=>setOpen(false)} title="How can we point you in the right direction?"><p>This navigation assistant works without an AI provider and routes you to approved site content. It does not provide legal, tax, mortgage, contractual or individualized financial advice.</p><div className="choice-grid" style={{marginTop:'1rem'}}>{[['Find a property','/properties'],['Plan a sale','/sell'],['Compare Miami areas','/areas'],['Relocate to Miami','/relocate'],['Talk to Ruhan','/contact']].map(([label,to])=><Link className="choice" to={to} onClick={()=>setOpen(false)} key={to}>{label}</Link>)}</div></Modal></>}
