import{_ as a,b as e,o as i,a9 as t}from"./chunks/framework.DOt9ymxk.js";const D=JSON.parse('{"title":"前言與系列文簡介","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"ithelp2023/Day01.md","filePath":"ithelp2023/Day01.md","lastUpdated":1697351429000}'),l={name:"ithelp2023/Day01.md"},r=t(`<h1 id="前言與系列文簡介" tabindex="-1">前言與系列文簡介 <a class="header-anchor" href="#前言與系列文簡介" aria-label="Permalink to &quot;前言與系列文簡介&quot;">​</a></h1><blockquote><p>本文同步發布於 2023 iThome 鐵人賽：<a href="https://ithelp.ithome.com.tw/users/20152758/ironman/6714" target="_blank" rel="noreferrer">那些前端不用會，但是可以會的資料結構與演算法</a> 系列文中。</p></blockquote><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>開始從事前端開發已經有 1 年多了，雖然是非 CS 本科出身的工程師，也沒有學過什麼資料結構與演算法，卻也逐漸掌握了商業邏輯的撰寫，也能夠根據 PM 需求進行開發。似乎不需要真的學過書本上那些資料結構或是演算法，也可以成為一名前端工程師。而契機是在今年初，有兩位我很喜歡的工程師 Youtuber 合作出了一支影片，然後在社群以及 PTT 上引起了一陣不小的討論，關於演算法、Big O 等名詞不斷出現在我的視野中，讓我也開始好奇了起來，於是就開始查了相關的資料，也成為了我之後開始學習資料結構與演算法的契機。</p><p>這次主題定為「那些前端不用會，但是可以會的資料結構與演算法」的原因如我一開始提到的，我在這之前是完全沒有資料結構與演算法的概念在的，但是我仍然可以成為一名前端工程師，並且在工作上也沒有遇到過非得需要用到資料結構與演算法才有辦法實現的功能（僅個人經驗），所以我認為這些東西對於前端工程師來說並不是必要的，不至於到因為你不會演算法就找不到工作。但是有了資結與演算法的概念在之後，在思考問題與程式設計上的想法會有所不同，可以讓我們的程式碼更加的優雅，也可以讓我們的程式碼更加的有效率，所以我認為這些東西是可以會的，而且學了不會吃虧的。</p><h2 id="系列文簡介" tabindex="-1">系列文簡介 <a class="header-anchor" href="#系列文簡介" aria-label="Permalink to &quot;系列文簡介&quot;">​</a></h2><p>前面說到我對演算法的學習起了興趣，然後沒多久我的主管就給了我一本司徒正美寫和李曉晨寫的《JavaScript 算法：基本原理與代碼實現》，開啟了我學習資料結構與演算法的旅程，這次鐵人賽的內容大部分內容會是參考這本書，然後再加上我自己從網路上各種資源，例如：演算法相關書籍、往年鐵人賽的文章、一些影片教學等等後，將所學到的東西以我自己的理解來整理成文章，並且分享給大家。</p><p>這個系列的所有程式碼都會用 JavaScript 來實作，並且會使用 <a href="https://vitest.dev/" target="_blank" rel="noreferrer">Vitest</a> 來進行單元測試，使用單元測試可以減少我們很多在 Console 裡 debug 的時間，如果對單元測試不熟悉的也沒關係，在初始專案中我都會事先將測試程式碼給寫好，到時候只要執行指令就可以看到測試結果了，我在稍後會具體說明。</p><h3 id="什麼人適合看這系列的文章呢" tabindex="-1">什麼人適合看這系列的文章呢？ <a class="header-anchor" href="#什麼人適合看這系列的文章呢" aria-label="Permalink to &quot;什麼人適合看這系列的文章呢？&quot;">​</a></h3><ul><li>本身也是非本科轉職工程師，想要補足自己的資料結構與演算法知識。</li><li>對資料結構與演算法有興趣，想要了解的人。</li><li>對 JavaScript 有一定程度的熟悉，或是已經工作一段時間的前端工程師，想要提升自己的程式能力。</li></ul><h3 id="什麼人不適合看這系列的文章呢" tabindex="-1">什麼人不適合看這系列的文章呢？ <a class="header-anchor" href="#什麼人不適合看這系列的文章呢" aria-label="Permalink to &quot;什麼人不適合看這系列的文章呢？&quot;">​</a></h3><ul><li>對 JavaScript 的基本語法以及內建的資料結構不熟悉的人。</li><li>已經學過資料結構與演算法的人。</li></ul><p>因為我不會在文章中花太多時間來解釋 JavaScript 的語法或是內建的資料結構，一些常用的內建資料結構，例如：<code>Array</code>、<code>Object</code>、<code>Map</code>、<code>Set</code> 等等的操作方法，我會假設讀者已經有一定的了解，因為我認為那是“應該要會”，而不是“不用會”的知識點。</p><p>這系列會從最基礎的資料結構與演算法開始講起，所以對於已經學過的人來說，可能會覺得這系列的文章太過於基礎，不過如果有興趣的話，也可以看看小弟我怎麼理解的，如果有錯誤的地方，也歡迎指正。</p><h2 id="專案初始化" tabindex="-1">專案初始化 <a class="header-anchor" href="#專案初始化" aria-label="Permalink to &quot;專案初始化&quot;">​</a></h2><p>可以從我的 GitHub 上將這個<a href="https://github.com/SheepNDW/ithelp2023-dsa-with-js/tree/main" target="_blank" rel="noreferrer">系列文專用專案</a> clone 下來，然後根據 README.md 的說明進行安裝，在安裝完專案中的依賴後，執行 <code>pnpm test</code> 指令，如果可以成功看到 day01 中的 <code>hello</code> 函式測試通過的話，就代表專案初始化成功了。</p><p>接下來我每天的範例程式碼都會更新到這個專案中，可以的話推薦 clone 進本地跟著文章一起敲一次，這樣會比較有感覺。</p><p>另外筆者推薦在使用專案時利用 <code>vitest ui</code> 來觀察測試結果，不僅可以更加直觀的看到測試結果，也可以直接利用它來查看我們利用 <code>console.log</code> 來 debug 的結果，這樣會比較方便。當然也可以直接將我們的函式 <code>import</code> 進 <code>main.js</code> 中直接執行 <code>pnpm dev</code> 開啟一個 <code>local server</code> 在瀏覽器的 Console 中查看結果。</p><p>下面示範使用 <code>vitest ui</code> 來 debug 的方式：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 執行指令</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">pnpm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> test:ui</span></span></code></pre></div><p>此時會自動在瀏覽器中開啟 <code>http://localhost:51204/__vitest__/</code>，一開始會長這樣：</p><p><img src="https://media.discordapp.net/attachments/1080668361618362530/1152181309293199410/image.png?width=2132&amp;height=1084" alt=""></p><p>然後點擊左邊的 <code>src/001-day1-code/hello.spec.js</code>，就可以看到我們的測試結果了：</p><p><img src="https://media.discordapp.net/attachments/1083289750099738624/1143439024984444989/image.png?width=2178&amp;height=1084" alt=""></p><p>如果你能成功看到如上圖的顯示，那就代表你已經成功初始化專案了，接下來就可以開始跟著後面的天數一起跟著敲程式碼了。</p><h2 id="toc" tabindex="-1">TOC <a class="header-anchor" href="#toc" aria-label="Permalink to &quot;TOC&quot;">​</a></h2><p>下面是這 30 天預計要寫的內容，會持續更新，可能會有些許變動。</p><ul><li>Day 01 - 前言與系列文簡介</li><li><a href="./Day02.html">Day 02 - 什麼是資料結構？演算法又是什麼？</a></li><li><a href="./Day03.html">Day 03 - 時間與空間複雜度</a></li><li><a href="./Day04.html">Day 04 -【資料結構】Stack</a></li><li><a href="./Day05.html">Day 05 -【資料結構】Queue</a></li><li><a href="./Day06.html">Day 06 -【資料結構】Deque</a></li><li><a href="./Day07.html">Day 07 -【資料結構】Linked List (1)</a></li><li><a href="./Day08.html">Day 08 -【資料結構】Linked List (2)</a></li><li><a href="./Day09.html">Day 09 -【資料結構】Hash Table</a></li><li><a href="./Day10.html">Day 10 -【搜尋演算法】Sequential Search &amp; Binary Search</a></li><li><a href="./Day11.html">Day 11 -【資料結構】Tree &amp; Binary Tree</a></li><li><a href="./Day12.html">Day 12 -【資料結構】Tree 的深度優先走訪</a></li><li><a href="./Day13.html">Day 13 -【資料結構】Tree 的廣度優先走訪 &amp; Print a binary tree</a></li><li><a href="./Day14.html">Day 14 -【資料結構】Binary Search Tree</a></li><li><a href="./Day15.html">Day 15 -【資料結構】Heap</a></li><li><a href="./Day16.html">Day 16 -【資料結構】Priority Queue</a></li><li><a href="./Day17.html">Day 17 -【排序演算法】Bubble Sort</a></li><li><a href="./Day18.html">Day 18 -【排序演算法】Selection Sort &amp; Insertion Sort</a></li><li><a href="./Day19.html">Day 19 -【排序演算法】Shell Sort</a></li><li><a href="./Day20.html">Day 20 -【排序演算法】Merge Sort</a></li><li><a href="./Day21.html">Day 21 -【排序演算法】Quick Sort</a></li><li><a href="./Day22.html">Day 22 -【排序演算法】Counting Sort &amp; Bucket Sort</a></li><li><a href="./Day23.html">Day 23 -【排序演算法】Radix Sort</a></li><li><a href="./Day24.html">Day 24 -【排序演算法】總結</a></li><li><a href="./Day25.html">Day 25 -【隨機演算法】Fisher-Yates Shuffle</a></li><li><a href="./Day26.html">Day 26 -【回溯法】Backtracking (1)</a></li><li><a href="./Day27.html">Day 27 -【回溯法】Backtracking (2)</a></li><li><a href="./Day28.html">Day 28 -【動態規劃】Dynamic Programming (1)</a></li><li><a href="./Day29.html">Day 29 -【動態規劃】Dynamic Programming (2)</a></li><li><a href="./Day30.html">Day 30 -【貪婪演算法】Greedy Algorithm</a></li></ul>`,28),h=[r];function o(s,c,p,d,n,m){return i(),e("div",null,h)}const f=a(l,[["render",o]]);export{D as __pageData,f as default};