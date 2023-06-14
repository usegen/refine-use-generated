(()=>{var _=Object.create;var H=Object.defineProperty;var G=Object.getOwnPropertyDescriptor;var J=Object.getOwnPropertyNames;var k=Object.getPrototypeOf,K=Object.prototype.hasOwnProperty;var h=(s=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(s,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):s)(function(s){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+s+'" is not supported')});var X=(s,t,r,e)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of J(t))!K.call(s,n)&&n!==r&&H(s,n,{get:()=>t[n],enumerable:!(e=G(t,n))||e.enumerable});return s};var x=(s,t,r)=>(r=s!=null?_(k(s)):{},X(t||!s||!s.__esModule?H(r,"default",{value:s,enumerable:!0}):r,s));var M=x(h("./createRequestBody.js"),1),A=h("./defaultJsonSerializer.js"),I=h("./helpers.js"),w=h("./parseArgs.js"),m=h("./resolveRequestDocument.js"),W=h("./types.js"),C=x(h("cross-fetch"),1),ae=h("./graphql-ws.js"),U=h("./resolveRequestDocument.js");var N=s=>{let t={};return s&&(typeof Headers<"u"&&s instanceof Headers||C&&C.Headers&&s instanceof C.Headers?t=(0,I.HeadersInstanceToPlainObject)(s):Array.isArray(s)?s.forEach(([r,e])=>{r&&e!==void 0&&(t[r]=e)}):t=s),t},S=s=>s.replace(/([\s,]|#[^\n\r]+)+/g," ").trim(),Y=s=>{if(!Array.isArray(s.query)){let e=s,n=[`query=${encodeURIComponent(S(e.query))}`];return s.variables&&n.push(`variables=${encodeURIComponent(e.jsonSerializer.stringify(e.variables))}`),e.operationName&&n.push(`operationName=${encodeURIComponent(e.operationName)}`),n.join("&")}if(typeof s.variables<"u"&&!Array.isArray(s.variables))throw new Error("Cannot create query with given variable type, array expected");let t=s,r=s.query.reduce((e,n,i)=>(e.push({query:S(n),variables:t.variables?t.jsonSerializer.stringify(t.variables[i]):void 0}),e),[]);return`query=${encodeURIComponent(t.jsonSerializer.stringify(r))}`},Z=s=>async t=>{let{url:r,query:e,variables:n,operationName:i,fetch:o,fetchOptions:a,middleware:u}=t,l={...t.headers},c="",d;s==="POST"?(d=(0,M.default)(e,n,i,a.jsonSerializer),typeof d=="string"&&(l["Content-Type"]="application/json")):c=Y({query:e,variables:n,operationName:i,jsonSerializer:a.jsonSerializer??A.defaultJsonSerializer});let p={method:s,headers:l,body:d,...a},q=r,R=p;if(u){let y=await Promise.resolve(u({...p,url:r,operationName:i,variables:n})),{url:b,...P}=y;q=b,R=P}return c&&(q=`${q}?${c}`),await o(q,R)},O=class{constructor(t,r={}){this.url=t,this.requestConfig=r,this.rawRequest=async(...e)=>{let[n,i,o]=e,a=(0,w.parseRawRequestArgs)(n,i,o),{headers:u,fetch:l=C.default,method:c="POST",requestMiddleware:d,responseMiddleware:p,...q}=this.requestConfig,{url:R}=this;a.signal!==void 0&&(q.signal=a.signal);let{operationName:y}=(0,m.resolveRequestDocument)(a.query);return B({url:R,query:a.query,variables:a.variables,headers:{...N($(u)),...N(a.requestHeaders)},operationName:y,fetch:l,method:c,fetchOptions:q,middleware:d}).then(b=>(p&&p(b),b)).catch(b=>{throw p&&p(b),b})}}async request(t,...r){let[e,n]=r,i=(0,w.parseRequestArgs)(t,e,n),{headers:o,fetch:a=C.default,method:u="POST",requestMiddleware:l,responseMiddleware:c,...d}=this.requestConfig,{url:p}=this;i.signal!==void 0&&(d.signal=i.signal);let{query:q,operationName:R}=(0,m.resolveRequestDocument)(i.document);return B({url:p,query:q,variables:i.variables,headers:{...N($(o)),...N(i.requestHeaders)},operationName:R,fetch:a,method:u,fetchOptions:d,middleware:l}).then(y=>(c&&c(y),y.data)).catch(y=>{throw c&&c(y),y})}batchRequests(t,r){let e=(0,w.parseBatchRequestArgs)(t,r),{headers:n,...i}=this.requestConfig;e.signal!==void 0&&(i.signal=e.signal);let o=e.documents.map(({document:u})=>(0,m.resolveRequestDocument)(u).query),a=e.documents.map(({variables:u})=>u);return B({url:this.url,query:o,variables:a,headers:{...N($(n)),...N(e.requestHeaders)},operationName:void 0,fetch:this.requestConfig.fetch??C.default,method:this.requestConfig.method||"POST",fetchOptions:i,middleware:this.requestConfig.requestMiddleware}).then(u=>(this.requestConfig.responseMiddleware&&this.requestConfig.responseMiddleware(u),u.data)).catch(u=>{throw this.requestConfig.responseMiddleware&&this.requestConfig.responseMiddleware(u),u})}setHeaders(t){return this.requestConfig.headers=t,this}setHeader(t,r){let{headers:e}=this.requestConfig;return e?e[t]=r:this.requestConfig.headers={[t]:r},this}setEndpoint(t){return this.url=t,this}},B=async s=>{let{query:t,variables:r,fetchOptions:e}=s,n=Z((0,I.uppercase)(s.method??"post")),i=Array.isArray(s.query),o=await n(s),a=await ne(o,e.jsonSerializer??A.defaultJsonSerializer),u=Array.isArray(a)?!a.some(({data:c})=>!c):!!a.data,l=Array.isArray(a)||!a.errors||Array.isArray(a.errors)&&!a.errors.length||e.errorPolicy==="all"||e.errorPolicy==="ignore";if(o.ok&&l&&u){let{errors:c,...d}=(Array.isArray(a),a),p=e.errorPolicy==="ignore"?d:a;return{...i?{data:p}:p,headers:o.headers,status:o.status}}else{let c=typeof a=="string"?{error:a}:a;throw new W.ClientError({...c,status:o.status,headers:o.headers},{query:t,variables:r})}},ee=async(...s)=>{let[t,r,...e]=s,n=(0,w.parseRawRequestExtendedArgs)(t,r,...e);return new O(n.url).rawRequest({...n})};async function re(s,t,...r){let e=(0,w.parseRequestExtendedArgs)(s,t,...r);return new O(e.url).request({...e})}var se=async(...s)=>{let t=te(s);return new O(t.url).batchRequests(t)},te=s=>s.length===1?s[0]:{url:s[0],documents:s[1],requestHeaders:s[2],signal:void 0};var ne=async(s,t)=>{let r;return s.headers.forEach((e,n)=>{n.toLowerCase()==="content-type"&&(r=e)}),r&&(r.toLowerCase().startsWith("application/json")||r.toLowerCase().startsWith("application/graphql+json")||r.toLowerCase().startsWith("application/graphql-response+json"))?t.parse(await s.text()):s.text()},$=s=>typeof s=="function"?s():s,oe=(s,...t)=>s.reduce((r,e,n)=>`${r}${e}${n in t?t[n]:""}`,"");var g=x(h("gql-query-builder")),v=x(h("pluralize")),f=x(h("camelcase"));var ie=(s,t)=>s.map(r=>r==null?void 0:r.id).filter(r=>!!r).indexOf(t==null?void 0:t.id)!==-1,ue=(s,t)=>{let r=s.filter(i=>!(i!=null&&i.id)),e=s.filter(i=>!!(i!=null&&i.id)),n=t.filter(i=>!ie(s,i));return{create:r,update:e,delete:n}},z=(s,t)=>Object.entries(s).reduce((r,[e,n])=>({...r,[e]:{...ue(n,t[e])}}),{}),j=(s,t)=>Object.entries(s).filter(([r,e])=>t.indexOf(r)!==-1).reduce((r,[e,n])=>({...r,[e]:n}),{}),E=(s,t)=>Object.entries(s).filter(([r,e])=>t.indexOf(r)===-1).reduce((r,[e,n])=>({...r,[e]:n}),{}),D=s=>Object.entries(s).reduce((t,[r,e])=>({...t,[r]:{create:e}}),{}),L=(s=[])=>s.map(r=>r!=null&&r.field&&(r!=null&&r.order)?{[r==null?void 0:r.field]:r==null?void 0:r.order}:null).filter(r=>!!r),V=(s=[],t=[],r=[])=>(console.log("props from filters....",s),s.reduce((n,i)=>{if(i.operator!=="or"&&i.operator!=="and"&&"field"in i){let{field:o,operator:a,value:u}=i;if(console.log(a,u,"nestedFieldsNames",t),a==="in"&&r.indexOf(o)!==-1)return{...n,[o]:{some:{id:{in:u.map(l=>Number(l))}}}};if(a==="in"&&t.indexOf(o)!==-1)return{...n,[o]:{is:{id:{in:u.map(l=>Number(l))}}}};if(a==="eq"&&r.indexOf(o)!==-1)return{...n,[o]:{some:{id:{equals:Number(u)}}}};if(a==="eq"&&t.indexOf(o)!==-1)return{...n,[o]:{is:{id:{equals:Number(u)}}}};if(a==="eq"&&t.indexOf(o)===-1&&r.indexOf(o)!==-1)return{...n,[o]:{equals:u}};if(["lt","gt","lte","gte"].indexOf(a)!==-1)return{...n,[o]:{[a]:u}}}return{...n}},{}));var ce=s=>({getList:async t=>{let{resource:r,pagination:e,sorters:n,filters:i,meta:o}=t,a=v.default.singular(r),{current:u,pageSize:l,mode:c="server"}=e??{},d=L(n),p=V(i,o==null?void 0:o.nestedFieldsNames,o==null?void 0:o.nestedListFieldsNames),q=(0,f.default)(a,{pascalCase:!0}),R=(0,v.default)(q),y=`all${R}`,b=`_all${R}Meta`,{query:P,variables:T}=g.query([{operation:y,variables:{where:{value:p,type:`${q}WhereInput`},orderBy:{value:d,type:`[${q}OrderByWithRelationInput!]`},page:{value:Number(u||1),required:!1,type:"Float"},perPage:{value:Number(l||10),required:!1,type:"Float"}},fields:(o==null?void 0:o.fields)||[]},{operation:b,variables:{where:{value:p,type:`${q}WhereInput`}},fields:["count"]}]),F=await s.request(P,T);return{data:F[y],total:Number(F[b].count)}},getMany:async({resource:t,ids:r,meta:e})=>{let n=v.default.singular(t),o=`all${(0,f.default)(n,{pascalCase:!0})}`,{query:a,variables:u}=g.query({operation:o,variables:{where:{value:{id_in:r}}},fields:e==null?void 0:e.fields});return{data:(await s.request(a,u))[o]}},create:async({resource:t,variables:r,meta:e})=>{let n=v.default.singular(t),i=(0,f.default)(n,{pascalCase:!0}),o=(0,f.default)(`create${i}`),a=(e==null?void 0:e.operation)??o,u=(e==null?void 0:e.nestedFieldsNames)||[],l=j(r,u),c=D(l),d=E(r,u),{query:p,variables:q}=g.mutation({operation:a,variables:{createInput:{value:{...d,...c},type:`${i}CreateInput!`}},fields:e==null?void 0:e.fields});return{data:(await s.request(p,q))[a][n]}},createMany:async({resource:t,variables:r,meta:e})=>{let n=v.default.singular(t),i=(0,f.default)(`create${n}`),o=(e==null?void 0:e.operation)??i;return{data:await Promise.all(r.map(async u=>{let{query:l,variables:c}=g.mutation({operation:o,variables:{input:{value:{data:u},type:`${i}Input`}},fields:(e==null?void 0:e.fields)??[{operation:n,fields:["id"],variables:{}}]});return(await s.request(l,c))[o][n]}))}},update:async({resource:t,id:r,variables:e,meta:n})=>{let i=v.default.singular(t),o=(0,f.default)(i,{pascalCase:!0}),a=(0,f.default)(`update${o}`),u=(n==null?void 0:n.operation)??a,l={},c=(n==null?void 0:n.nestedFieldsNames)||[],d=j(e,c),p=z(d,l),q=E(e,c),{query:R,variables:y}=g.mutation({operation:u,variables:{id:{value:Number(r),type:"Int!"},updateInput:{value:{...q,...p},type:`${o}UpdateInput!`}},fields:["id"]});return{data:(await s.request(R,y))[u][i]}},updateMany:async({resource:t,ids:r,variables:e,meta:n})=>{let i=v.default.singular(t),o=(0,f.default)(i,{pascalCase:!0}),a=(0,f.default)(`update${o}`),u=(n==null?void 0:n.operation)??a;return{data:await Promise.all(r.map(async c=>{let{query:d,variables:p}=g.mutation({operation:u,variables:{id:{value:Number(c),type:"Int!"},updateInput:{value:{...e},type:`${o}UpdateInput!`}},fields:["id"]});return(await s.request(d,p))[u][i]}))}},getOne:async({resource:t,id:r,meta:e})=>{let n=v.default.singular(t),o=(0,f.default)(n,{pascalCase:!0}),{query:a,variables:u}=g.query({operation:o,variables:{id:{value:Number(r),type:"Int!"}},fields:(e==null?void 0:e.fields)||["id"]});return{data:(await s.request(a,u))[o]}},deleteOne:async({resource:t,id:r,meta:e})=>{let n=v.default.singular(t),i=(0,f.default)(n,{pascalCase:!0}),o=(0,f.default)(`delete${i}`),a=(e==null?void 0:e.operation)??o,{query:u,variables:l}=g.mutation({operation:a,variables:{id:{value:Number(r),type:"Int!"}},fields:["id"]});return{data:(await s.request(u,l))[a][n]}},deleteMany:async({resource:t,ids:r,meta:e})=>{let n=v.default.singular(t),i=(0,f.default)(n,{pascalCase:!0}),o=(0,f.default)(`delete${i}`),a=(e==null?void 0:e.operation)??o;return{data:await Promise.all(r.map(async l=>{let{query:c,variables:d}=g.mutation({operation:a,variables:{id:{value:Number(l),type:"Int!"}},fields:["id"]});return(await s.request(c,d))[a][n]}))}},getApiUrl:()=>{throw Error("Not implemented on refine-graphql data provider.")},custom:async({url:t,method:r,headers:e,meta:n})=>{let i=s;if(t&&(i=new O(t,{headers:e})),n)if(n.operation)if(r==="get"){let{query:o,variables:a}=g.query({operation:n.operation,fields:n.fields,variables:n.variables});return{data:(await i.request(o,a))[n.operation]}}else{let{query:o,variables:a}=g.mutation({operation:n.operation,fields:n.fields,variables:n.variables});return{data:(await i.request(o,a))[n.operation]}}else throw Error("GraphQL operation name required.");else throw Error("GraphQL need to operation, fields and variables values in meta object.")}}),Q=ce;var we=x(h("gql-query-builder")),ge=Q;})();
//# sourceMappingURL=index.js.map