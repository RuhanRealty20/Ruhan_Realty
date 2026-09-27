export function BHSLogo({className='',compact=false}){
  return <span className={`bhs-logo ${compact?'bhs-logo-compact':''} ${className}`.trim()} role="img" aria-label="Brown Harris Stevens">
    <span className="bhs-monogram" aria-hidden="true"><b>B</b><b>H</b><b>S</b></span>
    {!compact&&<span className="bhs-wordmark" aria-hidden="true"><b>BROWN</b><b>HARRIS</b><b>STEVENS</b></span>}
  </span>;
}
