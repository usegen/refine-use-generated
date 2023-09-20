import{GraphQLClient as E}from"graphql-request";import*as c from"gql-query-builder";import q from"pluralize";import p from"camelcase";var F=(n,t)=>n.map(e=>e==null?void 0:e.id).filter(e=>!!e).indexOf(t==null?void 0:t.id)!==-1,j=n=>{let{id:t,...e}=n;return{data:{...e},where:{id:Number(t)}}},V=(n,t)=>{if(console.log("currentData...",n),console.log("initialData...",t),Array.isArray(n)){let e=n.filter(a=>!(a!=null&&a.id)),s=n.filter(a=>!!(a!=null&&a.id)).map(j),r=(t||[]).filter(a=>!F(n,a));return{create:e,update:s,delete:r}}return console.log("currentData .....",n),Object.keys(n).length===1&&(n!=null&&n.id)?{connect:{id:Number(n==null?void 0:n.id)}}:{}},N=(n,t={})=>Object.entries(n).reduce((e,[s,r])=>({...e,[s]:{...V(r,null)}}),{}),h=(n,t)=>Object.entries(n).filter(([e,s])=>t.indexOf(e)!==-1).reduce((e,[s,r])=>({...e,[s]:r}),{}),x=(n,t)=>Object.entries(n).filter(([e,s])=>t.indexOf(e)===-1).reduce((e,[s,r])=>({...e,[s]:r}),{}),O=n=>Object.entries(n).reduce((t,[e,s])=>({...t,[e]:{create:s}}),{}),I=(n=[])=>n.map(e=>e!=null&&e.field&&(e!=null&&e.order)?{[e==null?void 0:e.field]:e==null?void 0:e.order}:null).filter(e=>!!e),B=(n=[],t=[],e=[])=>(console.log("props from filters....",n),n.reduce((r,a)=>{if(a.operator!=="or"&&a.operator!=="and"&&"field"in a){let{field:o,operator:u,value:i}=a;if(console.log(u,i,"nestedFieldsNames",t),u==="in"&&e.indexOf(o)!==-1)return{...r,[o]:{some:{id:{in:i.map(l=>Number(l))}}}};if(u==="in"&&t.indexOf(o)!==-1)return{...r,[o]:{is:{id:{in:i.map(l=>Number(l))}}}};if(u==="eq"&&e.indexOf(o)!==-1)return{...r,[o]:{some:{id:{equals:Number(i)}}}};if(u==="eq"&&t.indexOf(o)!==-1)return{...r,[o]:{is:{id:{equals:Number(i)}}}};if(u==="eq"&&t.indexOf(o)===-1&&e.indexOf(o)!==-1)return{...r,[o]:{equals:i}};if(["lt","gt","lte","gte"].indexOf(u)!==-1)return{...r,[o]:{[u]:i}}}return{...r}},{}));var U=n=>({getList:async t=>{let{resource:e,pagination:s,sorters:r,filters:a,meta:o}=t,u=q.singular(e),{current:i,pageSize:l,mode:d="server"}=s??{},y=I(r),g=(o==null?void 0:o.where)||B(a,o==null?void 0:o.nestedFieldsNames,o==null?void 0:o.nestedListFieldsNames),b=p(u,{pascalCase:!0}),f=q(b),R=`all${f}`,v=`_all${f}Meta`,{query:P,variables:$}=c.query([{operation:R,variables:{where:{value:g,type:`${b}WhereInput`},orderBy:{value:y,type:`[${b}OrderByWithRelationInput!]`},page:{value:Number(i||1),required:!1,type:"Float"},perPage:{value:Number(l||10),required:!1,type:"Float"}},fields:(o==null?void 0:o.fields)||[]},{operation:v,variables:{where:{value:g,type:`${b}WhereInput`}},fields:["count"]}]),w=await n.request(P,$);return{data:w[R],total:Number(w[v].count)}},getMany:async({resource:t,ids:e,meta:s})=>{let r=q.singular(t),o=`all${p(r,{pascalCase:!0})}`,{query:u,variables:i}=c.query({operation:o,variables:{where:{value:{id_in:e}}},fields:s==null?void 0:s.fields});return{data:(await n.request(u,i))[o]}},create:async({resource:t,variables:e,meta:s})=>{let r=q.singular(t),a=p(r,{pascalCase:!0}),o=p(`create${a}`),u=(s==null?void 0:s.operation)??o,i=(s==null?void 0:s.nestedFieldsNames)||[],l=h(e,i),d=O(l),y=x(e,i),{query:g,variables:b}=c.mutation({operation:u,variables:{createInput:{value:{...y,...d},type:`${a}CreateInput!`}},fields:s==null?void 0:s.fields});return{data:(await n.request(g,b))[u][r]}},createMany:async({resource:t,variables:e,meta:s})=>{let r=q.singular(t),a=p(`create${r}`),o=(s==null?void 0:s.operation)??a;return{data:await Promise.all(e.map(async i=>{let{query:l,variables:d}=c.mutation({operation:o,variables:{input:{value:{data:i},type:`${a}Input`}},fields:(s==null?void 0:s.fields)??[{operation:r,fields:["id"],variables:{}}]});return(await n.request(l,d))[o][r]}))}},update:async({resource:t,id:e,variables:s,meta:r})=>{let a=q.singular(t),o=p(a,{pascalCase:!0}),u=p(`update${o}`),i=(r==null?void 0:r.operation)??u,l={},d=(r==null?void 0:r.nestedFieldsNames)||[],y=h(s,d),g=N(y,l),b=x(s,d),{query:f,variables:R}=c.mutation({operation:i,variables:{id:{value:Number(e),type:"Int!"},updateInput:{value:{...b,...g},type:`${o}UpdateInput!`}},fields:["id"]});return{data:(await n.request(f,R))[i][a]}},updateMany:async({resource:t,ids:e,variables:s,meta:r})=>{let a=q.singular(t),o=p(a,{pascalCase:!0}),u=p(`update${o}`),i=(r==null?void 0:r.operation)??u;return{data:await Promise.all(e.map(async d=>{let{query:y,variables:g}=c.mutation({operation:i,variables:{id:{value:Number(d),type:"Int!"},updateInput:{value:{...s},type:`${o}UpdateInput!`}},fields:["id"]});return(await n.request(y,g))[i][a]}))}},getOne:async({resource:t,id:e,meta:s})=>{let r=q.singular(t),o=p(r,{pascalCase:!0}),{query:u,variables:i}=c.query({operation:o,variables:{id:{value:Number(e),type:"Int!"}},fields:(s==null?void 0:s.fields)||["id"]});return{data:(await n.request(u,i))[o]}},deleteOne:async({resource:t,id:e,meta:s})=>{let r=q.singular(t),a=p(r,{pascalCase:!0}),o=p(`delete${a}`),u=(s==null?void 0:s.operation)??o,{query:i,variables:l}=c.mutation({operation:u,variables:{id:{value:Number(e),type:"Int!"}},fields:["id"]});return{data:(await n.request(i,l))[u][r]}},deleteMany:async({resource:t,ids:e,meta:s})=>{let r=q.singular(t),a=p(r,{pascalCase:!0}),o=p(`delete${a}`),u=(s==null?void 0:s.operation)??o;return{data:await Promise.all(e.map(async l=>{let{query:d,variables:y}=c.mutation({operation:u,variables:{id:{value:Number(l),type:"Int!"}},fields:["id"]});return(await n.request(d,y))[u][r]}))}},getApiUrl:()=>{throw Error("Not implemented on refine-graphql data provider.")},custom:async({url:t,method:e,headers:s,meta:r})=>{let a=n;if(t&&(a=new E(t,{headers:s})),r)if(r.operation)if(e==="get"){let{query:o,variables:u}=c.query({operation:r.operation,fields:r.fields,variables:r.variables});return{data:(await a.request(o,u))[r.operation]}}else{let{query:o,variables:u}=c.mutation({operation:r.operation,fields:r.fields,variables:r.variables});return{data:(await a.request(o,u))[r.operation]}}else throw Error("GraphQL operation name required.");else throw Error("GraphQL need to operation, fields and variables values in meta object.")}}),C=U;import{GraphQLClient as T,batchRequests as H,gql as K,rawRequest as X,request as Y,resolveRequestDocument as Z}from"graphql-request";import*as m from"gql-query-builder";var A=C;export{T as GraphQLClient,H as batchRequests,V as createDeleteUpdateFields,O as createNestedInput,A as default,x as excludePropsFomObj,I as generateSort,B as generateWherePropFromFilters,K as gql,h as includeJustPropsFromObj,m as qqlQueryBuilder,X as rawRequest,Y as request,Z as resolveRequestDocument,N as updateNestedInput};
//# sourceMappingURL=index.js.map