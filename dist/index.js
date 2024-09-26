"use strict";(()=>{function a(n){let e=typeof n=="string"?document.createElement(n):n;return{cls(t){return e.classList.add(t),this},macls(t){return e.classList.add(...t),this},mcls(...t){return e.classList.add(...t),this},rcls(...t){return e.classList.remove(...t),this},id(t){return e.id=t,this},attr(t,r="true"){return e.setAttribute(t,r),this},style(t){return e.setAttribute("style",t),this},styleAttr(t){for(let r in t)e.style[r]=t[r];return this},evtrm(t,r,i){return e.removeEventListener(t,r,i),this},evt(t,r,i){return e.addEventListener(t,r,i),this},attrs(t){return t.forEach(([r,i])=>{e.setAttribute(r,i)}),this},innerText(t){return e.innerText=t,this},innerHtml(t){return e.innerHTML=t,this},childNodes(t){return t.forEach(r=>r instanceof HTMLElement||r instanceof Node||r instanceof Text?e.append(r):e.append(r.get())),this},inner(t){return e.append(...t.map(r=>r instanceof HTMLElement||r instanceof Node?r:r.get())),this},inners(...t){return e.append(...t.map(r=>r instanceof HTMLElement||r instanceof Node?r:r.get())),this},extd(t){return this.inner(t)},children(t){return this.inner(t)},inputType(t){return e.type=t,this},checkbox(){return this.inputType("checkbox")},text(){return this.inputType("text")},checked(t){return e.checked=t,this},check(){return this.checked(!0)},nocheck(){return this.checked(!1)},readonly(t){return e.readOnly=t,this},read(){return this.readonly(!0)},noread(){return this.readonly(!1)},spellcheck(t){return e.spellcheck=t,this},spellchk(){return this.spellcheck(!0)},nospellchk(){return this.spellcheck(!1)},placeholder(t){return e.placeholder=t,this},tcls(t){return e.classList.toggle(t),this},mtcls(...t){return t.forEach(r=>e.classList.toggle(r)),this},bcls(t){return e.classList.add(...t),this},getnd(){return e},getel(){return e},get(){return e},appendTo(t){return t.appendChild(e),this},append(t){return this.appendChild(t)},replaceWith(t){return t.parentNode&&t.parentNode.replaceChild(e,t),this},appendChild(t){return e.appendChild(t),this},nextTo(t){return t.parentNode&&(t.nextSibling?t.parentNode.insertBefore(e,t.nextSibling):t.parentNode.appendChild(e)),this},before(t){return t.parentNode&&t.parentNode.insertBefore(e,t),this}}}var L=class n{constructor(e){this.key=e}subscriptionActionList=[];static createSubscription(e,t){let r=new n(e);return r.subscriptionActionList=t,r}subscribe(e){this.subscriptionActionList.push(e)}fire(e){for(let t=0;t<this.subscriptionActionList.length;++t)this.subscriptionActionList[t](e)}unsubscribe(e){for(let t=0;t<this.subscriptionActionList.length;++t)this.subscriptionActionList[t]===e&&this.subscriptionActionList.splice(t,1)}};var N=class{eventQueue={};subscriptionMap={};constructor(){}createSubscription(e){return this.subscriptionMap.hasOwnProperty(e)?this.subscriptionMap[e]=new L(e):this.eventQueue.hasOwnProperty(e)?(this.subscriptionMap[e]=L.createSubscription(e,this.eventQueue[e]),delete this.eventQueue[e]):this.subscriptionMap[e]=new L(e),this.subscriptionMap[e]}unsubscribeToEvent(e,t){this.subscriptionMap.hasOwnProperty(e)&&this.subscriptionMap[e].unsubscribe(t)}fire(e,t){this.subscriptionMap.hasOwnProperty(e)&&this.subscriptionMap[e].fire(t)}subscribeToEvent(e,t){this.subscriptionMap.hasOwnProperty(e)?this.subscriptionMap[e].subscribe(t):this.eventQueue.hasOwnProperty(e)?this.eventQueue[e].push(t):this.eventQueue[e]=[t]}};var R=class{constructor(e,t){this.subscriber=e;this.wasmModule=t;this.contextObservable$=this.subscriber.createSubscription("contextcreated"),this.fileObservable$=this.subscriber.createSubscription("musicchanged")}audioContext;mainGain;sourceBuffer;bufferSourceNode;contextObservable$;fileObservable$;paused=!0;initialized=!1;audioWorkletNode;createWorkletNode(){this.useAudioContext().audioWorklet.addModule("scripts/phase-vocoder.service.js").then(e=>{this.audioWorkletNode=new AudioWorkletNode(this.useAudioContext(),"phase-vocoder-processor"),this.audioWorkletNode.port.postMessage({data:this.wasmModule}),this.audioWorkletNode.port.onmessage=t=>{t.data.wasm_init&&(this.initialized=!0,this.contextObservable$.fire())},this.mainGain.connect(this.audioWorkletNode),this.audioWorkletNode.connect(this.audioContext.destination)}).catch(e=>{console.error(e)})}changePitchFactor(e){let t=this.audioWorkletNode.parameters.get("pitchFactor");t.value=e}changeSpeedFactor(e){let t=this.audioWorkletNode.parameters.get("playbackRate");t.value=e}useAudioContext(){return this.audioContext||(this.audioContext=new AudioContext,this.mainGain=this.audioContext.createGain(),this.createWorkletNode()),this.audioContext}setPaused(e){this.paused=e}makeConnection(e){this.mainGain||this.useAudioContext(),e.connect(this.mainGain)}isInitialized(){return this.initialized}isPaused(){return this.paused}resume(){this.paused=!1,this.useAudioContext().resume()}pause(){this.paused=!0,this.useAudioContext().suspend()}connectGainTo(e){this.mainGain||this.useAudioContext(),this.mainGain.connect(e),e.connect(this.audioContext.destination)}connectAudioWorkletNodeTo(e){this.audioContext||this.useAudioContext(),this.audioWorkletNode&&(this.audioWorkletNode.connect(e),e.connect(this.audioContext.destination))}};var P=class{constructor(e){this.subscriber=e;[this.mainDOM,this.paletteElement]=this.constructPalette(),this.subscriber.createSubscription("palette")}mainDOM;paletteElement;paletteArray=[["#0a0c0d","#d8dceb"],["#0f4d19","#6fc27c"],["#143d59","#c4f41a"],["#2F3C7E","#FBEAEB"],["#990011","#FCF6F5"],["#AD4F21","#FCF6E5"],["#50586C","#DCE2F0"],["#262223","#DDC6B6"],["#02343F","#F0EDCC"],["#00203F","#ADEFD1"],["#D1E9F6","#524986"],["#262150","#dfd3f3"],["#f3bbc5","#1a1b1b"],["#292426","#b5dde0"],["#eefa9f","#2b3649"]];getAllAttachableViews(){return[this.mainDOM]}sendData(e){let t=e.target;t.tagName.toLocaleLowerCase()==="span"&&(t=t.parentElement);let r=[t.getAttribute("data-back-color"),t.getAttribute("data-fore-color"),!1];this.subscriber.fire("palette",r)}constructPalette(){let e=this.constructTitle(),t=this.constructPaletteColors(),r=a("div").mcls("bg-gray-600/30","backdrop-blur-[2px]","min-w-36","top-10","right-10","rounded-[3px]","p-2","text-center").mcls("max-h-72","overflow-hidden","flex","flex-col","shadow-md").inners(e,t).get(),i=r.children[1],o=e.children[1];return a(o).evt("click",l=>{a(o).tcls("rotate-180"),a(i).tcls("collapsed")}),[r,t]}constructPaletteDOM(e){return a("div").mcls("min-h-12","w-avail","h-8","rounded-sm","transition-all","duration-300","ease-in-out","hover:bg-gray-100/30","cursor-pointer").inners(a("span").mcls("w-8","h-8","p-4","relative","top-2","inline-block").styleAttr({backgroundColor:e[0]}).get(),a("span").mcls("min-w-8","min-h-8","p-4","relative","top-2","inline-block").styleAttr({backgroundColor:e[1]}).get()).attr("data-back-color",e[0]).attr("data-fore-color",e[1]).evt("click",this.sendData.bind(this)).get()}constructGradientPallete(e){let t=e.target;t.tagName.toLocaleLowerCase()==="span"&&(t=t.parentElement);let r=[t.getAttribute("data-back-color"),t.getAttribute("data-fore-color"),!0];this.subscriber.fire("palette",r)}constructGradientPaletteDOM(e){return a("div").mcls("min-h-12","w-avail","h-8","rounded-sm","transition-all","duration-300","ease-in-out","hover:bg-gray-100/30","cursor-pointer").inners(a("span").mcls("w-8","h-8","p-4","relative","top-2","inline-block").styleAttr({backgroundColor:`linearGradient(${e[0]}, ${e[1]})`}).get(),a("span").mcls("min-w-8","min-h-8","p-4","relative","top-2","inline-block").styleAttr({backgroundColor:e[1]}).get()).attr("data-back-color",e[0]).attr("data-fore-color",e[1]).evt("click",this.constructGradientPallete.bind(this)).get()}constructPaletteColors(){return a("div").mcls("flex","flex-col","w-full","h-full","scrollbar-thumb","overflow-y-scroll","overflow-x-hidden","mt-4").inner(this.paletteArray.map(([t,r])=>[this.constructPaletteDOM([t,r]),this.constructPaletteDOM([r,t])]).flat()).get()}constructTitle(){return a("span").mcls("text-[18px]","font-serif","text-gray-100","block","items-center","flex").inner([a("span").mcls("relative","top-[2px]","block","self-center","w-avail","font-bold").innerText("Color Theme"),a("button").mcls("min-h-8","min-w-8","rounded-[1rem]","bg-gray-700","text-gray-100","border-[0]","ml-4","self-end").mcls("transition-transform","duration-200","ease-in-out").innerHtml("\u25B2")]).get()}getView(){return this.mainDOM}};var W=class{constructor(e){this.subscriber=e;this.mainDOM=this.constructPanelView()}mainDOM;constructPanelView(){return a("div").mcls("fixed","bg-gray-600/30","backdrop-blur-[2px]","min-w-36","min-h-24","top-10","right-10","rounded-[1rem]","pr-0","text-center").mcls("overflow-y-scroll","shadow-md","panel-height","scrollbar-thumb").inners(a("div").mcls("text-gray-200","p-2").innerHtml("Press LCtrl to hide the panel.")).get()}attachViews(e){e.forEach(t=>this.mainDOM.appendChild(a(t).mcls("m-2").get()))}getView(){return this.mainDOM}};var v={padder(n){return n<10?"0"+n:n.toString()},padderString(n){return n.length<=1?"0"+n:n},timerSec(n){let[e,t]=[Math.floor(n/60),Math.floor(n)%60];return`${this.padder(e)}:${this.padder(t)}`},linearToCubic(n,e=256,t=1){let r=n/(e*t);return r*r*r*e},linearToPower(n,e,t=256,r=1){let i=n/(t*r);return Math.pow(i,e)*t},linearToSquare(n,e=256,t=1){let r=n/(e*t);return r*r*e}};var p=class n{constructor(e,t){this.r=e;this.i=t}add=e=>new n(this.r+e.r,this.i+e.i);sub=e=>new n(this.r-e.r,this.i-e.i);mul=e=>new n(this.r*e.r-this.i*e.i,this.i*e.r+this.r*e.i);muln=e=>new n(this.r*e,this.i*e);div=e=>new n((this.r*e.r+this.i*e.i)/e.abs_sq(),(this.i*e.r-this.r*e.i)/e.abs_sq());abs=()=>Math.sqrt(this.r*this.r+this.i+this.i);abs_sq=()=>this.r*this.r+this.i+this.i;static unit=e=>new n(Math.cos(e),Math.sin(e));static vec=(e,t)=>new n(e*Math.cos(t),e*Math.sin(t));coord=()=>[this.r,this.i];conj=()=>new n(this.r,-this.i);invConj=()=>new n(this.i,-this.r);inv=()=>new n(this.i,this.r)};function w(n,e){let t={...n,width:document.documentElement.clientWidth,height:document.documentElement.clientHeight,resize:(r,i)=>{}};return t.resize=function(r,i){this.width=r,this.height=i,e&&e(t)}.bind(t),t}function G(n,e){e.forEach(t=>t.fn(n,t))}function $(n,e,t,r,i,o,l){return w({type:"Particle",timeStamp:performance.now(),length:n,fn:ce,isSpiral:!1,checkSpiral:function(c){this.isSpiral=c.target.checked},buffer:{x:new Float32Array(n).map(c=>Math.random()*e),y:new Float32Array(n).map(c=>Math.random()*t),vx:new Float32Array(n).map(c=>Math.random()*r),vy:new Float32Array(n).map(c=>Math.random()*i),ax:new Float32Array(n).map(c=>Math.random()*o),ay:new Float32Array(n).map(c=>Math.random()*l)}})}var j=(n,e,t)=>Math.min(Math.max(n,e),t);function ce(n,e){n.fillStyle=e.textColor,n.beginPath();let t=performance.now(),r=(t-e.timeStamp)/1e3;for(let i=0;i<e.length;++i){let[o,l,c,s,u,h]=[e.buffer.x[i],e.buffer.y[i],e.buffer.vx[i],e.buffer.vy[i],e.buffer.ax[i],e.buffer.ay[i]];e.isSpiral?(n.fillRect(o,l,1+(c>0?1:0),1+(c>0?1:0)),[u,h]=p.vec(8,Math.random()*Math.PI).coord()):(n.fillRect(o,l,1,1),[u,h]=p.vec(16,2*Math.random()*Math.PI).coord()),c+=u*r,c=j(c,-20,20),s+=h*r,s=j(s,-20,20),o+=c*r,l+=s*r,o<0?o+=e.width:o>e.width&&(o-=e.width),l<0?l+=e.height:l>e.height&&(l-=e.height),e.buffer.x[i]=o,e.buffer.y[i]=l,e.buffer.vx[i]=c,e.buffer.vy[i]=s,e.buffer.ax[i]=u,e.buffer.ay[i]=h}e.timeStamp=t,n.stroke()}var ue=n=>n<200?"rgb(135 255 66)":n<275?"rgb(255 192 98)":"rgb(255 75 99)";function K(n,e){return w({type:"Bar",bandBarCount:16,lineType:"Normal",bandRanges:[[20,260],[260,500],[500,2e3],[2e3,5e3],[5e3,15e3]],frequencyIncr:n,volumeScaling:.4,barFactor:3,mirrored:e,fn:me})}function de(n,e,t,r,i){let o=Math.abs(i-t),l=25,c=8;n.lineCap="square";let s=e,u=t;for(let h=0,d=0;d<o;d+=l,h+=1)n.fillStyle=ue(d),n.fillRect(s,u,r,l-c),u-=l}function V(n,e,t,r,i,o){switch(e.moveTo(t,r),n){case"Normal":e.fillRect(t,r,e.lineWidth,o-r);break;case"Retro":de(e,t,r,i,o);break}}function me(n,e){e.analyser.getFloatFrequencyData(e.buffer);let t=e.buffer,r=e.width/(e.bandBarCount*5);n.lineWidth=r-r/10;let i=e.height;n.lineCap="square",n.beginPath();let o=0,l=0;if(e.mirrored){let c=e.height/2+50,s=n.strokeStyle;for(let[u,h]of e.bandRanges){let f=(h-u)/e.frequencyIncr/e.bandBarCount,m=0;for(;m<e.bandBarCount;++m,l+=f){let x=t[Math.floor(l)]+128;if(x>0){let M=v.linearToPower(x,4,256,e.volumeScaling)*(e.barFactor/1.65);n.fillStyle=s,V(e.lineType,n,o,c,n.lineWidth,c-M),n.fillStyle=s+"90",V(e.lineType,n,o,c,n.lineWidth,c+M)}o+=r}}}else for(let[c,s]of e.bandRanges){let h=(s-c)/e.frequencyIncr/e.bandBarCount,d=0;for(;d<e.bandBarCount;++d,l+=h){let f=t[Math.floor(l)]+128;if(f>0){let m=i-v.linearToPower(f,4,256,e.volumeScaling)*e.barFactor;V(e.lineType,n,o,i,n.lineWidth,m)}o+=r}}n.stroke()}function Q(n,e){return w({type:"BarCircle",angleInit:0,lineType:"Default",radius:200,circleBarCount:25,bandRanges:[[20,260],[260,500],[500,2e3],[2e3,5e3],[5e3,15e3]],fn:he,frequencyIncr:n,volumeScaling:.5,barCircleFactor:3.2,timeStamp:performance.now(),mirrored:e,angularVelocity:2*Math.PI/100})}function he(n,e){e.analyser.getFloatFrequencyData(e.buffer);let t=e.buffer,r=e.width/2,i=e.height/2,o=(e.mirrored?1:2)*Math.PI/(e.bandRanges.length*e.circleBarCount),l=e.angleInit,c=Math.min(e.width,e.height)/4,s=p.unit(o),u=c*o,h=p.unit(l),d=p.vec(c,l);n.lineWidth=u-u/10,n.lineCap="round";let f=0,m=performance.now();n.beginPath(),n.lineWidth=u-u/10;for(let[x,M]of e.bandRanges){let S=(M-x)/e.frequencyIncr/e.circleBarCount,C=0;for(;C<e.circleBarCount;++C,f+=S){let E=t[Math.floor(f)]+128;if(E>0){let T=v.linearToPower(E,4,256,e.volumeScaling)*e.barCircleFactor,y=h.muln(T),[b,g]=d.coord(),[I,le]=y.coord();n.moveTo(b+r,g+i),n.lineTo(b+r+I,g+i+le)}d=d.mul(s),h=h.mul(s),l+=o}}e.angleInit+=(m-e.timeStamp)/1e3*e.angularVelocity,e.timeStamp=m,n.stroke()}function X(n,e){return w({type:"Wave Circle",angleInit:0,lineType:"Normal",radius:e?225:175,bandRanges:[[20,260],[260,500],[500,2e3],[2e3,5e3],[5e3,15e3]],fn:e?be:fe,waveCounts:24,frequencyIncr:n,volumeScaling:.5,barCircleFactor:e?1.75:2.25,timeStamp:performance.now(),angularVelocity:2*Math.PI/100})}function fe(n,e){e.analyser.getFloatFrequencyData(e.buffer);let[t,r]=[e.width/2,e.height/2],i=2*Math.PI/(e.bandRanges.length*e.waveCounts),o=e.angleInit,l=p.vec(e.height/4,o),c=p.unit(i),s=p.unit(o);n.lineWidth=2;let u=0,h=null,d=[0,0],f=performance.now();n.beginPath();for(let[m,x]of e.bandRanges){let F=(x-m)/e.frequencyIncr/e.waveCounts,S=0;for(;S<e.waveCounts;++S,u+=F){let C=e.buffer[Math.ceil(u)]+128,E=v.linearToPower(C,4,256,e.volumeScaling)*e.barCircleFactor,T=s.muln(E),[y,b]=l.coord(),[g,I]=T.coord();h===null?(h=[y+t+g,b+r+I],n.moveTo(y+t+g,b+r+I)):n.quadraticCurveTo(d[0],d[1],y+t+g,b+r+I),d=[y+t+g,b+r+I],l=l.mul(c),s=s.mul(c),o+=i}}e.angleInit+=(f-e.timeStamp)/1e3*e.angularVelocity,e.timeStamp=f,n.stroke()}function be(n,e){e.analyser.getFloatFrequencyData(e.buffer);let t=e.width/2,r=e.height/2,i=Math.PI/(e.bandRanges.length*e.waveCounts),o=e.angleInit;n.lineWidth=3;let l=0,c=null,s=[0,0,0,0],u=0,h=performance.now();n.beginPath();let d=new Float32Array(e.bandRanges.length*e.waveCounts);for(let[C,E]of e.bandRanges){let y=(E-C)/e.frequencyIncr/e.waveCounts,b=0;for(;b<e.waveCounts;++b,l+=y){let g=e.buffer[Math.ceil(l)]+128;d[u++]=v.linearToPower(g,4,256,e.volumeScaling)*e.barCircleFactor}}let f=new Float32Array(d.length*2);f.subarray(0,d.length).set(d),f.subarray(d.length).set(d.reverse());let m=f.subarray(0,2*e.waveCounts).reduce((C,E)=>C+E,0)/(2*e.waveCounts),x=Math.min(e.width,e.height)/4,M=p.vec(x+v.linearToPower(m,2,256,1),o),F=p.unit(i),S=p.unit(o);n.lineWidth=3;for(let C of f){let E=S.muln(C),[T,y]=M.coord(),[b,g]=E.coord();c===null?c=[T+t,y+r,b,g]:(n.moveTo(s[0]+s[2],s[1]+s[3]),n.quadraticCurveTo(s[0]+s[2],s[1]+s[3],T+t+b,y+r+g),n.moveTo(s[0]-s[2],s[1]-s[3]),n.quadraticCurveTo(s[0]-s[2],s[1]-s[3],T+t-b,y+r-g),n.moveTo(T+t+b,y+r+g),n.lineTo(T+t-b,y+r-g)),s=[T+t,y+r,b,g],M=M.mul(F),S=S.mul(F),o+=i}n.moveTo(s[0]+s[2],s[1]+s[3]),n.quadraticCurveTo(s[0]+s[2],s[1]+s[3],c[0]+c[2],c[1]+c[3]),n.moveTo(s[0]-s[2],s[1]-s[3]),n.quadraticCurveTo(s[0]-s[2],s[1]-s[3],c[0]-c[2],c[1]-c[3]),e.angleInit+=(h-e.timeStamp)/1e3*e.angularVelocity,e.timeStamp=h,n.stroke()}function J(){return w({type:"Wave",fn:ge})}function ge(n,e){n.lineWidth=2,e.analyser.getByteTimeDomainData(e.buffer);let t=e.height,r=t/2,i=e.buffer,o=e.width/e.buffer.length,l=0,c=i[0]/128-1,s=r+c*256;n.beginPath(),n.moveTo(0,s);for(let u=1;u<i.length;u++){let h=i[u]/128-1,d=r+h*512;n.lineTo(l,d),l+=o}n.stroke()}var Me={},A,k=new Array(128).fill(void 0);k.push(void 0,null,!0,!1);function D(n){return k[n]}var H=k.length;function pe(n){n<132||(k[n]=H,H=n)}function ye(n){let e=D(n);return pe(n),e}var ee=typeof TextDecoder<"u"?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};typeof TextDecoder<"u"&&ee.decode();var O=null;function te(){return(O===null||O.byteLength===0)&&(O=new Uint8Array(A.memory.buffer)),O}function Z(n,e){return n=n>>>0,ee.decode(te().subarray(n,n+e))}var _=null;function Y(){return(_===null||_.buffer.detached===!0||_.buffer.detached===void 0&&_.buffer!==A.memory.buffer)&&(_=new DataView(A.memory.buffer)),_}function ne(n){H===k.length&&k.push(k.length+1);let e=H;return H=k[e],k[e]=n,e}function q(n,e){try{return n.apply(this,e)}catch(t){A.__wbindgen_exn_store(ne(t))}}var re=0;function ve(n,e){let t=e(n.length*1,1)>>>0;return te().set(n,t/1),re=n.length,t}var B=null;function we(){return(B===null||B.byteLength===0)&&(B=new Uint8ClampedArray(A.memory.buffer)),B}function Te(n,e){return n=n>>>0,we().subarray(n/1,n/1+e)}async function xe(n,e){if(typeof Response=="function"&&n instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(n,e)}catch(r){if(n.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",r);else throw r}let t=await n.arrayBuffer();return await WebAssembly.instantiate(t,e)}else{let t=await WebAssembly.instantiate(n,e);return t instanceof WebAssembly.Instance?{instance:t,module:n}:t}}function Ce(){let n={};return n.wbg={},n.wbg.__wbindgen_object_drop_ref=function(e){ye(e)},n.wbg.__wbg_setglobalCompositeOperation_fce0d56773527492=function(){return q(function(e,t,r){D(e).globalCompositeOperation=Z(t,r)},arguments)},n.wbg.__wbg_drawImage_d7a7d393f2597a75=function(){return q(function(e,t,r,i){D(e).drawImage(D(t),r,i)},arguments)},n.wbg.__wbg_putImageData_56e088afd88fcc90=function(){return q(function(e,t,r,i){D(e).putImageData(D(t),r,i)},arguments)},n.wbg.__wbg_clearRect_2823209627b6e357=function(e,t,r,i,o){D(e).clearRect(t,r,i,o)},n.wbg.__wbg_data_3748d6414e549999=function(e,t){let r=D(t).data,i=ve(r,A.__wbindgen_malloc),o=re;Y().setInt32(e+4*1,o,!0),Y().setInt32(e+4*0,i,!0)},n.wbg.__wbg_newwithu8clampedarray_6b29095634b7e758=function(){return q(function(e,t,r){let i=new ImageData(Te(e,t),r>>>0);return ne(i)},arguments)},n.wbg.__wbindgen_throw=function(e,t){throw new Error(Z(e,t))},n}function Ee(n,e){return A=n.exports,ie.__wbindgen_wasm_module=e,_=null,O=null,B=null,A}async function ie(n){if(A!==void 0)return A;typeof n<"u"&&Object.getPrototypeOf(n)===Object.prototype?{module_or_path:n}=n:console.warn("using deprecated parameters for the initialization function; pass a single object instead"),typeof n>"u"&&(n=new URL("wasm_eq_visualizer_bg.wasm",Me.url));let e=Ce();(typeof n=="string"||typeof Request=="function"&&n instanceof Request||typeof URL=="function"&&n instanceof URL)&&(n=fetch(n));let{instance:t,module:r}=await xe(await n,e);return Ee(t,r)}var ae=ie;ae({module_or_path:"./wasm_eq_visualizer_bg.wasm"});function se(n,e){let t=new OffscreenCanvas(n,e),r=t.getContext("2d",{willReadFrequently:!0}),i=new OffscreenCanvas(n,e),o=i.getContext("2d",{willReadFrequently:!0});return w({offCanvas:t,context:r,outCanvas:i,outContext:o,r:r.createImageData(n,e),g:r.createImageData(n,e),b:r.createImageData(n,e)},l=>{l.offCanvas.width=l.width,l.offCanvas.height=l.height,l.outCanvas.width=l.width,l.outCanvas.height=l.height})}function oe(...n){return a("div").mcls("bg-gray-600/30","backdrop-blur-[2px]","transition-all","duration-200","ease-in-out","w-avail","top-10","right-[300px]","rounded-[3px]","p-2","pr-0","text-center").mcls("max-h-72","overflow-y-scroll","scrollbar-thumb","flex","flex-col","shadow-md").inners(...n).get()}function U(n){return a("span").mcls("text-[18px]","font-serif","text-gray-100","block","items-center","flex").inners(a("span").mcls("relative","top-[2px]","block","self-center","w-avail","font-bold").innerText(n),a("button").mcls("min-h-8","min-w-8","rounded-[1rem]","bg-gray-700","text-gray-100","border-[0]","ml-4","self-end").mcls("transition-transform","duration-200","ease-in-out").innerHtml("\u25B2")).get()}function ke(n,e,t){return[a("div").inners(a("input").inputType(n).attr("name","toggle-spiral").evt("change",t),a("label").attr("for","toggle-spiral").mcls("text-gray-200","p-2").innerHtml(e).get())]}var z=class{constructor(e,t){this.audioService=e;this.subscriber=t;let[r,i,o]=this.constructSeekbar();this.seekBarThumb=r,this.playButton=i;let{canvas:l,canvasContext:c}=this.buildCanvas();this.canvas=l,this.canvasContext=c,this.resetCanvas(this.canvasContext),this.fps=this.initializeFpsCounter(),this.mainDOM=this.initializeAudio(this.canvas,o,this.fps),this.canvasAction.draw.push(Object.assign($(256,this.width,this.height,6,6,2,2),{drawKind:"other",textColor:this.textColor})),this.channelData=se(this.width,this.height),this.offscreenCanvas=new OffscreenCanvas(this.width,this.height),this.offContext=this.offscreenCanvas.getContext("2d",{willReadFrequently:!0}),this.subscriber.subscribeToEvent("palette",s=>{[this.backColor,this.textColor]=s,this.canvasAction.draw=this.canvasAction.draw.map(u=>({...u,backColor:this.backColor,textColor:this.textColor})),this.resetCanvas(this.canvasContext)})}fileName=null;backColor="rgb(10 12 14)";textColor="rgb(216 220 235)";seekPadding=200;prevTimer=performance.now();width=document.documentElement.clientWidth;height=document.documentElement.clientWidth;timer=0;transformationsFns=[];channelData;optionsArray=[];currentEq={};canvasAction={draw:[],effects:[]};mainDOM;buffer=new Uint8Array(0);frequencyBuffer=new Float32Array(1);canvas;offscreenCanvas;offContext;analyser;canvasContext;bufferLength=0;fftSize=16384;animationFrame=0;seekbarAnimationFrame=0;sourceBuffer;bufferSourceNode;currentMode="Wave";frequencyIncr=0;fontSize=30;playButton;seekBarThumb;fps;totalTimer=0;seekbarLength=0;offsetTimer=0;lineType="Normal";prevTime=null;pitchCorrection=1;allowMediaControl(e){this.audioService.isInitialized()||(this.audioService.useAudioContext(),this.changeMode(this.currentMode))}createAudioPermissionButton(){return a("button").mcls("bg-blue-700","block","w-avail","text-gray-100","p-2","pb-1","hover:bg-blue-600","transition-all","ease-in-out","duration-300","rounded-sm","active:bg-blue-700").innerHtml("Allow Media Control").evt("click",this.allowMediaControl.bind(this)).get()}selectMediaFile(e){let t=a("input").attr("type","file").attr("accept","audio/*").get();t.onchange=r=>this.setSourceFile(r.target.files[0]),t.click()}setSourceFile(e){[this.sourceBuffer,this.bufferSourceNode]=this.setSourceNode(e,{playbackRate:1});let t=e.name.split(".");this.audioService.setPaused(!1),t.pop(),this.fileName=t.join("."),this.timer=this.audioService.useAudioContext().currentTime,this.run()}createFileSelectionButton(){return a("button").mcls("bg-blue-700","block","w-avail","text-gray-100","p-2","pb-1","hover:bg-blue-600","transition-all","ease-in-out","duration-300","rounded-sm","active:bg-blue-700").innerHtml("Select Audio File").evt("click",this.selectMediaFile.bind(this)).get()}resetCanvasType(e){let{canvas:t,canvasContext:r}=this.buildCanvas(e);this.mainDOM.replaceChild(t,this.canvas),this.canvas=t,this.canvasContext=r}initializeFpsCounter(){return a("div").mcls("absolute","w-content","p-2","bg-gray-700/80","top-0","text-gray-200","rounded-b-lg").innerHtml("0 FPS").get()}onSpiralToggle(e){let t=this.canvasAction.draw.find(({type:r})=>r&&r==="Particle");t&&(t.isSpiral=e.target.checked)}createCheckBox(){let e=U("Modifiers"),t=oe(e,a("div").inners(...ke("checkbox","Toggle Spiral",this.onSpiralToggle.bind(this))).get()),r=t.children[2],i=e.children[1];return a(i).evt("click",o=>{a(i).tcls("rotate-180"),a(r).tcls("collapsed")}),t}getAllAttachableViews(){return[this.buildOptions(),this.setSliderContainer("Pitch Factor",this.setSlider("pitch")),this.setSliderContainer("Speed Factor",this.setSlider("speed")),this.createAudioPermissionButton(),this.createFileSelectionButton()]}setSourceNode(e,t){this.sourceBuffer&&this.bufferSourceNode.disconnect();let r;e instanceof File?(r=new Audio(URL.createObjectURL(e)),r.onloadedmetadata=()=>this.totalTimer=r.duration):r=e;let i=this.audioService.useAudioContext().createMediaElementSource(r);return this.audioService.makeConnection(i),this.offsetTimer=0,i.mediaElement.play(),t?.playbackRate&&(i.mediaElement.playbackRate=t.playbackRate),[r,i]}onPlayerPausedOrResumed(e){this.audioService.paused?(this.audioService.resume(),a(this.playButton).innerHtml("\u23F8")):(this.audioService.pause(),a(this.playButton).innerHtml("\u25B6"))}setSliderContainer(e,...t){let r=U(e),i=a("div").mcls("bg-gray-600/50","rounded-sm","p-2","text-gray-200").inner([r,a("div").innerHtml("1.0"),a("div").mcls("flex","flex-col").inners(...t)]).get(),o=i.children[2],l=r.children[1];return a(l).evt("click",c=>{a(l).tcls("rotate-180"),a(o).tcls("collapsed")}),i}setSliderValue(e){let t=e.target,r=t.parentElement?.parentElement;switch(r.children[1].innerHTML=t.value.toString(),t.getAttribute("data-change")){case"pitch":this.audioService.changePitchFactor(parseFloat(t.value));break;case"speed":this.bufferSourceNode.mediaElement.playbackRate=parseFloat(t.value);break}}setSlider(e){return a("input").attr("type","range").attr("data-change",e).attr("min","0.6").attr("max","1.4").attr("value","1").attr("step","0.01").evt("input",this.setSliderValue.bind(this)).get()}setTitle(e){if(e.font="bold "+this.fontSize+"px Helvetica Neue",e.fillStyle=this.textColor,e.fillText("Playing Now:",30,100),e.font=this.fontSize+"px Helvetica Neue",e.fillStyle=this.textColor,e.fillText(this.fileName??"None (Drag and Drop .mp3/.wav file.)",30,100+this.fontSize+10),this.audioService.audioContext){let t=100+this.fontSize+10;e.font="300 "+this.fontSize+"px Helvetica Neue",e.fillStyle=this.textColor;let r=this.sourceBuffer.currentTime;e.fillText(v.timerSec(r),30,t+this.fontSize+10),e.fillStyle=this.backColor}}getView(){return this.mainDOM}initializeAudio(...e){return a("div").mcls("eq","relative").inners(...e).get()}moveSeekbarClick(e){let t=e.offsetX/this.seekbarLength*this.totalTimer;this.sourceBuffer.currentTime=t,this.sourceBuffer.paused&&this.sourceBuffer.play(),cancelAnimationFrame(this.seekbarAnimationFrame),a(this.seekBarThumb).styleAttr({width:e.offsetX+"px"}),this.requestSeekbarAnimation()}constructSeekbar(){let e=document.documentElement.clientWidth;this.seekbarLength=e-50;let t=a("span").mcls("seekbar-thumb","block","relative","bg-gray-100","rounded-[8px]","w-2","h-2","min-w-2","min-h-2","self-center").mcls("transition-all","duration-[40ms]").get(),r=a("button").mcls("bg-gray-600/80","hover:bg-gray-500","w-12","h-12","mt-4","rounded-[15px]").mcls("transition-transform","duration-200","ease-in","text-[20px]","text-gray-100").innerHtml("\u25B6").evt("click",this.onPlayerPausedOrResumed.bind(this)).get(),i=a("div").mcls("seekbar","absolute","min-h-32","rounded-t-[3rem]","bg-gray-700/40","flex","self-center","align-center").mcls("backdrop-blur-[5px]","shadow-md","transition-shadow","duration-100","hover:shadow-lg","flex","flex-col").styleAttr({bottom:"0",left:"25px"}).inner([a("div").mcls("tracker","bg-gray-400/60","w-avail","max-h-2","min-h-2","mt-8","rounded-md","mx-4").mcls("cursor-pointer").inner([t]).evt("click",this.moveSeekbarClick.bind(this)),a("div").mcls("flex","flex-col","self-center").inners(r)]).get();return[t,r,i]}onOptionSelected(e){let r=e.target.getAttribute("data-type");r!==this.currentMode&&(cancelAnimationFrame(this.animationFrame),this.changeMode(r))}onEqStyleSelected(e){let r=e.target.getAttribute("data-type");r!==this.lineType&&(cancelAnimationFrame(this.animationFrame),this.lineType=r,this.changeMode(this.currentMode))}constructOptions(){return a("div").mcls("options","flex","flex-col","transition-all","duration-200","ease-in-out").inner(["Bar","Bar Mirrored","Bar Circle","Wave Circle","Circle Spike","Wave"].map(e=>a("button").mcls("border-0","hover:bg-gray-100/30","rounded-[3px]").mcls("text-gray-100","p-2").attr("data-type",e).evt("click",this.onOptionSelected.bind(this)).innerText(e).get())).get()}buildOptions(){let e=U("Visualizer Type"),t=oe(e,this.constructOptions()),r=t.children[1],i=e.children[1];return a(i).evt("click",o=>{a(i).tcls("rotate-180"),a(r).mtcls("collapsed")}),t}resetOffscreenCanvas(e,t){e.width=document.documentElement.clientWidth,e.height=document.documentElement.clientHeight,this.resetCanvas(t)}resetCanvas(e){this.width=document.documentElement.clientWidth,this.height=document.documentElement.clientHeight,e.fillStyle=this.backColor,e.fillRect(0,0,this.width,this.height),e instanceof OffscreenCanvasRenderingContext2D||this.setTitle(e),e.strokeStyle=this.textColor}buildCanvas(e="2d"){this.width=document.documentElement.clientWidth,this.height=document.documentElement.clientHeight;let t=a("canvas").mcls("wave").attr("width",this.width.toString()).attr("height",this.height.toString()).get(),r=t.getContext(e);return{canvas:t,canvasContext:r}}initializeAnalyzerWave(){this.analyser&&this.analyser.disconnect(),this.fftSize=16384;let e=this.audioService.useAudioContext().createAnalyser();return e.fftSize=this.fftSize,this.bufferLength=e.frequencyBinCount,this.buffer=new Uint8Array(e.frequencyBinCount),e.getByteTimeDomainData(this.buffer),this.audioService.connectAudioWorkletNodeTo(e),e}setBufferSize(){return this.audioService.useAudioContext().sampleRate/2/this.bufferLength}initializeAnalyzerBar(){this.analyser&&this.analyser.disconnect(),this.fftSize=4096;let e=this.audioService.useAudioContext().createAnalyser();return e.fftSize=this.fftSize,this.bufferLength=e.frequencyBinCount,this.frequencyBuffer=new Float32Array(e.frequencyBinCount),this.frequencyIncr=this.setBufferSize(),e.getFloatFrequencyData(this.frequencyBuffer),this.audioService.connectAudioWorkletNodeTo(e),e}setFps(){let e=performance.now();a(this.fps).innerHtml(`${Math.round(1e3/(e-this.prevTimer))} FPS`),this.prevTimer=e}setResize(){let e=document.documentElement.clientWidth,t=document.documentElement.clientHeight;this.seekbarLength=e-100,this.canvasAction.draw.forEach(r=>r.resize(e,t)),a(this.canvas).mcls("wave").attr("width",e.toString()).attr("height",t.toString()).get(),this.offscreenCanvas.width=e,this.offscreenCanvas.height=t,this.width=e,this.height=t,this.resetCanvas(this.canvasContext)}moveSeekbar(){let t=this.sourceBuffer.currentTime/this.totalTimer*this.seekbarLength;a(this.seekBarThumb).styleAttr({width:t+"px"})}seekbarAnimation(){this.moveSeekbar()}requestSeekbarAnimation(){return this.seekbarAnimation(),this.seekbarAnimationFrame=requestAnimationFrame(this.requestSeekbarAnimation.bind(this)),this.seekbarAnimationFrame}requestAnimation(){return this.setFps(),(this.canvas.width!==document.documentElement.clientWidth||this.canvas.height!==document.documentElement.clientHeight)&&this.setResize(),this.resetCanvas(this.canvasContext),this.resetCanvas(this.offContext),this.setTitle(this.offContext),G(this.offContext,this.canvasAction.draw),this.canvasContext.drawImage(this.offscreenCanvas,0,0),this.canvasContext.stroke(),this.animationFrame=requestAnimationFrame(this.requestAnimation.bind(this)),this.animationFrame}changeMode(e){this.currentMode=e;let t=(r,i)=>{let o=r.draw.findIndex(({drawKind:l})=>l==="eq");o>-1?r.draw[o]=i:r.draw.push(i)};switch(this.currentMode){case"Bar":case"Bar Mirrored":{this.analyser=this.initializeAnalyzerBar();let r=Object.assign(K(this.frequencyIncr,this.currentMode==="Bar Mirrored"),{isReflective:!0,drawKind:"eq",analyser:this.analyser,buffer:this.frequencyBuffer,width:this.width,height:this.height});t(this.canvasAction,r);break}case"Wave":{this.analyser=this.initializeAnalyzerWave();let r=Object.assign(J(),{drawKind:"eq",analyser:this.analyser,buffer:this.buffer,width:this.width,height:this.height});t(this.canvasAction,r);break}case"Wave Circle":case"Circle Spike":{this.analyser=this.initializeAnalyzerBar();let r=Object.assign(X(this.frequencyIncr,this.currentMode==="Circle Spike"),{drawKind:"eq",analyser:this.analyser,buffer:this.frequencyBuffer});t(this.canvasAction,r);break}case"Bar Circle":case"Bar Circle Mirrored":{this.analyser=this.initializeAnalyzerBar();let r=Object.assign(Q(this.frequencyIncr,this.currentMode==="Bar Circle Mirrored"),{drawKind:"eq",analyser:this.analyser,buffer:this.frequencyBuffer});t(this.canvasAction,r);break}default:break}this.run()}run(){return this.animationFrame&&(cancelAnimationFrame(this.animationFrame),cancelAnimationFrame(this.seekbarAnimationFrame)),this.audioService.isPaused()?0:(this.requestSeekbarAnimation(),this.requestAnimation())}};function Se(){(localStorage.theme==="dark"||!("theme"in localStorage)&&window.matchMedia&&window?.matchMedia("(prefers-color-scheme: dark)").matches)&&(document.documentElement.classList.add("dark"),localStorage.theme="dark"),document.documentElement.classList.add("dark"),localStorage.theme="dark"}window.onload=async()=>{Se();let e=await(await fetch("./wasm_fft_bg.wasm")).arrayBuffer();var t=new N;t.createSubscription("onbodyload");var r=new R(t,e);let i=new P(t),o=new z(r,t),l=new W(t);l.attachViews(o.getAllAttachableViews()),l.attachViews(i.getAllAttachableViews());let c=m=>{if(m.preventDefault(),m.dataTransfer?.files){let x=m.dataTransfer.files[0];o.setSourceFile(x)}},s=m=>{m.preventDefault()},u=m=>{o.setResize()},h=a("div").mcls("main-content").inner([o.getView(),l.getView()]).evt("drop",c).evt("dragover",s).get(),d=m=>{switch(m.code){case"Space":m.preventDefault(),m.stopPropagation(),o.onPlayerPausedOrResumed();break}},f=m=>{switch(m.code){case"ControlLeft":a(l.getView()).tcls("hidden");break}};window.addEventListener("resize",m=>u(m)),a(document.body).mcls("w-avail","h-avail").evt("keydown",d).evt("keyup",f).evt("dragover",s).evt("drop",c).evt("resize",u).inner([a("div").mcls("application","flex","flex-col").inners(h).get()]),t.fire("onbodyload")};})();
