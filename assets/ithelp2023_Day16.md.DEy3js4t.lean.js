import{_ as t,b as a,e as s,y as i,a9 as n,o as h}from"./chunks/framework.DOt9ymxk.js";const W=JSON.parse('{"title":"優先佇列 Priority Queue","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"ithelp2023/Day16.md","filePath":"ithelp2023/Day16.md","lastUpdated":1696155012000}'),l={name:"ithelp2023/Day16.md"},k=s("h1",{id:"優先佇列-priority-queue",tabindex:"-1"},[i("優先佇列 Priority Queue "),s("a",{class:"header-anchor",href:"#優先佇列-priority-queue","aria-label":'Permalink to "優先佇列 Priority Queue"'},"​")],-1),p=s("blockquote",null,[s("p",null,[i("本文同步發布於 2023 iThome 鐵人賽："),s("a",{href:"https://ithelp.ithome.com.tw/users/20152758/ironman/6714",target:"_blank",rel:"noreferrer"},"那些前端不用會，但是可以會的資料結構與演算法"),i(" 系列文中。")])],-1),e=s("p",null,"首先我們來回憶一下佇列，普通的佇列是一種先進先出（FIFO）的資料結構，元素只能從佇列尾部加入，從佇列頭部取出。而優先佇列（Priority Queue）是一種特殊的佇列，它的元素是有優先級的，有最高優先級的元素會被最先取出，就像 VIP，就算他最晚來，也會被優先服務。",-1),r={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},d={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"4.844ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 2141 1000","aria-hidden":"true"},g=n("",1),y=[g],o=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"n"),s("mo",{stretchy:"false"},")")])],-1),c={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},B={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"8.112ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 3585.7 1000","aria-hidden":"true"},Q=n("",1),A=[Q],T=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"log"),s("mo",{"data-mjx-texclass":"NONE"},"⁡"),s("mi",null,"n"),s("mo",{stretchy:"false"},")")])],-1),D=n("",31),m={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},u={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"9.847ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 4352.3 1000","aria-hidden":"true"},x=n("",1),f=[x],C=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"n"),s("mi",null,"log"),s("mo",{"data-mjx-texclass":"NONE"},"⁡"),s("mi",null,"n"),s("mo",{stretchy:"false"},")")])],-1),_={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},w={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"4.618ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 2041 1000","aria-hidden":"true"},b=n("",1),v=[b],F=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mn",null,"1"),s("mo",{stretchy:"false"},")")])],-1),H={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},M={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"4.844ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 2141 1000","aria-hidden":"true"},L=n("",1),E=[L],V=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"n"),s("mo",{stretchy:"false"},")")])],-1),Z={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},q={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"8.766ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 3874.7 1000","aria-hidden":"true"},P=n("",1),S=[P],j=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"log"),s("mo",{"data-mjx-texclass":"NONE"},"⁡"),s("mi",null,"K"),s("mo",{stretchy:"false"},")")])],-1),I=s("h2",{id:"參考資料",tabindex:"-1"},[i("參考資料 "),s("a",{class:"header-anchor",href:"#參考資料","aria-label":'Permalink to "參考資料"'},"​")],-1),N=s("ul",null,[s("li",null,[s("a",{href:"https://www.tenlong.com.tw/products/9787115596154?list_name=r-zh_cn",target:"_blank",rel:"noreferrer"},"《JavaScript 算法：基本原理與代碼實現》")])],-1);function O(J,z,R,G,U,K){return h(),a("div",null,[k,p,e,s("p",null,[i("既然 VIP 需要最先得到服務，我們需要將優先級最高的元素在加入佇列時就調整到最前面，如果使用 linked list 或是普通陣列來實作，時間複雜度會是 "),s("mjx-container",r,[(h(),a("svg",d,y)),o]),i("；如果換成 max heap 或 min heap，每次加入和取出的時間複雜度都是 "),s("mjx-container",c,[(h(),a("svg",B,A)),T]),i("。我們在昨天已經學過如何構建 heap 和調整 heap，而想要實作一個 priority queue，還需要實作 heap 的移除與新增元素的方法。")]),D,s("p",null,[i("heap sort 是一種利用 heap 來實現的排序演算法，它的時間複雜度是 "),s("mjx-container",m,[(h(),a("svg",u,f)),C]),i("，空間複雜度是 "),s("mjx-container",_,[(h(),a("svg",w,v)),F]),i("。")]),s("p",null,[i("TopK 問題很適合使用 heap 來解決，建立 heap 的時間複雜度 "),s("mjx-container",H,[(h(),a("svg",M,E)),V]),i("，加入元素和取出元素的時間複雜度都是 "),s("mjx-container",Z,[(h(),a("svg",q,S)),j]),i("。")]),I,N])}const X=t(l,[["render",O]]);export{W as __pageData,X as default};