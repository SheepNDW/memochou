import{_ as k,b as a,e as s,y as i,a9 as n,o as h}from"./chunks/framework.DOt9ymxk.js";const F=JSON.parse('{"title":"鏈結串列 Linked List (1)","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"ithelp2023/Day07.md","filePath":"ithelp2023/Day07.md","lastUpdated":1695386371000}'),l={name:"ithelp2023/Day07.md"},p=s("h1",{id:"鏈結串列-linked-list-1",tabindex:"-1"},[i("鏈結串列 Linked List (1) "),s("a",{class:"header-anchor",href:"#鏈結串列-linked-list-1","aria-label":'Permalink to "鏈結串列 Linked List (1)"'},"​")],-1),t=s("blockquote",null,[s("p",null,[i("本文同步發布於 2023 iThome 鐵人賽："),s("a",{href:"https://ithelp.ithome.com.tw/users/20152758/ironman/6714",target:"_blank",rel:"noreferrer"},"那些前端不用會，但是可以會的資料結構與演算法"),i(" 系列文中。")])],-1),e=s("code",null,"undefined",-1),d={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},r={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"4.844ex",height:"2.262ex",role:"img",focusable:"false",viewBox:"0 -750 2141 1000","aria-hidden":"true"},g=n("",1),y=[g],B=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mi",null,"O"),s("mo",{stretchy:"false"},"("),s("mi",null,"n"),s("mo",{stretchy:"false"},")")])],-1),A=n("",58);function D(c,o,C,u,x,E){return h(),a("div",null,[p,t,s("p",null,[i("我們先簡單回顧陣列，作為一個被廣泛內建在各語言中的資料結構，它是在記憶體中開一塊連續的空間，然後把資料依序放進去，每個元素都有一個索引值，可以直接存取。在靜態語言中，陣列的長度是固定的，例如一個長度為 7 的陣列，我們就只能存取索引值為 0 到 6 的元素，如果要存取索引值為 7 的元素，就會出現錯誤，不過在 JavaScript 中只會回傳 "),e,i("。這是因為 JavaScript 的陣列是動態陣列，它可以在執行時去跟系統索取需要的記憶體空間，讓我們能夠自由擴充長度。陣列在讀取資料時只要知道索引值就能直接找到，但是要將元素從中間會前面插入的時候，為了保持其連續性，必須將後面的所有元素都往後移動一位，刪除靠前的元素也是，要把後面的元素往前移動，所以在插入和刪除時的時間複雜度都是 "),s("mjx-container",d,[(h(),a("svg",r,y)),B]),i("。")]),A])}const v=k(l,[["render",D]]);export{F as __pageData,v as default};