import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '../services/analytics';

export function usePageTracking() {
  const location = useLocation();
  useEffect(() => { track('page_view', { title:document.title }); window.scrollTo({ top:0, behavior:'instant' }); }, [location.pathname]);
}
