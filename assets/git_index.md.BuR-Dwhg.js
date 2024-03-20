import{_ as i,b as s,o as a,a9 as t}from"./chunks/framework.DOt9ymxk.js";const f=JSON.parse('{"title":"Git 筆記 01 - 安裝並配置 Git","description":"","frontmatter":{},"headers":[],"relativePath":"git/index.md","filePath":"git/index.md","lastUpdated":1659321683000}'),e={name:"git/index.md"},n=t(`<h1 id="git-筆記-01-安裝並配置-git" tabindex="-1">Git 筆記 01 - 安裝並配置 Git <a class="header-anchor" href="#git-筆記-01-安裝並配置-git" aria-label="Permalink to &quot;Git 筆記 01 - 安裝並配置 Git&quot;">​</a></h1><h6 id="tags-git" tabindex="-1">tags: <code>git</code> <a class="header-anchor" href="#tags-git" aria-label="Permalink to &quot;tags: \`git\`&quot;">​</a></h6><h2 id="_1-安裝" tabindex="-1">1. 安裝 <a class="header-anchor" href="#_1-安裝" aria-label="Permalink to &quot;1. 安裝&quot;">​</a></h2><p>前往官網根據你的系統下載對應的安裝包執行安裝</p><p><a href="https://git-scm.com/downloads" target="_blank" rel="noreferrer">https://git-scm.com/downloads</a></p><blockquote><p>安裝過程只需瘋狂點擊 next 即可</p></blockquote><h2 id="_2-設置使用者資訊" tabindex="-1">2. 設置使用者資訊 <a class="header-anchor" href="#_2-設置使用者資訊" aria-label="Permalink to &quot;2. 設置使用者資訊&quot;">​</a></h2><p>安裝完 Git 之後，要做的第一件事就是設置自己的<font color="#95292C">使用者名稱</font>和<font color="#95292C">信箱</font>，例：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --global</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> user.name</span><span style="--shiki-light:#B5695999;--shiki-dark:#C98A7D99;"> &quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">sheep</span><span style="--shiki-light:#B5695999;--shiki-dark:#C98A7D99;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --global</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> user.email</span><span style="--shiki-light:#B5695999;--shiki-dark:#C98A7D99;"> &quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">sheep@gmail.com</span><span style="--shiki-light:#B5695999;--shiki-dark:#C98A7D99;">&quot;</span></span></code></pre></div><blockquote><p>注意：如果使用了 <font color="#95292C"><code>--global</code></font> 選項，那麼該指令只需要執行一次，即可永久生效。</p></blockquote><h2 id="_3-git-的全域設定檔" tabindex="-1">3. Git 的全域設定檔 <a class="header-anchor" href="#_3-git-的全域設定檔" aria-label="Permalink to &quot;3. Git 的全域設定檔&quot;">​</a></h2><p>通過 <code>git config --global user.name</code> 和 <code>git config --global user.email</code> 配置的使用者名稱與信箱，會被寫入到 <font color="#95292C">C:/Users/使用者名稱資料夾/.gitconfig</font> 檔案中。這個是 Git 的全域設定檔，設定一次即可永久生效。</p><h2 id="_4-檢查配置資訊" tabindex="-1">4. 檢查配置資訊 <a class="header-anchor" href="#_4-檢查配置資訊" aria-label="Permalink to &quot;4. 檢查配置資訊&quot;">​</a></h2><p>除了使用記事本打開查看全域設定檔之外，也可以執行如下的終端指令，快速查看 Git 的全域配置資訊：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 查看所有全域配置項</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --list</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --global</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 查看指定的全域配置項</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> user.name</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> user.email</span></span></code></pre></div><h2 id="_5-取得說明文件" tabindex="-1">5. 取得說明文件 <a class="header-anchor" href="#_5-取得說明文件" aria-label="Permalink to &quot;5. 取得說明文件&quot;">​</a></h2><p>可以使用 <font color="#95292C"><code>git help (verb)</code></font> 指令，無須上網即可打開說明文件，例如：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 想要打開 git config 指令的說明文件</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> help</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span></span></code></pre></div><p>如果不想查看完整的說明文件，那麼可以用 -h 選項取得更簡明的 help 輸出：</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 想要打開 git config 指令的說明文件的快速參考</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">git</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> config</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -h</span></span></code></pre></div>`,20),h=[n];function l(p,k,o,d,r,g){return a(),s("div",null,h)}const A=i(e,[["render",l]]);export{f as __pageData,A as default};