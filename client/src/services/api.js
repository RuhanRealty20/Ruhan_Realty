const baseUrl=(import.meta.env.VITE_API_URL||'/api/v1').replace(/\/$/,'');
let refreshPromise;

async function parseResponse(response){
  const body=await response.json().catch(()=>({success:false,error:{message:'Unexpected server response'}}));
  if(!response.ok){const error=new Error(body.error?.message||'Request failed');error.status=response.status;error.code=body.error?.code;throw error}
  return body.data;
}

async function refreshAccessToken(){
  if(!refreshPromise)refreshPromise=fetch(`${baseUrl}/auth/refresh`,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'}}).then(parseResponse).then(data=>{sessionStorage.setItem('rr_access_token',data.accessToken);return data.accessToken}).finally(()=>{refreshPromise=undefined});
  return refreshPromise;
}

async function request(path,options={},retry=true){
  const token=sessionStorage.getItem('rr_access_token');
  const response=await fetch(`${baseUrl}${path}`,{credentials:'include',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...options.headers},...options});
  if(response.status===401&&retry&&token&&!path.startsWith('/auth/')){
    try{await refreshAccessToken();return request(path,options,false)}catch{sessionStorage.removeItem('rr_access_token')}
  }
  return parseResponse(response);
}

export const api={
  leads:{create:(data)=>request('/leads',{method:'POST',body:JSON.stringify(data)}),list:(params='')=>request(`/leads?${params}`),update:(id,data)=>request(`/leads/${id}`,{method:'PATCH',body:JSON.stringify(data)}),note:(id,note)=>request(`/leads/${id}/notes`,{method:'POST',body:JSON.stringify({note})})},
  auth:{login:(data)=>request('/auth/login',{method:'POST',body:JSON.stringify(data)}),refresh:refreshAccessToken,logout:()=>request('/auth/logout',{method:'POST'})},
  properties:{list:(params='')=>request(`/properties?${params}`),one:(slug)=>request(`/properties/${slug}`)},
  assistant:{chat:(data)=>request('/assistant/chat',{method:'POST',body:JSON.stringify(data)})},
  dashboard:()=>request('/admin/dashboard'),
  content:{list:(type)=>request(`/content${type?`?type=${encodeURIComponent(type)}`:''}`),publicList:(type)=>request(`/content/public/${type}`),create:(data)=>request('/content',{method:'POST',body:JSON.stringify(data)}),update:(id,data)=>request(`/content/${id}`,{method:'PATCH',body:JSON.stringify(data)})},
};
