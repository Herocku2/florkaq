"use strict";(self.webpackChunkflorkafun_backend=self.webpackChunkflorkafun_backend||[]).push([[6612],{50515:(R,d,s)=>{s.d(d,{S:()=>o});var _=s(92132),a=s(90151),E=s(68074),i=s(83997),l=s(79739),P=s(30893),D=s(54894),M=s(71389),O=s(94929);const o=({providers:t,displayAllProviders:c})=>{const{formatMessage:m}=(0,D.A)();return c?(0,_.jsx)(a.x,{gap:4,children:t.map(n=>(0,_.jsx)(E.E,{col:4,children:(0,_.jsx)(r,{provider:n})},n.uid))}):t.length>2&&!c?(0,_.jsxs)(a.x,{gap:4,children:[t.slice(0,2).map(n=>(0,_.jsx)(E.E,{col:4,children:(0,_.jsx)(r,{provider:n})},n.uid)),(0,_.jsx)(E.E,{col:4,children:(0,_.jsx)(l.m,{label:m({id:"global.see-more"}),children:(0,_.jsx)(h,{as:M.N_,to:"/auth/providers",children:(0,_.jsx)("span",{"aria-hidden":!0,children:"\u2022\u2022\u2022"})})})})]}):(0,_.jsx)(e,{justifyContent:"center",children:t.map(n=>(0,_.jsx)(r,{provider:n},n.uid))})},e=(0,O.Ay)(i.s)`
  & a:not(:first-child):not(:last-child) {
    margin: 0 ${({theme:t})=>t.spaces[2]};
  }
  & a:first-child {
    margin-right: ${({theme:t})=>t.spaces[2]};
  }
  & a:last-child {
    margin-left: ${({theme:t})=>t.spaces[2]};
  }
`,r=({provider:t})=>(0,_.jsx)(l.m,{label:t.displayName,children:(0,_.jsx)(h,{href:`${window.strapi.backendURL}/admin/connect/${t.uid}`,children:t.icon?(0,_.jsx)("img",{src:t.icon,"aria-hidden":!0,alt:"",height:"32px"}):(0,_.jsx)(P.o,{children:t.displayName})})}),h=O.Ay.a`
  width: ${136/16}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${48/16}rem;
  border: 1px solid ${({theme:t})=>t.colors.neutral150};
  border-radius: ${({theme:t})=>t.borderRadius};
  text-decoration: inherit;
  &:link {
    text-decoration: none;
  }
  color: ${({theme:t})=>t.colors.neutral600};
`},86612:(R,d,s)=>{s.r(d),s.d(d,{LoginEE:()=>g});var _=s(92132),a=s(94061),E=s(48653),i=s(83997),l=s(30893),P=s(56445),D=s(54894),M=s(74930),O=s(94929),o=s(59057),e=s(50515),r=s(15126),h=s(63299),t=s(67014),c=s(59080),m=s(79275),n=s(14718),T=s(21272),U=s(82437),W=s(61535),K=s(5790),j=s(12083),f=s(41286),y=s(35223),u=s(5409),S=s(2600),$=s(48940);const L=(0,O.Ay)(E.c)`
  flex: 1;
`,g=A=>{const{formatMessage:v}=(0,D.A)(),{get:x}=(0,P.ry)(),{isLoading:B,data:C=[]}=(0,M.useQuery)(["ee","providers"],async()=>{const{data:I}=await x("/admin/providers");return I},{enabled:window.strapi.features.isEnabled(window.strapi.features.SSO)});return!window.strapi.features.isEnabled(window.strapi.features.SSO)||!B&&C.length===0?(0,_.jsx)(o.L,{...A}):(0,_.jsx)(o.L,{...A,children:(0,_.jsx)(a.a,{paddingTop:7,children:(0,_.jsxs)(i.s,{direction:"column",alignItems:"stretch",gap:7,children:[(0,_.jsxs)(i.s,{children:[(0,_.jsx)(L,{}),(0,_.jsx)(a.a,{paddingLeft:3,paddingRight:3,children:(0,_.jsx)(l.o,{variant:"sigma",textColor:"neutral600",children:v({id:"Auth.login.sso.divider"})})}),(0,_.jsx)(L,{})]}),(0,_.jsx)(e.S,{providers:C,displayAllProviders:!1})]})})})}}}]);
