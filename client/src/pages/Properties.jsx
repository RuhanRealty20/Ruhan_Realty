/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { SEO } from '../components/SEO';
import { LoadingSkeleton, PageHero } from '../components/ui';
import { editorialImages, propertyFilters } from '../data/site';
import { api } from '../services/api';
import { track } from '../services/analytics';

export default function Properties(){
  const [params]=useSearchParams();
  const [filters,setFilters]=useState(()=>({status:params.get('status')||'For Sale',location:params.get('location')||'',minPrice:params.get('minPrice')||'',maxPrice:params.get('maxPrice')||'',beds:params.get('beds')||''}));
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [notice,setNotice]=useState('');
  const search=async(event)=>{event?.preventDefault();setLoading(true);track('search',{...filters});try{const result=await api.properties.list(new URLSearchParams(filters));setItems(result.items||[]);setNotice(result.providerStatus==='unconfigured'?'Approved IDX feed pending connection. No listing data is fabricated or shown.':'')}catch(error){setItems([]);setNotice(error.message)}finally{setLoading(false)}};
  useEffect(()=>{search()},[]);
  return <>
    <SEO title="Miami Properties" description="Search approved Miami and South Florida MLS/IDX listings with Ruhan Syed and Brown Harris Stevens." noindex/>
    <PageHero eyebrow="Ruhan Syed · Property discovery" title="Search Miami properties." intro="A focused search experience built for an approved Miami REALTORS/MLS/IDX feed, with personal guidance from Ruhan Syed at Brown Harris Stevens." image={editorialImages.beach}/>
    <section className="section-tight"><div className="container"><form className="card search-panel property-search-panel" onSubmit={search}>
      <div className="field"><label htmlFor="location">City, area or address</label><input id="location" value={filters.location} onChange={event=>setFilters({...filters,location:event.target.value})} placeholder="Brickell, Miami Beach…"/></div>
      <div className="field"><label htmlFor="min">Minimum price</label><input id="min" inputMode="numeric" value={filters.minPrice} onChange={event=>setFilters({...filters,minPrice:event.target.value})}/></div>
      <div className="field"><label htmlFor="max">Maximum price</label><input id="max" inputMode="numeric" value={filters.maxPrice} onChange={event=>setFilters({...filters,maxPrice:event.target.value})}/></div>
      <div className="field"><label htmlFor="beds">Bedrooms</label><select id="beds" value={filters.beds} onChange={event=>setFilters({...filters,beds:event.target.value})}><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
      <button className="btn btn-primary" type="submit"><Search size={16}/>Search</button>
    </form><div className="filters" style={{marginTop:'1rem'}}><SlidersHorizontal size={18}/>{propertyFilters.map(filter=><button className={`choice ${filters.status===filter?'selected':''}`} style={{padding:'.55rem .8rem'}} key={filter} onClick={()=>{setFilters({...filters,status:filter});track('search_filter',{filter})}}>{filter}</button>)}</div>
    <div style={{marginTop:'2rem'}}>{loading?<LoadingSkeleton lines={6}/>:items.length?<div className="property-grid">{items.map(property=><PropertyCard key={property.id} property={property}/>)}</div>:<div className="placeholder-panel branded-placeholder"><span className="eyebrow">Ruhan Syed · Brown Harris Stevens</span><h2>Listing feed ready to connect</h2><p>{notice||'No authorized listings matched this search.'}</p><p className="muted">Configure the approved provider in the server environment. Credentials and unauthorized MLS images never belong in frontend code.</p></div>}</div></div></section>
  </>;
}
