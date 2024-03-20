import{_ as h,b as i,e as s,a9 as n,y as t,o as a}from"./chunks/framework.DOt9ymxk.js";const G=JSON.parse('{"title":"基數排序法 Radix Sort","description":"","frontmatter":{},"headers":[],"relativePath":"ithelp2023/Day23.md","filePath":"ithelp2023/Day23.md","lastUpdated":1696754430000}'),k={name:"ithelp2023/Day23.md"},l=n("",39),p=s("thead",null,[s("tr",null,[s("th",null,"Name"),s("th",{style:{"text-align":"center"}},"Average"),s("th",{style:{"text-align":"center"}},"Best"),s("th",{style:{"text-align":"center"}},"Worst"),s("th",{style:{"text-align":"center"}},"Space"),s("th",{style:{"text-align":"center"}},"Method"),s("th",{style:{"text-align":"center"}},"Stable")])],-1),e=s("td",null,[s("strong",null,"Radix sort")],-1),r={style:{"text-align":"center"}},d={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},g={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"8.159ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 3606.4 1000","aria-hidden":"true"},y=n("",1),B=[y],c=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"n"),s("mo",null,"∗"),s("mi",null,"k"),s("mo",{stretchy:"false"},")")])],-1),o={style:{"text-align":"center"}},D={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},A={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"8.159ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 3606.4 1000","aria-hidden":"true"},T=n("",1),Q=[T],m=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"n"),s("mo",null,"∗"),s("mi",null,"k"),s("mo",{stretchy:"false"},")")])],-1),u={style:{"text-align":"center"}},b={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},x={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"8.159ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 3606.4 1000","aria-hidden":"true"},f=n("",1),C=[f],_=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"n"),s("mo",null,"∗"),s("mi",null,"k"),s("mo",{stretchy:"false"},")")])],-1),v={style:{"text-align":"center"}},w={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},L={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"8.788ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 3884.4 1000","aria-hidden":"true"},F=n("",1),S=[F],M=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"n"),s("mo",null,"+"),s("mi",null,"k"),s("mo",{stretchy:"false"},")")])],-1),H=s("td",{style:{"text-align":"center"}},"Out-place",-1),j=s("td",{style:{"text-align":"center"}},"Yes",-1),E=s("blockquote",null,[s("p",null,"k 為桶子數量")],-1),Z=s("h2",{id:"參考資料",tabindex:"-1"},[t("參考資料 "),s("a",{class:"header-anchor",href:"#參考資料","aria-label":'Permalink to "參考資料"'},"​")],-1),R=s("ul",null,[s("li",null,[s("a",{href:"https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn",target:"_blank",rel:"noreferrer"},"《JavaScript 算法：基本原理與代碼實現》")]),s("li",null,[s("a",{href:"https://visualgo.net/en/sorting",target:"_blank",rel:"noreferrer"},"visualgo.net")])],-1);function V(N,P,q,I,z,J){return a(),i("div",null,[l,s("table",null,[p,s("tbody",null,[s("tr",null,[e,s("td",r,[s("mjx-container",d,[(a(),i("svg",g,B)),c])]),s("td",o,[s("mjx-container",D,[(a(),i("svg",A,Q)),m])]),s("td",u,[s("mjx-container",b,[(a(),i("svg",x,C)),_])]),s("td",v,[s("mjx-container",w,[(a(),i("svg",L,S)),M])]),H,j])])]),E,Z,R])}const $=h(k,[["render",V]]);export{G as __pageData,$ as default};
