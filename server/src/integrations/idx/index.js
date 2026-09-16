import { env } from '../../config/env.js';
import { ApiError } from '../../utils/api.js';

class UnconfiguredIdxAdapter {
  status='unconfigured';
  async search(){return{items:[],total:0,providerStatus:this.status}}
  async getBySlug(){throw new ApiError(404,'This property is not available from the approved IDX feed','PROPERTY_UNAVAILABLE')}
}

class HttpIdxAdapter {
  status='connected';
  constructor({baseUrl,apiKey}){this.baseUrl=baseUrl;this.apiKey=apiKey}
  async request(path,params){const url=new URL(path,this.baseUrl);Object.entries(params||{}).forEach(([k,v])=>v&&url.searchParams.set(k,v));const response=await fetch(url,{headers:{Authorization:`Bearer ${this.apiKey}`,Accept:'application/json'}});if(!response.ok)throw new ApiError(502,'Listing provider is temporarily unavailable','IDX_UNAVAILABLE');return response.json()}
  // Map only fields the provider authorizes. Replace these two methods in a named provider adapter.
  async search(filters){return this.request('/properties',filters)}
  async getBySlug(slug){return this.request(`/properties/${encodeURIComponent(slug)}`)}
}

export function createIdxAdapter(){if(env.IDX_PROVIDER==='http'&&env.IDX_API_URL&&env.IDX_API_KEY)return new HttpIdxAdapter({baseUrl:env.IDX_API_URL,apiKey:env.IDX_API_KEY});return new UnconfiguredIdxAdapter()}
export const idxProvider=createIdxAdapter();
