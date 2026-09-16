/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { SEO } from '../components/SEO';
import { LoadingSkeleton, PageHero } from '../components/ui';
import { editorialImages, propertyFilters } from '../data/site';
import { api } from '../services/api';
import { track } from '../services/analytics';

export default function Properties(){
  const [filters,setFilters]=useState({status:'For Sale',location:'',minPrice:'',maxPrice:''});
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [notice,setNotice]=useState('');
  const search=async(e)=>{e?.preventDefault();setLoading(true);track('search',{...filters});try{const result=await api.properties.list(new URLSearchParams(filters));setItems(result.items||[]);setNotice(result.providerStatus==='unconfigured'?'Approved IDX feed pending connection. No listing data is fabricated or shown.':'')}catch(err){setItems([]);setNotice(err.message)}finally{setLoading(false)}};
  useEffect(()=>{search()},[]);
  return <>
    <SEO title="Miami Properties" description="Search approved Miami and South Florida MLS/IDX listings with Ruhan-Realty, Ruhan Syed and Brown Harris Stevens." noindex/>
    <PageHero eyebrow="Ruhan-Realty property discovery" title="Search Miami properties." intro="A focused search experience built for an approved Miami REALTORS/MLS/IDX feed, with Ruhan Syed and Brown Harris Stevens ready when you want personal guidance." image={editorialImages.beach}/>
    <section className="section-tight"><div className="container"><form className="card search-panel" onSubmit={search}><div className="field"><label htmlFor="location">City, area or address</label><input id="location" value={filters.location} onChange={e=>setFilters({...filters,location:e.target.value})} placeholder="Brickell, Miami Beach…"/></div><div className="field"><label htmlFor="min">Minimum price</label><input id="min" inputMode="numeric" value={filters.minPrice} onChange={e=>setFilters({...filters,minPrice:e.target.value})}/></div><div className="field"><label htmlFor="max">Maximum price</label><input id="max" inputMode="numeric" value={filters.maxPrice} onChange={e=>setFilters({...filters,maxPrice:e.target.value})}/></div><button className="btn btn-primary" type="submit"><Search size={16}/> Search</button></form><div className="filters" style={{marginTop:'1rem'}}><SlidersHorizontal size={18}/>{propertyFilters.map(f=><button className={`choice ${filters.status===f?'selected':''}`} style={{padding:'.55rem .8rem'}} key={f} onClick={()=>{setFilters({...filters,status:f});track('search_filter',{filter:f})}}>{f}</button>)}</div><div style={{marginTop:'2rem'}}>{loading?<LoadingSkeleton lines={6}/>:items.length?<div className="property-grid">{items.map(p=><PropertyCard key={p.id} property={p}/>)}</div>:<div className="placeholder-panel branded-placeholder"><span className="eyebrow">Ruhan-Realty · Brown Harris Stevens</span><h2>Listing feed ready to connect</h2><p>{notice||'No authorized listings matched this search.'}</p><p className="muted">Configure the approved provider in the server environment. Credentials and unauthorized MLS images never belong in frontend code.</p></div>}</div></div></section>
  </>;
}
