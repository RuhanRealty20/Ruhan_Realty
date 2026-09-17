import { ArrowUpRight, Bot, Building2, ChevronRight, LoaderCircle, MessageSquareText, RefreshCw, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { track } from '../services/analytics';

const storageKey='rr_assistant_session_v1';
const welcome={role:'assistant',text:'Welcome to Ruhan-Realty. I can answer questions about the website, help clarify your Miami real-estate needs, and search authorized listings when the approved property feed is connected. What would you like to do?'};
const firstReplies=['Buy a home','Rent a property','Sell my property','Relocate to Miami'];

function restore(){
  try{const value=JSON.parse(sessionStorage.getItem(storageKey));return value&&Array.isArray(value.messages)?value:null}catch{return null}
}

export function AssistantTrigger({className='btn btn-outline',children}){
  return <button type="button" className={className} onClick={()=>window.dispatchEvent(new Event('open-ruhan-assistant'))}><MessageSquareText size={16}/>{children||'Ask Ruhan AI'}</button>;
}

function PropertyResult({property,onNavigate}){
  return <Link className="assistant-property" to={property.url} onClick={()=>{track('assistant_property_click',{propertyId:property.id});onNavigate()}}>
    {property.image?<img src={property.image} alt={property.imageAlt||''} width="104" height="82" loading="lazy"/>:<span className="assistant-property-placeholder"><Building2 size={22}/></span>}
    <span><strong>{property.price||property.title}</strong><small>{property.price?property.title:property.location}</small>{property.price&&<em>{property.beds??'—'} beds · {property.baths??'—'} baths · {property.type||'Property'}</em>}</span><ChevronRight size={16}/>
  </Link>;
}

export function Assistant(){
  const saved=restore();
  const [open,setOpen]=useState(false);const [messages,setMessages]=useState(saved?.messages||[welcome]);const [profile,setProfile]=useState(saved?.profile||{});const [quickReplies,setQuickReplies]=useState(saved?.quickReplies||firstReplies);const [suggestedPath,setSuggestedPath]=useState(saved?.suggestedPath||'/contact');const [input,setInput]=useState('');const [loading,setLoading]=useState(false);const [error,setError]=useState('');
  const location=useLocation();const navigate=useNavigate();const inputRef=useRef(null);const logRef=useRef(null);const titleId=useId();

  useEffect(()=>{const show=()=>{setOpen(true);track('assistant_open')};window.addEventListener('open-ruhan-assistant',show);return()=>window.removeEventListener('open-ruhan-assistant',show)},[]);
  useEffect(()=>{sessionStorage.setItem(storageKey,JSON.stringify({messages:messages.slice(-20),profile,quickReplies,suggestedPath}))},[messages,profile,quickReplies,suggestedPath]);
  useEffect(()=>{if(!open)return;inputRef.current?.focus();const closeOnEscape=(event)=>{if(event.key==='Escape')setOpen(false)};window.addEventListener('keydown',closeOnEscape);return()=>window.removeEventListener('keydown',closeOnEscape)},[open]);
  useEffect(()=>{if(open)logRef.current?.scrollTo({top:logRef.current.scrollHeight,behavior:'smooth'})},[messages,loading,open]);

  const close=()=>setOpen(false);
  const saveHandoff=()=>sessionStorage.setItem('rr_assistant_handoff',JSON.stringify({profile}));
  const reset=()=>{setMessages([welcome]);setProfile({});setQuickReplies(firstReplies);setSuggestedPath('/contact');setError('');sessionStorage.removeItem(storageKey);track('assistant_reset')};
  const send=async(value)=>{
    const text=(value??input).trim();if(!text||loading)return;
    const history=messages.slice(-12).map(message=>({role:message.role,text:message.text}));
    setMessages(current=>[...current,{role:'user',text}]);setInput('');setLoading(true);setError('');setQuickReplies([]);track('assistant_message',{hasProfile:Object.keys(profile).length>0});
    try{
      const response=await api.assistant.chat({message:text,history,profile,page:location.pathname});
      setMessages(current=>[...current,{role:'assistant',text:response.reply,properties:response.properties||[],disclaimer:response.disclaimer}]);setProfile(response.profile||{});setQuickReplies(response.quickReplies||[]);setSuggestedPath(response.suggestedPath||'/contact');
    }catch(err){setError(err.message);setMessages(current=>[...current,{role:'assistant',text:'I could not reach the assistant service just now. You can still contact Ruhan directly or use the website links below.'}]);setQuickReplies(['Try again','Talk to Ruhan'])}
    finally{setLoading(false)}
  };

  const handleQuickReply=(reply)=>{
    if(reply==='Talk to Ruhan'||reply==='Open contact page'){saveHandoff();track('assistant_handoff',{destination:'/contact'});close();navigate('/contact');return}
    if(reply==='WhatsApp Ruhan'){window.open('https://wa.me/14078402959','_blank','noopener,noreferrer');track('assistant_handoff',{channel:'whatsapp'});return}
    if(reply==='Try again'){setError('');return}
    send(reply);
  };

  return <>
    <button type="button" className={`assistant-launcher ${open?'is-open':''}`} aria-label="Open Ruhan-Realty AI assistant" aria-expanded={open} onClick={()=>{setOpen(true);track('assistant_open')}}><span className="assistant-launcher-icon"><Sparkles size={19}/></span><span><strong>Ask Ruhan AI</strong><small>Miami property guide</small></span></button>
    {open&&<aside className="assistant-panel" role="dialog" aria-modal="false" aria-labelledby={titleId}>
      <header className="assistant-header"><span className="assistant-avatar"><Bot size={21}/></span><span><strong id={titleId}>Ruhan-Realty Assistant</strong><small><i/>AI guide · Brown Harris Stevens support</small></span><button type="button" onClick={reset} aria-label="Start a new conversation" title="New conversation"><RefreshCw size={17}/></button><button type="button" onClick={close} aria-label="Close assistant"><X size={20}/></button></header>
      {Object.keys(profile).length>0&&<div className="assistant-profile" aria-label="Your search preferences">{Object.entries(profile).filter(([,value])=>value!==''&&value!==undefined).slice(0,5).map(([key,value])=><span key={key}>{key.replace(/([A-Z])/g,' $1')}: <b>{typeof value==='number'&&['minPrice','maxPrice'].includes(key)?`$${value.toLocaleString()}`:value}</b></span>)}</div>}
      <div className="assistant-log" ref={logRef} aria-live="polite" aria-busy={loading}>
        {messages.map((message,index)=><div className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}><span className="assistant-message-label">{message.role==='assistant'?'Ruhan AI':'You'}</span><p>{message.text}</p>{message.properties?.length>0&&<div className="assistant-properties">{message.properties.map(property=><PropertyResult key={property.id} property={property} onNavigate={close}/>)}</div>}{message.disclaimer&&index===messages.length-1&&<small className="assistant-disclaimer"><ShieldCheck size={12}/>{message.disclaimer}</small>}</div>)}
        {loading&&<div className="assistant-message assistant typing"><span className="assistant-message-label">Ruhan AI</span><p><i/><i/><i/><span className="sr-only">Preparing an answer</span></p></div>}
      </div>
      <div className="assistant-actions">{quickReplies.map(reply=><button type="button" key={reply} onClick={()=>handleQuickReply(reply)}>{reply}</button>)}</div>
      {error&&<p className="assistant-error" role="alert">{error}</p>}
      <form className="assistant-compose" onSubmit={event=>{event.preventDefault();send()}}><label className="sr-only" htmlFor={`${titleId}-input`}>Ask about Miami real estate</label><textarea id={`${titleId}-input`} ref={inputRef} rows="1" maxLength="1500" value={input} onChange={event=>setInput(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send()}}} placeholder="Ask about areas, budget, property type…"/><button type="submit" disabled={!input.trim()||loading} aria-label="Send message">{loading?<LoaderCircle className="assistant-spin" size={18}/>:<Send size={18}/>}</button></form>
      <footer className="assistant-footer"><span>AI guidance, verified listings only</span><Link to={suggestedPath} onClick={()=>{saveHandoff();track('assistant_handoff',{destination:suggestedPath});close()}}>Continue with Ruhan <ArrowUpRight size={13}/></Link></footer>
    </aside>}
  </>;
}
