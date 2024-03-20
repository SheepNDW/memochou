import{_ as a,b as t,y as s,a9 as i,e,o as n}from"./chunks/framework.DOt9ymxk.js";const b=JSON.parse('{"title":"Git 筆記 03 - Git 分支","description":"","frontmatter":{},"headers":[],"relativePath":"git/git-branch.md","filePath":"git/git-branch.md","lastUpdated":1663951644000}'),h={name:"git/git-branch.md"},l=i('<h1 id="git-筆記-03-git-分支" tabindex="-1">Git 筆記 03 - Git 分支 <a class="header-anchor" href="#git-筆記-03-git-分支" aria-label="Permalink to &quot;Git 筆記 03 - Git 分支&quot;">​</a></h1><h6 id="tags-git" tabindex="-1">tags: <code>git</code> <a class="header-anchor" href="#tags-git" aria-label="Permalink to &quot;tags: `git`&quot;">​</a></h6><p>進行多人開發時，為了防止互相干擾，提高合作開發的體驗，建議每個開發者都基於分支進行專案功能的開發。</p><h2 id="master-main-主分支" tabindex="-1">Master (Main) 主分支 <a class="header-anchor" href="#master-main-主分支" aria-label="Permalink to &quot;Master (Main) 主分支&quot;">​</a></h2><p>在初始化本地 Git 儲存庫時，Git 會預設幫我們創建一個名字叫做 <font color="#A10710">master (main)</font> 的分支。通常我們把這個分支稱為<font color="#A10710">主分支</font>。</p><p><img src="https://i.imgur.com/HpPmXzY.png" alt=""></p><blockquote><p>實際工作中，master 主分支的作用是：<strong>用來保存和記錄整個專案已完成的功能程式碼</strong>。 因此，不允許工程師直接在 master 分支上修改程式碼，因為這樣做的風險太高，容易導致整個專案崩潰。</p></blockquote><h2 id="功能分支" tabindex="-1">功能分支 <a class="header-anchor" href="#功能分支" aria-label="Permalink to &quot;功能分支&quot;">​</a></h2><p>由於工程師不能直接在 master 分支上進行功能的開發，所以就有了功能分支的概念。</p><font color="#A10710"><strong>功能分支</strong></font>',10),p=e("font",{color:"#A10710"},"專門用來開發新功能的分支",-1),o=i(`<h2 id="查看分支列表" tabindex="-1">查看分支列表 <a class="header-anchor" href="#查看分支列表" aria-label="Permalink to &quot;查看分支列表&quot;">​</a></h2><p>使用如下指令，可以查看當前 Git 儲存庫中所有的分支列表：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> branch</span></span></code></pre></div><blockquote><p>注意：分支名字前面的 <font color="#A10710">*</font> 表示<font color="#A10710">當前所處的分支</font></p></blockquote><h2 id="建立新分支" tabindex="-1">建立新分支 <a class="header-anchor" href="#建立新分支" aria-label="Permalink to &quot;建立新分支&quot;">​</a></h2><p>使用如下指令，可以基於<font color="#A10710">基於當前分支</font>，<font color="#A10710">建立一個新的分支</font>，此時新分支上的程式碼與當前分支完全一樣：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> branch</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 分支名稱</span></span></code></pre></div><p><img src="https://i.imgur.com/mGG0YOP.png" alt=""></p><p>實際操作範例：</p><p><img src="https://i.imgur.com/WuSYnWG.png" alt=""></p><h2 id="切換分支" tabindex="-1">切換分支 <a class="header-anchor" href="#切換分支" aria-label="Permalink to &quot;切換分支&quot;">​</a></h2><p>使用如下指令，可以<font color="#A10710">切換到指定分支上</font>進行開發：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> checkout</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 分支名稱</span></span></code></pre></div><p>實際操作範例：</p><p><img src="https://i.imgur.com/p9UavBJ.png" alt=""></p><h2 id="分支的快速建立和切換" tabindex="-1">分支的快速建立和切換 <a class="header-anchor" href="#分支的快速建立和切換" aria-label="Permalink to &quot;分支的快速建立和切換&quot;">​</a></h2><p>使用如下指令，可以<font color="#A10710">建立指定名稱的新分支</font>並<font color="#A10710">立即切換到新分支</font>上：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># -b 表示建立一個新分支</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># checkout 表示切換到剛才新建的分支上</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> checkout</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -b</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 分支名稱</span></span></code></pre></div><blockquote><p>它其實是 <code>git branch 分支名稱</code> 和 <code>git checkout 分支名稱</code> 兩道指令的縮寫</p></blockquote><p>實際操作範例：</p><p><img src="https://i.imgur.com/s7Qo3bG.png" alt=""></p><h2 id="合併分支" tabindex="-1">合併分支 <a class="header-anchor" href="#合併分支" aria-label="Permalink to &quot;合併分支&quot;">​</a></h2><p>功能分支的程式碼開發測試完畢之後，可以使用如下指令，將完成後的程式碼合併到 master 主分支上：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 1. 先切換到 master 主分支上</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> checkout</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> master</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 2. 在 master 主分支上運行 git merge 指令，將 login 分支的程式碼合併到 master 上</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> merge</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> login</span></span></code></pre></div><p>實際操作範例：</p><p><img src="https://i.imgur.com/nHZ6lX3.png" alt=""></p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><strong>合併分支的注意點：</strong> 假設要將 C 分支的程式碼合併到 A 分支，需要先切換到 A 分支上，再執行 git merge 指令來合併 C 分支</p></div><h2 id="刪除分支" tabindex="-1">刪除分支 <a class="header-anchor" href="#刪除分支" aria-label="Permalink to &quot;刪除分支&quot;">​</a></h2><p>當把功能分支的程式碼合併到 master 主分支上後，就可以使用如下指令，刪除對應的功能分支：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> branch</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -d</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 分支名稱</span></span></code></pre></div><p>實際操作範例：</p><p><img src="https://i.imgur.com/qbG9EoF.png" alt=""></p><h2 id="遇到衝突時的分支合併" tabindex="-1">遇到衝突時的分支合併 <a class="header-anchor" href="#遇到衝突時的分支合併" aria-label="Permalink to &quot;遇到衝突時的分支合併&quot;">​</a></h2><p>如果<font color="#A10710">在兩個不同的分支中</font>，對<font color="#A10710">同一支檔案</font>進行了<font color="#A10710">不同的修改</font>，Git 就沒法乾淨的合併它們。 此時我們需要打開這些包含衝突的檔案然後<font color="#A10710"><strong>手動解決衝突</strong></font></p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 假設：在 reg 分支合併到 master 分支期間，程式碼發生了衝突</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> checkout</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> master</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> merge</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> reg</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 打開包含衝突的檔案，手動解除衝突後，再執行如下指令</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> add</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> .</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> commit</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -m</span><span style="--shiki-light:#B5695999;--shiki-dark:#C98A7D99;"> &quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">解決了分支合併衝突問題</span><span style="--shiki-light:#B5695999;--shiki-dark:#C98A7D99;">&quot;</span></span></code></pre></div><p>實際操作範例：</p><ol><li>合併 reg 後出現下圖情境</li></ol><p><img src="https://i.imgur.com/rfm842n.png" alt=""></p><ol start="2"><li>此時再打開 vscode 到 index.html 檔案時，會看到如下顯示</li></ol><p><img src="https://i.imgur.com/M2mScvZ.png" alt=""></p><ol start="3"><li>根據需要解決衝突問題</li></ol>`,41);function r(k,c,d,g,m,f){return n(),t("div",null,[l,s("指的是"),p,s("，它是臨時從 master 主分支上分叉出來的，當新功能開發且測試完畢後，最終需要合併到 master 主分支上，如上面的範例圖。"),o])}const u=a(h,[["render",r]]);export{b as __pageData,u as default};
