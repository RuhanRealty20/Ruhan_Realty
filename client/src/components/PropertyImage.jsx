import { Building2, ImageOff } from 'lucide-react';
import { useState } from 'react';

export function PropertyImage({src,alt,className='',loading='lazy',fetchPriority,onLoad}){
  const [failedSrc,setFailedSrc]=useState('');
  const failed=!src||failedSrc===src;

  return <div className={`idx-media ${className} ${failed?'is-unavailable':''}`}>
    {!failed?<img src={src} alt={alt||''} loading={loading} fetchPriority={fetchPriority} onLoad={onLoad} onError={()=>setFailedSrc(src)}/>:<div className="idx-image-fallback" role="img" aria-label={alt||'Listing image unavailable'}><span><Building2 size={30}/><ImageOff size={15}/></span><strong>IDX image unavailable</strong><small>The listing feed did not provide an accessible photo.</small></div>}
  </div>;
}
