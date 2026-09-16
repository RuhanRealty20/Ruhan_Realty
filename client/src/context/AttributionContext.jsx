/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';

const AttributionContext = createContext({});
const keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];

function captureAttribution(){
  let saved={};
  try { saved=JSON.parse(localStorage.getItem('rr_attribution')) || {}; } catch { /* storage may be unavailable */ }
  const query=new URLSearchParams(window.location.search);
  const captured=Object.fromEntries(keys.map(key=>[key,query.get(key)]).filter(([,value])=>value));
  if(!Object.keys(captured).length)return saved;
  const next={...saved,...captured,landingPage:saved.landingPage||window.location.href,referrer:saved.referrer||document.referrer,capturedAt:saved.capturedAt||new Date().toISOString()};
  try { localStorage.setItem('rr_attribution',JSON.stringify(next)); } catch { /* attribution remains in memory */ }
  return next;
}

export function AttributionProvider({ children }) {
  const [attribution]=useState(captureAttribution);
  const value=useMemo(()=>({attribution}),[attribution]);
  return <AttributionContext value={value}>{children}</AttributionContext>;
}

export const useAttribution=()=>useContext(AttributionContext);
