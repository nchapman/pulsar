function r(n,t=[],i={}){return[n,...t.filter(e=>!!e&&e!=="undefined"),...Object.entries(i).filter(([,e])=>!!e).map(([e])=>e)].join(" ")}export{r as c};
