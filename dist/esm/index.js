import{GraphQLClient as V}from"graphql-request";import*as c from"gql-query-builder";import q from"pluralize";import p from"camelcase";var F=(u,o)=>u.map(e=>e==null?void 0:e.id).filter(e=>!!e).indexOf(o==null?void 0:o.id)!==-1,j=(u,o)=>{let e=u.filter(n=>!(n!=null&&n.id)),s=u.filter(n=>!!(n!=null&&n.id)),r=o.filter(n=>!F(u,n));return{create:e,update:s,delete:r}},O=(u,o)=>Object.entries(u).reduce((e,[s,r])=>({...e,[s]:{...j(r,o[s])}}),{}),h=(u,o)=>Object.entries(u).filter(([e,s])=>o.indexOf(e)!==-1).reduce((e,[s,r])=>({...e,[s]:r}),{}),w=(u,o)=>Object.entries(u).filter(([e,s])=>o.indexOf(e)===-1).reduce((e,[s,r])=>({...e,[s]:r}),{}),N=u=>Object.entries(u).reduce((o,[e,s])=>({...o,[e]:{create:s}}),{}),I=(u=[])=>u.map(e=>e!=null&&e.field&&(e!=null&&e.order)?{[e==null?void 0:e.field]:e==null?void 0:e.order}:null).filter(e=>!!e),B=(u=[],o=[],e=[])=>(console.log("props from filters....",u),u.reduce((r,n)=>{if(n.operator!=="or"&&n.operator!=="and"&&"field"in n){let{field:t,operator:a,value:i}=n;if(console.log(a,i,"nestedFieldsNames",o),a==="in"&&e.indexOf(t)!==-1)return{...r,[t]:{some:{id:{in:i.map(l=>Number(l))}}}};if(a==="in"&&o.indexOf(t)!==-1)return{...r,[t]:{is:{id:{in:i.map(l=>Number(l))}}}};if(a==="eq"&&e.indexOf(t)!==-1)return{...r,[t]:{some:{id:{equals:Number(i)}}}};if(a==="eq"&&o.indexOf(t)!==-1)return{...r,[t]:{is:{id:{equals:Number(i)}}}};if(a==="eq"&&o.indexOf(t)===-1&&e.indexOf(t)!==-1)return{...r,[t]:{equals:i}};if(["lt","gt","lte","gte"].indexOf(a)!==-1)return{...r,[t]:{[a]:i}}}return{...r}},{}));var E=u=>({getList:async o=>{let{resource:e,pagination:s,sorters:r,filters:n,meta:t}=o,a=q.singular(e),{current:i,pageSize:l,mode:d="server"}=s??{},y=I(r),g=B(n,t==null?void 0:t.nestedFieldsNames,t==null?void 0:t.nestedListFieldsNames),b=p(a,{pascalCase:!0});console.log("props ?????;;;;;",o);let f=q(b),R=`all${f}`,v=`_all${f}Meta`,{query:P,variables:$}=c.query([{operation:R,variables:{where:{value:g,type:`${b}WhereInput`},orderBy:{value:y,type:`[${b}OrderByWithRelationInput!]`},page:{value:Number(i||1),required:!1,type:"Float"},perPage:{value:Number(l||10),required:!1,type:"Float"}},fields:(t==null?void 0:t.fields)||[]},{operation:v,variables:{where:{value:g,type:`${b}WhereInput`}},fields:["count"]}]),x=await u.request(P,$);return console.log("response[operation2].count",x[v].count),{data:x[R],total:Number(x[v].count)}},getMany:async({resource:o,ids:e,meta:s})=>{let r=q.singular(o),t=`all${p(r,{pascalCase:!0})}`,{query:a,variables:i}=c.query({operation:t,variables:{where:{value:{id_in:e}}},fields:s==null?void 0:s.fields});return{data:(await u.request(a,i))[t]}},create:async({resource:o,variables:e,meta:s})=>{let r=q.singular(o),n=p(r,{pascalCase:!0}),t=p(`create${n}`),a=(s==null?void 0:s.operation)??t,i=(s==null?void 0:s.nestedFieldsNames)||[],l=h(e,i),d=N(l),y=w(e,i),{query:g,variables:b}=c.mutation({operation:a,variables:{createInput:{value:{...y,...d},type:`${n}CreateInput!`}},fields:s==null?void 0:s.fields});return{data:(await u.request(g,b))[a][r]}},createMany:async({resource:o,variables:e,meta:s})=>{let r=q.singular(o),n=p(`create${r}`),t=(s==null?void 0:s.operation)??n;return{data:await Promise.all(e.map(async i=>{let{query:l,variables:d}=c.mutation({operation:t,variables:{input:{value:{data:i},type:`${n}Input`}},fields:(s==null?void 0:s.fields)??[{operation:r,fields:["id"],variables:{}}]});return(await u.request(l,d))[t][r]}))}},update:async({resource:o,id:e,variables:s,meta:r})=>{let n=q.singular(o),t=p(n,{pascalCase:!0}),a=p(`update${t}`),i=(r==null?void 0:r.operation)??a,l={},d=(r==null?void 0:r.nestedFieldsNames)||[],y=h(s,d),g=O(y,l),b=w(s,d),{query:f,variables:R}=c.mutation({operation:i,variables:{id:{value:Number(e),type:"Int!"},updateInput:{value:{...b,...g},type:`${t}UpdateInput!`}},fields:["id"]});return{data:(await u.request(f,R))[i][n]}},updateMany:async({resource:o,ids:e,variables:s,meta:r})=>{let n=q.singular(o),t=p(n,{pascalCase:!0}),a=p(`update${t}`),i=(r==null?void 0:r.operation)??a;return{data:await Promise.all(e.map(async d=>{let{query:y,variables:g}=c.mutation({operation:i,variables:{id:{value:Number(d),type:"Int!"},updateInput:{value:{...s},type:`${t}UpdateInput!`}},fields:["id"]});return(await u.request(y,g))[i][n]}))}},getOne:async({resource:o,id:e,meta:s})=>{let r=q.singular(o),t=p(r,{pascalCase:!0}),{query:a,variables:i}=c.query({operation:t,variables:{id:{value:Number(e),type:"Int!"}},fields:(s==null?void 0:s.fields)||["id"]});return{data:(await u.request(a,i))[t]}},deleteOne:async({resource:o,id:e,meta:s})=>{let r=q.singular(o),n=p(r,{pascalCase:!0}),t=p(`delete${n}`),a=(s==null?void 0:s.operation)??t,{query:i,variables:l}=c.mutation({operation:a,variables:{id:{value:Number(e),type:"Int!"}},fields:["id"]});return{data:(await u.request(i,l))[a][r]}},deleteMany:async({resource:o,ids:e,meta:s})=>{let r=q.singular(o),n=p(r,{pascalCase:!0}),t=p(`delete${n}`),a=(s==null?void 0:s.operation)??t;return{data:await Promise.all(e.map(async l=>{let{query:d,variables:y}=c.mutation({operation:a,variables:{id:{value:Number(l),type:"Int!"}},fields:["id"]});return(await u.request(d,y))[a][r]}))}},getApiUrl:()=>{throw Error("Not implemented on refine-graphql data provider.")},custom:async({url:o,method:e,headers:s,meta:r})=>{let n=u;if(o&&(n=new V(o,{headers:s})),r)if(r.operation)if(e==="get"){let{query:t,variables:a}=c.query({operation:r.operation,fields:r.fields,variables:r.variables});return{data:(await n.request(t,a))[r.operation]}}else{let{query:t,variables:a}=c.mutation({operation:r.operation,fields:r.fields,variables:r.variables});return{data:(await n.request(t,a))[r.operation]}}else throw Error("GraphQL operation name required.");else throw Error("GraphQL need to operation, fields and variables values in meta object.")}}),C=E;import{GraphQLClient as A,batchRequests as T,gql as k,rawRequest as H,request as K,resolveRequestDocument as X}from"graphql-request";import*as Y from"gql-query-builder";var S=C;export{A as GraphQLClient,T as batchRequests,j as createDeleteUpdateFields,N as createNestedInput,S as default,w as excludePropsFomObj,I as generateSort,B as generateWherePropFromFilters,k as gql,h as includeJustPropsFromObj,Y as qqlQueryBuilder,H as rawRequest,K as request,X as resolveRequestDocument,O as updateNestedInput};
//# sourceMappingURL=index.js.map