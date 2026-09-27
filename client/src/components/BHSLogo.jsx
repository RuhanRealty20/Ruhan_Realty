export function BHSLogo({className='',compact=false}){
  const width=compact?36:174;
  return <svg className={`bhs-logo ${compact?'bhs-logo-compact':''} ${className}`.trim()} viewBox={`0 0 ${width} 66`} role="img" aria-label="Brown Harris Stevens" focusable="false">
    <g fill="currentColor" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900">
      <text x="0" y="19" fontSize="20">B</text>
      <text x="0" y="40" fontSize="20">H</text>
      <text x="0" y="61" fontSize="20">S</text>
      <rect x="29" y="1" width="2" height="64"/>
      {!compact&&<><text x="43" y="18" fontSize="13" letterSpacing="1">BROWN</text><text x="43" y="39" fontSize="13" letterSpacing="1">HARRIS</text><text x="43" y="60" fontSize="13" letterSpacing="1">STEVENS</text></>}
    </g>
  </svg>;
}
