function et(c){return c&&c.__esModule&&Object.prototype.hasOwnProperty.call(c,"default")?c.default:c}var H={exports:{}},n={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var z;function nt(){if(z)return n;z=1;var c=Symbol.for("react.transitional.element"),f=Symbol.for("react.portal"),y=Symbol.for("react.fragment"),_=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),h=Symbol.for("react.consumer"),T=Symbol.for("react.context"),R=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),A=Symbol.for("react.memo"),k=Symbol.for("react.lazy"),G=Symbol.for("react.activity"),O=Symbol.iterator;function Z(t){return t===null||typeof t!="object"?null:(t=O&&t[O]||t["@@iterator"],typeof t=="function"?t:null)}var x={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},b=Object.assign,L={};function v(t,e,o){this.props=t,this.context=e,this.refs=L,this.updater=o||x}v.prototype.isReactComponent={},v.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")},v.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function I(){}I.prototype=v.prototype;function M(t,e,o){this.props=t,this.context=e,this.refs=L,this.updater=o||x}var S=M.prototype=new I;S.constructor=M,b(S,v.prototype),S.isPureReactComponent=!0;var Y=Array.isArray;function $(){}var i={H:null,A:null,T:null,S:null},q=Object.prototype.hasOwnProperty;function j(t,e,o){var r=o.ref;return{$$typeof:c,type:t,key:e,ref:r!==void 0?r:null,props:o}}function X(t,e){return j(t.type,e,t.props)}function N(t){return typeof t=="object"&&t!==null&&t.$$typeof===c}function Q(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(o){return e[o]})}var U=/\/+/g;function P(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Q(""+t.key):e.toString(36)}function V(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then($,$):(t.status="pending",t.then(function(e){t.status==="pending"&&(t.status="fulfilled",t.value=e)},function(e){t.status==="pending"&&(t.status="rejected",t.reason=e)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function E(t,e,o,r,u){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"bigint":case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case c:case f:a=!0;break;case k:return a=t._init,E(a(t._payload),e,o,r,u)}}if(a)return u=u(t),a=r===""?"."+P(t,0):r,Y(u)?(o="",a!=null&&(o=a.replace(U,"$&/")+"/"),E(u,e,o,"",function(tt){return tt})):u!=null&&(N(u)&&(u=X(u,o+(u.key==null||t&&t.key===u.key?"":(""+u.key).replace(U,"$&/")+"/")+a)),e.push(u)),1;a=0;var d=r===""?".":r+":";if(Y(t))for(var p=0;p<t.length;p++)r=t[p],s=d+P(r,p),a+=E(r,e,o,s,u);else if(p=Z(t),typeof p=="function")for(t=p.call(t),p=0;!(r=t.next()).done;)r=r.value,s=d+P(r,p++),a+=E(r,e,o,s,u);else if(s==="object"){if(typeof t.then=="function")return E(V(t),e,o,r,u);throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.")}return a}function w(t,e,o){if(t==null)return t;var r=[],u=0;return E(t,r,"","",function(s){return e.call(o,s,u++)}),r}function J(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(o){(t._status===0||t._status===-1)&&(t._status=1,t._result=o)},function(o){(t._status===0||t._status===-1)&&(t._status=2,t._result=o)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var D=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},F={map:w,forEach:function(t,e,o){w(t,function(){e.apply(this,arguments)},o)},count:function(t){var e=0;return w(t,function(){e++}),e},toArray:function(t){return w(t,function(e){return e})||[]},only:function(t){if(!N(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};return n.Activity=G,n.Children=F,n.Component=v,n.Fragment=y,n.Profiler=C,n.PureComponent=M,n.StrictMode=_,n.Suspense=g,n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,n.__COMPILER_RUNTIME={__proto__:null,c:function(t){return i.H.useMemoCache(t)}},n.cache=function(t){return function(){return t.apply(null,arguments)}},n.cacheSignal=function(){return null},n.cloneElement=function(t,e,o){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var r=b({},t.props),u=t.key;if(e!=null)for(s in e.key!==void 0&&(u=""+e.key),e)!q.call(e,s)||s==="key"||s==="__self"||s==="__source"||s==="ref"&&e.ref===void 0||(r[s]=e[s]);var s=arguments.length-2;if(s===1)r.children=o;else if(1<s){for(var a=Array(s),d=0;d<s;d++)a[d]=arguments[d+2];r.children=a}return j(t.type,u,r)},n.createContext=function(t){return t={$$typeof:T,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:h,_context:t},t},n.createElement=function(t,e,o){var r,u={},s=null;if(e!=null)for(r in e.key!==void 0&&(s=""+e.key),e)q.call(e,r)&&r!=="key"&&r!=="__self"&&r!=="__source"&&(u[r]=e[r]);var a=arguments.length-2;if(a===1)u.children=o;else if(1<a){for(var d=Array(a),p=0;p<a;p++)d[p]=arguments[p+2];u.children=d}if(t&&t.defaultProps)for(r in a=t.defaultProps,a)u[r]===void 0&&(u[r]=a[r]);return j(t,s,u)},n.createRef=function(){return{current:null}},n.forwardRef=function(t){return{$$typeof:R,render:t}},n.isValidElement=N,n.lazy=function(t){return{$$typeof:k,_payload:{_status:-1,_result:t},_init:J}},n.memo=function(t,e){return{$$typeof:A,type:t,compare:e===void 0?null:e}},n.startTransition=function(t){var e=i.T,o={};i.T=o;try{var r=t(),u=i.S;u!==null&&u(o,r),typeof r=="object"&&r!==null&&typeof r.then=="function"&&r.then($,D)}catch(s){D(s)}finally{e!==null&&o.types!==null&&(e.types=o.types),i.T=e}},n.unstable_useCacheRefresh=function(){return i.H.useCacheRefresh()},n.use=function(t){return i.H.use(t)},n.useActionState=function(t,e,o){return i.H.useActionState(t,e,o)},n.useCallback=function(t,e){return i.H.useCallback(t,e)},n.useContext=function(t){return i.H.useContext(t)},n.useDebugValue=function(){},n.useDeferredValue=function(t,e){return i.H.useDeferredValue(t,e)},n.useEffect=function(t,e){return i.H.useEffect(t,e)},n.useEffectEvent=function(t){return i.H.useEffectEvent(t)},n.useId=function(){return i.H.useId()},n.useImperativeHandle=function(t,e,o){return i.H.useImperativeHandle(t,e,o)},n.useInsertionEffect=function(t,e){return i.H.useInsertionEffect(t,e)},n.useLayoutEffect=function(t,e){return i.H.useLayoutEffect(t,e)},n.useMemo=function(t,e){return i.H.useMemo(t,e)},n.useOptimistic=function(t,e){return i.H.useOptimistic(t,e)},n.useReducer=function(t,e,o){return i.H.useReducer(t,e,o)},n.useRef=function(t){return i.H.useRef(t)},n.useState=function(t){return i.H.useState(t)},n.useSyncExternalStore=function(t,e,o){return i.H.useSyncExternalStore(t,e,o)},n.useTransition=function(){return i.H.useTransition()},n.version="19.2.7",n}var B;function rt(){return B||(B=1,H.exports=nt()),H.exports}var m=rt();const Rt=et(m);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=c=>c.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ut=c=>c.replace(/^([A-Z])|[\s-_]+(\w)/g,(f,y,_)=>_?_.toUpperCase():y.toLowerCase()),K=c=>{const f=ut(c);return f.charAt(0).toUpperCase()+f.slice(1)},W=(...c)=>c.filter((f,y,_)=>!!f&&f.trim()!==""&&_.indexOf(f)===y).join(" ").trim(),st=c=>{for(const f in c)if(f.startsWith("aria-")||f==="role"||f==="title")return!0};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ct={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=m.forwardRef(({color:c="currentColor",size:f=24,strokeWidth:y=2,absoluteStrokeWidth:_,className:C="",children:h,iconNode:T,...R},g)=>m.createElement("svg",{ref:g,...ct,width:f,height:f,stroke:c,strokeWidth:_?Number(y)*24/Number(f):y,className:W("lucide",C),...!h&&!st(R)&&{"aria-hidden":"true"},...R},[...T.map(([A,k])=>m.createElement(A,k)),...Array.isArray(h)?h:[h]]));/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=(c,f)=>{const y=m.forwardRef(({className:_,...C},h)=>m.createElement(it,{ref:h,iconNode:f,className:W(`lucide-${ot(K(c))}`,`lucide-${c}`,_),...C}));return y.displayName=K(c),y};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],kt=l("calendar",at);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],wt=l("check",ft);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],Tt=l("chevron-down",pt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],gt=l("chevron-up",lt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],At=l("database",yt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],Mt=l("download",_t);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]],St=l("link",dt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],$t=l("printer",ht);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],jt=l("refresh-cw",vt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],Nt=l("search",Et);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],Pt=l("sparkles",mt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ct=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Ht=l("x",Ct);export{gt as C,Mt as D,St as L,$t as P,Rt as R,Pt as S,Ht as X,rt as a,At as b,Tt as c,jt as d,Nt as e,kt as f,wt as g,m as r};
