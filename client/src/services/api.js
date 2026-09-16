const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';

async function request(path, options = {}) {
  const token = sessionStorage.getItem('rr_access_token');
  const response = await fetch(`${baseUrl}${path}`, { credentials:'include', headers:{ 'Content-Type':'application/json', ...(token ? { Authorization:`Bearer ${token}` } : {}), ...options.headers }, ...options });
  const body = await response.json().catch(() => ({ success:false, error:{ message:'Unexpected server response' } }));
  if (!response.ok) throw new Error(body.error?.message || 'Request failed');
  return body.data;
}
export const api = {
  leads:{ create:(data) => request('/leads',{ method:'POST', body:JSON.stringify(data) }), list:(params='') => request(`/leads?${params}`), update:(id,data) => request(`/leads/${id}`,{ method:'PATCH',body:JSON.stringify(data) }), note:(id,note) => request(`/leads/${id}/notes`,{method:'POST',body:JSON.stringify({note})}) },
  auth:{ login:(data) => request('/auth/login',{method:'POST',body:JSON.stringify(data)}), refresh:() => request('/auth/refresh',{method:'POST'}), logout:() => request('/auth/logout',{method:'POST'}) },
  properties:{ list:(params='') => request(`/properties?${params}`), one:(slug) => request(`/properties/${slug}`) },
  dashboard:() => request('/admin/dashboard'),
  content:{ list:(type) => request(`/content/${type}`) },
};
