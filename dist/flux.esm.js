function a(o,t,r){if(!r)throw new Error("x-flux: No transitions found for "+t);for(let n of Object.keys(r))o.setAttribute(n,r[n]);o.removeAttribute("x-flux")}function u(o){let[t,r,n,i="",e=""]=o,s=`${t} ${i}`.trim(),f=`${t} ${e}`.trim();return{"x-transition:enter":s,"x-transition:enter-start":r,"x-transition:enter-end":n,"x-transition:leave":f,"x-transition:leave-start":n,"x-transition:leave-end":r}}function l(o){let t={};for(let r in o){let n=o[r];t[`x-transition:${r}`]=n}return t}function c(o,t=null){if(!t)throw new Error("x-flux: Template "+o+" does not exist in the config.");try{return Array.isArray(t)?u(t):l(t)}catch{throw new Error("x-flux: Only accept array or object.")}}function x(o){let t=o.split("-");if(t.length===1)return o;let r=t.slice(1).map(n=>n.charAt(0).toUpperCase()+n.slice(1));return t[0]+r.join("")}function m(o,t){o.directive("flux",(r,{expression:n},{evaluate:i})=>{let e=i(n),s=(Array.isArray(e)?e:t[e])||null,f=c(e,s);a(r,e,f)}).before("transition");for(let r of Object.keys(t)){let n=x(r);o.magic(n,i=>()=>{let e=t[r]||null,s=c(r,e);a(i,r,s)})}o.magic("flux",r=>(n="")=>{let i=t[n]||null,e=c(n,i);a(r,n,e)})}var g=m;export{g as default};
