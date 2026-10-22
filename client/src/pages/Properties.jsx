/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { ChevronLeft, ChevronRight, Info, Search, SlidersHorizontal } from 'lucide-react';
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
  const [filters,setFilters]=useState(()=>({status:params.get('status')||'',location:params.get('location')||'',minPrice:params.get('minPrice')||'',maxPrice:params.get('maxPrice')||'',beds:params.get('beds')||'',page:1,limit:12}));
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [notice,setNotice]=useState('');
  const [pagination,setPagination]=useState({page:1,pages:1,total:0});

  const search=async(event,nextFilters=filters)=>{
    event?.preventDefault();
    const requestFilters={...nextFilters,page:nextFilters.page||1};
    setFilters(requestFilters);
    setLoading(true);
    track('search',{...requestFilters});
    try{
      const query=new URLSearchParams(Object.entries(requestFilters).filter(([,value])=>value!==''&&value!==undefined));
      const result=await api.properties.list(query);
      setItems(result.items||[]);
      setPagination(result.pagination||{page:1,pages:1,total:result.total||0});
      setNotice(result.notice||(result.providerStatus==='unconfigured'?'Approved IDX feed pending connection. No listing data is fabricated or shown.':''));
    }catch(error){
      setItems([]);
      setPagination({page:1,pages:1,total:0});
      setNotice(error.message);
    }finally{
      setLoading(false);
    }
  };

  const selectStatus=(status)=>{
    const next={...filters,status,page:1};
    track('search_filter',{filter:status||'All listings'});
    search(null,next);
  };

  const goToPage=(page)=>{
    search(null,{...filters,page});
    window.scrollTo({top:560,behavior:'smooth'});
  };

  useEffect(()=>{search()},[]);

  return <>
    <SEO title="Miami Properties" description="Search approved Miami and South Florida MLS/IDX listings with personal guidance supported by Brown Harris Stevens." noindex/>
    <PageHero eyebrow="Miami property discovery" title="Search Miami properties." intro="A focused search experience built for an approved Miami REALTORS/MLS/IDX feed, with personal guidance supported by Brown Harris Stevens." image={editorialImages.beach}/>
    <section className="section-tight"><div className="container"><form className="card search-panel property-search-panel" onSubmit={(event)=>search(event,{...filters,page:1})}>
      <div className="field"><label htmlFor="location">City, area or ZIP code</label><input id="location" value={filters.location} onChange={event=>setFilters({...filters,location:event.target.value})} placeholder="Brickell, Miami Beach…"/></div>
      <div className="field"><label htmlFor="min">Minimum price</label><input id="min" inputMode="numeric" value={filters.minPrice} onChange={event=>setFilters({...filters,minPrice:event.target.value})}/></div>
      <div className="field"><label htmlFor="max">Maximum price</label><input id="max" inputMode="numeric" value={filters.maxPrice} onChange={event=>setFilters({...filters,maxPrice:event.target.value})}/></div>
      <div className="field"><label htmlFor="beds">Bedrooms</label><select id="beds" value={filters.beds} onChange={event=>setFilters({...filters,beds:event.target.value})}><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
      <button className="btn btn-primary" type="submit"><Search size={16}/>Search</button>
    </form><div className="filters" style={{marginTop:'1rem'}}><SlidersHorizontal size={18}/><button type="button" className={`choice ${!filters.status?'selected':''}`} style={{padding:'.55rem .8rem'}} onClick={()=>selectStatus('')}>All listings</button>{propertyFilters.map(filter=><button type="button" className={`choice ${filters.status===filter?'selected':''}`} style={{padding:'.55rem .8rem'}} key={filter} onClick={()=>selectStatus(filter)}>{filter}</button>)}</div>
    {notice&&items.length>0&&<div className="idx-notice" role="status"><Info size={18}/><span>{notice}</span></div>}
    <div style={{marginTop:'2rem'}}>{loading?<LoadingSkeleton lines={6}/>:items.length?<><div className="property-results-summary"><strong>{pagination.total.toLocaleString()} authorized listings</strong><span>Page {pagination.page} of {pagination.pages}</span></div><div className="property-grid">{items.map(property=><PropertyCard key={property.id} property={property}/>)}</div>{pagination.pages>1&&<nav className="property-pagination" aria-label="Property results pagination"><button type="button" className="btn btn-outline" disabled={pagination.page<=1} onClick={()=>goToPage(pagination.page-1)}><ChevronLeft size={16}/>Previous</button><span>Page <strong>{pagination.page}</strong> of {pagination.pages}</span><button type="button" className="btn btn-outline" disabled={pagination.page>=pagination.pages} onClick={()=>goToPage(pagination.page+1)}>Next<ChevronRight size={16}/></button></nav>}</>:<div className="placeholder-panel branded-placeholder"><span className="eyebrow">Brown Harris Stevens · Miami Beach</span><h2>{notice?.includes('pending connection')?'Listing feed ready to connect':'No listings found'}</h2><p>{notice||'No authorized listings matched this search.'}</p><p className="muted">Try broader filters. Credentials and unauthorized MLS images never belong in frontend code.</p></div>}</div></div></section>
  </>;
}
