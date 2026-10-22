import { env } from '../../config/env.js';
import { ApiError } from '../../utils/api.js';
import { BridgeIdxAdapter } from './bridge.js';

class UnconfiguredIdxAdapter {
  status='unconfigured';
  async search(){return{items:[],total:0,providerStatus:this.status}}
  async getBySlug(){throw new ApiError(404,'This property is not available from the approved IDX feed','PROPERTY_UNAVAILABLE')}
}

export function createIdxAdapter(){
  if(env.NODE_ENV!=='test'&&env.IDX_PROVIDER.toLowerCase()==='bridge'&&env.IDX_API_URL&&env.IDX_API_KEY){
    return new BridgeIdxAdapter({baseUrl:env.IDX_API_URL,apiKey:env.IDX_API_KEY});
  }
  return new UnconfiguredIdxAdapter();
}
export const idxProvider=createIdxAdapter();
