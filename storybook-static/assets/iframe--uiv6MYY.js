const __vite__fileDeps=["./Button.stories-Dxutmg1Z.js","./compat.module-CAUz7a36.js","./preact.module-BeXc_rzl.js","./Button-CxH3AEDB.js","./classNames-CTaYpvhF.js","./jsxRuntime.module-Dwme6zuK.js","./_commonjsHelpers-BosuxZz1.js","./Logo-BQcSdfXk.js","./Logo-CFCAFuz2.css","./Text-Dst21N43.js","./Text-Ciidus3i.css","./Button-2X9X2rJt.css","./ConfirmModal.stories-C0wrOBy0.js","./Logo.stories-DIXDXNJw.js","./Progress.stories-CmcjUA72.js","./Select.stories-n2vRK5yT.js","./Text.stories-BFs1gQnu.js","./entry-preview-CqOfsnEZ.js","./index-DrFu-skq.js","./preview-6uLYm2Ic.js","./index-DYADbu9O.js","./preview-B63p-W8V.js","./preview-BAz7FMXc.js","./preview-CJT1csp9.js","./preview-LqWO5YYC.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import"../sb-preview/runtime.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))u(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&u(o)}).observe(document,{childList:!0,subtree:!0});function c(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function u(t){if(t.ep)return;t.ep=!0;const r=c(t);fetch(t.href,r)}})();const f="modulepreload",R=function(s,n){return new URL(s,n).href},p={},e=function(n,c,u){let t=Promise.resolve();if(c&&c.length>0){const r=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),E=o?.nonce||o?.getAttribute("nonce");t=Promise.all(c.map(i=>{if(i=R(i,u),i in p)return;p[i]=!0;const l=i.endsWith(".css"),O=l?'[rel="stylesheet"]':"";if(!!u)for(let a=r.length-1;a>=0;a--){const m=r[a];if(m.href===i&&(!l||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${i}"]${O}`))return;const _=document.createElement("link");if(_.rel=l?"stylesheet":f,l||(_.as="script",_.crossOrigin=""),_.href=i,E&&_.setAttribute("nonce",E),document.head.appendChild(_),l)return new Promise((a,m)=>{_.addEventListener("load",a),_.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${i}`)))})}))}return t.then(()=>n()).catch(r=>{const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r})},{createBrowserChannel:P}=__STORYBOOK_MODULE_CHANNELS__,{addons:T}=__STORYBOOK_MODULE_PREVIEW_API__,d=P({page:"preview"});T.setChannel(d);window.__STORYBOOK_ADDONS_CHANNEL__=d;window.CONFIG_TYPE==="DEVELOPMENT"&&(window.__STORYBOOK_SERVER_CHANNEL__=d);const L={"./src/shared/ui/Button/Button.stories.tsx":async()=>e(()=>import("./Button.stories-Dxutmg1Z.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url),"./src/shared/ui/ConfirmModal/ConfirmModal.stories.tsx":async()=>e(()=>import("./ConfirmModal.stories-C0wrOBy0.js"),__vite__mapDeps([12,3,1,2,4,5,6,7,8,9,10,11]),import.meta.url),"./src/shared/ui/Logo/Logo.stories.tsx":async()=>e(()=>import("./Logo.stories-DIXDXNJw.js"),__vite__mapDeps([13,7,1,2,4,5,8]),import.meta.url),"./src/shared/ui/Progress/Progress.stories.tsx":async()=>e(()=>import("./Progress.stories-CmcjUA72.js"),__vite__mapDeps([14,3,1,2,4,5,6,7,8,9,10,11]),import.meta.url),"./src/shared/ui/Select/Select.stories.tsx":async()=>e(()=>import("./Select.stories-n2vRK5yT.js"),__vite__mapDeps([15,3,1,2,4,5,6,7,8,9,10,11]),import.meta.url),"./src/shared/ui/Text/Text.stories.tsx":async()=>e(()=>import("./Text.stories-BFs1gQnu.js"),__vite__mapDeps([16,9,1,2,4,10]),import.meta.url)};async function v(s){return L[s]()}const{composeConfigs:h,PreviewWeb:A,ClientApi:S}=__STORYBOOK_MODULE_PREVIEW_API__,w=async()=>{const s=await Promise.all([e(()=>import("./entry-preview-CqOfsnEZ.js"),__vite__mapDeps([17,2,18]),import.meta.url),e(()=>import("./entry-preview-docs-DbzIP2u-.js"),[],import.meta.url),e(()=>import("./preview-6uLYm2Ic.js"),__vite__mapDeps([19,20]),import.meta.url),e(()=>import("./preview-BkPRTtXJ.js"),[],import.meta.url),e(()=>import("./preview-DNpCpRPf.js"),[],import.meta.url),e(()=>import("./preview-B63p-W8V.js"),__vite__mapDeps([21,18]),import.meta.url),e(()=>import("./preview-B4GcaC1c.js"),[],import.meta.url),e(()=>import("./preview-sVLxC_Lr.js"),[],import.meta.url),e(()=>import("./preview-BAz7FMXc.js"),__vite__mapDeps([22,18]),import.meta.url),e(()=>import("./preview-CYD85dwb.js"),[],import.meta.url),e(()=>import("./preview-BNMNKH2l.js"),[],import.meta.url),e(()=>import("./preview-DF-d5FoE.js"),[],import.meta.url),e(()=>import("./preview-CJT1csp9.js"),__vite__mapDeps([23,5,2,1,24]),import.meta.url)]);return h(s)};window.__STORYBOOK_PREVIEW__=window.__STORYBOOK_PREVIEW__||new A(v,w);window.__STORYBOOK_STORY_STORE__=window.__STORYBOOK_STORY_STORE__||window.__STORYBOOK_PREVIEW__.storyStore;export{e as _};