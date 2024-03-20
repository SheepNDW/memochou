import{_ as s,b as i,o as a,a9 as t}from"./chunks/framework.DOt9ymxk.js";const A=JSON.parse('{"title":"Git 筆記 04 - Git 遠端分支操作","description":"","frontmatter":{},"headers":[],"relativePath":"git/git-remote.md","filePath":"git/git-remote.md","lastUpdated":1663951644000}'),e={name:"git/git-remote.md"},h=t(`<h1 id="git-筆記-04-git-遠端分支操作" tabindex="-1">Git 筆記 04 - Git 遠端分支操作 <a class="header-anchor" href="#git-筆記-04-git-遠端分支操作" aria-label="Permalink to &quot;Git 筆記 04 - Git 遠端分支操作&quot;">​</a></h1><h6 id="tags-git" tabindex="-1">tags: <code>git</code> <a class="header-anchor" href="#tags-git" aria-label="Permalink to &quot;tags: \`git\`&quot;">​</a></h6><h2 id="_1-將本地分支推送到遠端儲存庫" tabindex="-1">1. 將本地分支推送到遠端儲存庫 <a class="header-anchor" href="#_1-將本地分支推送到遠端儲存庫" aria-label="Permalink to &quot;1. 將本地分支推送到遠端儲存庫&quot;">​</a></h2><p>如果是<font color="#A10710">第一次</font>將本地分支推送到遠端儲存庫，需要執行如下指令：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># -u 表示把本地分支和遠端分支進行關聯，只在第一次推送時要帶上 -u 參數</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> push</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -u</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 遠端儲存庫的別名</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 本地分支名稱:遠端分支別名</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 實際案例</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> push</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -u</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> origin</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> payment:pay</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 如果希望遠端分支的名稱和本地分支的名稱保持一致，可對指令進行簡化</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> push</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -u</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> origin</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> payment</span></span></code></pre></div><blockquote><p>注意：只有在第一次推送分支時需要 -u，之後只須執行 git push 即可推送程式碼到遠端分支。</p></blockquote><h2 id="_2-查看遠端儲存庫中所有的分支列表" tabindex="-1">2. 查看遠端儲存庫中所有的分支列表 <a class="header-anchor" href="#_2-查看遠端儲存庫中所有的分支列表" aria-label="Permalink to &quot;2. 查看遠端儲存庫中所有的分支列表&quot;">​</a></h2><p>通過如下指令，可以查看遠端儲存庫中所有的分支列表的資訊：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> remote</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> show</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 遠端儲存庫名稱</span></span></code></pre></div><h2 id="_3-追蹤分支" tabindex="-1">3. 追蹤分支 <a class="header-anchor" href="#_3-追蹤分支" aria-label="Permalink to &quot;3. 追蹤分支&quot;">​</a></h2><p>追蹤分支指的是：從遠端儲存庫中，把遠端分支下載到本地儲存庫中。須執行的指令是：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 從遠端儲存庫中，把對應的遠端分支下載到本地儲存庫，保持本地分支和遠端分支名稱相同</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> checkout</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 遠端分支</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 範例：</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> checkout</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> pay</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 從遠端儲存庫中，把對應的遠端分支下載到本地儲存庫，並把下載的本地分支進行重命名</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> checkout</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -b</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 本地分支名稱</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 遠端儲存庫名稱/遠端分支名稱</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 範例：</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> checkout</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -b</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> payment</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> origin/pay</span></span></code></pre></div><h2 id="_4-拉取遠端分支的最新程式碼" tabindex="-1">4. 拉取遠端分支的最新程式碼 <a class="header-anchor" href="#_4-拉取遠端分支的最新程式碼" aria-label="Permalink to &quot;4. 拉取遠端分支的最新程式碼&quot;">​</a></h2><p>可以使用如下的指令，把遠端分支最新的程式碼下載到本地對應的分支中：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> pull</span></span></code></pre></div><h2 id="_5-刪除遠端分支" tabindex="-1">5. 刪除遠端分支 <a class="header-anchor" href="#_5-刪除遠端分支" aria-label="Permalink to &quot;5. 刪除遠端分支&quot;">​</a></h2><p>可以使用如下的指令，刪除遠端儲存庫中的指定分支：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 刪除遠端儲存庫中指定名稱的遠端分支</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> push</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 遠端儲存庫名稱</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --delete</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> 遠端分支名稱</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 範例：</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> push</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> origin</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --delete</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> pay</span></span></code></pre></div><h2 id="補充-git-學習小遊戲" tabindex="-1">補充：<a href="https://learngitbranching.js.org/?locale=zh_TW" target="_blank" rel="noreferrer">Git 學習小遊戲</a> <a class="header-anchor" href="#補充-git-學習小遊戲" aria-label="Permalink to &quot;補充：[Git 學習小遊戲](https://learngitbranching.js.org/?locale=zh_TW)&quot;">​</a></h2>`,19),n=[h];function l(p,k,d,r,g,o){return a(),i("div",null,n)}const y=s(e,[["render",l]]);export{A as __pageData,y as default};
