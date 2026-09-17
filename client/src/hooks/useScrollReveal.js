import { useEffect, useRef } from 'react';

export function useScrollReveal(){
  const rootRef=useRef(null);
  useEffect(()=>{
    const root=rootRef.current;
    if(!root)return undefined;
    root.classList.add('reveal-ready');
    const elements=[...root.querySelectorAll('[data-reveal]')];
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){elements.forEach(element=>element.classList.add('is-visible'));return undefined}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -50px'});
    elements.forEach(element=>observer.observe(element));
    return()=>observer.disconnect();
  },[]);
  return rootRef;
}
