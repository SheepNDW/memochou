# Git 筆記 02 - Git 的基本操作

###### tags: `git`

## 1. 獲取 Git 倉庫的兩種方式

1. 將尚未進行版本控制的本地目錄轉換為 git 倉庫
2. 從其他託管倉庫中 <font v-pre color="#A10710">clone</font> 一個已存在的 git 倉庫

## 2. 在現有的目錄中初始化倉庫

如果自己有一個尚未進行版控的專案目錄，想要用 Git 來控制它，須執行下列兩步驟：

1. 在專案目錄中打開 CMD 或是 git bash
2. 執行 <font v-pre color="#A10710">`git init`</font> 指令將當前目錄轉換為 git 倉庫

git init 指令會建立一個名為 .git 的隱藏檔案，<font v-pre color="#A10710">這個 .git 檔案就是當前專案的 Git 倉庫</font>，裡面包含了初始的必要檔案，這些檔案是 Git 倉庫的必要組成部分。

> ※ 查看隱藏檔案方法
> ![](https://i.imgur.com/WQsmSaw.png)

## 3. 工作區中檔案的 4 種狀態

工作區的每一支檔案可能有 4 種狀態，這四種狀態共分為兩大類，如圖所示：

![](https://i.imgur.com/HsRWnjJ.png)

:::info
Git 操作的最終結果：讓工作區的檔案都處於**未修改**狀態
:::

## 4. 檢查檔案狀態

可以使用 <font v-pre color="#A10710">`git status`</font> 指令查看檔案處於什麼狀態，例如：

![](https://i.imgur.com/LXshmZH.png)

在修改檔案清單中可以看到新建的 <font v-pre color="#A10710">index.html</font> 檔案處在 <font v-pre color="#A10710">Untracked files (未追蹤的檔案)</font> 下面。

未追蹤的檔案意味著 <font v-pre color="#A10710">Git 在之前的提交中沒有這些檔案</font>；Git 不會自動將之納入追蹤範圍，除非明確地告訴它 "我需要使用 Git 追蹤管理該檔案"。

## 5. 以精簡的方式顯示檔案狀態

使用 <font v-pre color="#A10710">`git status`</font> 輸出的修改檔案清單很詳細，但有些繁瑣。 如果希望以精簡的方式顯示檔案的狀態，可以使用如下兩條完全相等的指令，其中 <font v-pre color="#A10710">-s 是 --short 的縮寫</font>：

```sh
# 以精簡的方式顯示檔案狀態
git status -s
git status --short
```

未追蹤的檔案有紅色的 <font v-pre color="#A10710">??</font> 標記，例如：

![](https://i.imgur.com/zmg8wFj.png)

## 6. 追蹤新檔案

使用指令 <font v-pre color="#A10710">`git add`</font> 開始追蹤一個檔案。 所以，要追蹤 index.html 檔案，只須執行如下指令即可：

```sh
git add index.html
```

此時再執行 <font v-pre color="#A10710">`git status`</font> 指令，會看到 index.html 檔案在 <font v-pre color="#A10710">Changes to be committed</font> 這行的下面，說明已被追蹤，並處於暫存狀態：

![](https://i.imgur.com/ESUBHBJ.png)

精簡模式則顯示為綠色的 <font v-pre color="green">A</font>

![](https://i.imgur.com/Jq6vnJk.png)

## 7. 提交更新

現在暫存區有一個 index.html 等待被提交到 Git 倉庫進行保存。 可以執行 <font v-pre color="#A10710">`git commit`</font> 指令進行提交，其中 <font v-pre color="#A10710">-m 選項</font>後面是本次的<font v-pre color="#A10710">提交訊息</font>，用來<font v-pre color="#A10710">對提交的內容做進一步的描述：</font>

```sh
git commit -m "新增了一個 index.html 檔案"
```

提交成功後，會出現以下的訊息：

![](https://i.imgur.com/tl7w6DJ.png)

提交成功後，再次檢查檔案的狀態，得到的提示如下：

![](https://i.imgur.com/L4NY6so.png)

證明工作區中所有的檔案都處於 "<font v-pre color="#A10710">未修改</font>" 狀態，沒有任何檔案需要提交。

## 8. 對已提交的檔案進行修改

目前，index.html 檔案已被 Git 追蹤，並且工作區與 Git 倉庫中的 index.html 保持一致。 當我們修改了工作區中的 index.html 的內容之後，再次執行 `git status` 或是 `git status -s` 指令，會看到如下內容：

![](https://i.imgur.com/31O1jrO.png)

index.html 出現在 <font v-pre color="#A10710">Changes not staged for commit</font> 這行下面，說明<font v-pre color="#A10710">**已追蹤的檔案內容發生了改變，但還沒有放到暫存區。**</font>


## 9. 暫存已修改的檔案

目前，工作區中的 index.html 已被修改，如果要暫存這次修改，需要再次執行 `git add` 指令，這個指令是個多功能指令，主要有 3 個功用：

1. 可以用它<font v-pre color="#A10710">開始追蹤新檔案</font>
2. 把<font v-pre color="#A10710">已追蹤的、且已修改的</font>檔案放到暫存區
3. 把有衝突的檔案標記為已解決狀態

![](https://i.imgur.com/XNpvr2b.png)

## 10. 提交已暫存的檔案

再次執行 <font v-pre color="#A10710">`git commit -m "提交訊息"`</font> 指令，即可將暫存區中記錄的 index.html 的 commit，提交到 Git 倉庫進行保管：

![](https://i.imgur.com/DOXT96G.png)

## 11. 撤銷對檔案的修改
> **撤銷操作的本質**：
> 用 Git 倉庫中的檔案覆蓋掉工作區指定的檔案，一般實際開發中比較少使用到。

撤銷對檔案的修改指的是：把對工作區中對應檔案的修改，<font v-pre color="#A10710">還原</font>成 Git 倉庫中所保管的版本。
操作的結果：所有的改動會丟失，且無法恢復! <font v-pre color="#A10710">危險性較高，請慎重操作!</font>

假設我改動了 index.html 裡面的內容，但是突然後悔了，此時使用 `git checkout -- index.html` 指令，即可撤銷對 index.html 的修改

## 12. 向暫存區中一次性添加多個檔案

如果需要被暫存的檔案比較多，可以使用如下的指令，一次性將所有新增或修改的檔案加入暫存區：

```sh
git add .
```

![](https://i.imgur.com/VhH8yqL.png)


:::success
在實際開發中，會經常下這行指令，將新增和修改過後的檔案加到暫存區
:::


## 13. 取消暫存的檔案

如果想要從暫存區中移除對應的檔案，可以使用如下的指令：

```sh
git reset HEAD 要移除的檔案名稱
```

![](https://i.imgur.com/MjsjHBu.png)

## 14. 跳過使用暫存區

Git 標準工作流程為**工作區** → **暫存區** → **Git 倉庫**，但有時候這麼做略為繁瑣，此時可以跳過暫存區，直接將工作區中的修改提交到 Git 倉庫，這時候 Git 工作流程簡化為了**工作區** → **Git倉庫**。

Git 提供了一個跳過使用暫存區的方式，只要在提交的時候，給 <font v-pre color="#A10710">git commit</font> 加上 <font v-pre color="#A10710">-a</font> 選項，Git 就會自動把所有已經追蹤過的檔案暫存起來一併提交，從而跳過 git add 步驟：

```sh
git commit -a -m "提交訊息"
```

![](https://i.imgur.com/wkQMqIg.png)


## 15. 移除檔案

從 Git 倉庫中移除檔案的方式有兩種：

1. 從 Git 倉庫和工作區中<font v-pre color="#A10710">同時移除</font>對應檔案
2. 只從 Git 倉庫中移除指定檔案，但保留工作區中的對應檔案

```sh
# 從 Git 倉庫和工作區中同時移除 index.js 檔案
git rm -f index.js
# 只從 Git 倉庫中移除 index.css, 但保留工作區中的 index.css 檔案
git rm --cached index.css
```

![](https://i.imgur.com/eukOPMh.png)

## 16. 忽略檔案

一般我們總會有些檔案無須納入 Git 的管理，也不希望它出現在未追蹤的檔案列表。 在這種情況下，我們可以新建一個 <font v-pre color="#A10710">.gitignore</font> 的忽略檔案，將要忽略的檔案寫入至 .gitignore 製作忽略檔案清單。但是 .gitignore 本身是需要提交的。

.gitignore 的格式規範如下：

1. 以 <font v-pre color="#A10710"># 開頭</font>是註釋
2. 以 <font v-pre color="#A10710">/ 結尾</font>的是目錄
3. 以 <font v-pre color="#A10710">/ 開頭</font>防止遞迴
4. 以 <font v-pre color="#A10710">! 開頭</font>表示取反
5. 可以使用 <font v-pre color="#A10710">glob 模式</font>進行檔案和資料夾的匹配 (glob 指簡化的正規表示式)

## 17. glob 模式

所謂的 glob 模式即簡化了的正規表示式：

1. <font v-pre color="#A10710">星號 *</font> 匹配零個或多個任意字符
2. <font v-pre color="#A10710">[abc]</font> 匹配任何一個列在中括號裡的字符 (此案例匹配一個 a 或匹配一個 b 或匹配一個 c)
3. <font v-pre color="#A10710">問號 ?</font> 指匹配一個任意字符
4. 在中括號裡使用短橫槓分隔兩個字符，表示所有在這兩個字範圍內的都可以匹配 (比如 [0-9] 表示匹配 0 到 9 的數字)
5. <font v-pre color="#A10710">兩個星號 **</font> 表示匹配任意中間目錄 (比如 `a/**/z` 可以匹配 a/z、a/b/z 或 a/b/c/z 等)

## 18. `.gitignore` 檔案的範例

```sh
# 忽略所有的 .a 文件
*.a

# 但追蹤所有的 lib.a, 即使你在前面忽略了 .a 文件
!lib.a

# 只忽略當前目錄下的 TODO 檔案, 而不忽略 subdir/TODO
/TODO

# 忽略任何目錄下名為 build 的資料夾
build/

# 忽略 doc/notes.txt 但不忽略 doc/server/arch.txt
doc/*.txt

# 忽略 doc/ 目錄及其所有子目錄下的 .pdf 檔
doc/**/*.pdf
```

## 19. 查看提交歷史

如果希望回顧專案的提交歷史，可以使用 <font v-pre color="#A10710">`git log`</font> 這個簡單且有效的指令。

```sh
# 按時間先後順序列出所有的提交歷史，最近的提交排在最上面 (按 q 可以退出查看)
git log

# 只展示最新的兩條提交歷史，數字可以按需填寫
git log -2

# 在一行上展示最近兩條提交歷史的訊息
git log -2 --pretty=oneline

# 在一行上展示最近兩條提交歷史的訊息，並自定義輸出的格式
# %h提交的簡寫 hash 值  %an作者名字  %ar作者修訂日期，按多久以前的方式顯示  %s提交說明

git log -2 --pretty=format:"%h | %an | %ar | %s"
```

## 20. 退回到指定版本

```sh
# 在一行上展示所有提交歷史
git log --pretty=oneline

# 使用 git reset --hard 指令，根據指定的提交 ID 退回到指定版本
git reset --hard <commitID>

# 在舊版本中使用 git reflog --pretty=oneline 指令，查看指令操作的歷史
git reflog --pretty=oneline

# 再次根據最新的提交 ID，跳轉到最新的版本
git reset --hard <commitID>
```

## 21. 小結

1. 初始化 Git 倉庫
   * `git init`
2. 查看檔案狀態
   * `git status` 或 `git status -s`
3. 一次性將多個檔案加入至暫存區
   * `git add .`
4. 將暫存區中的檔案提交至 Git 倉庫
   * `git commit -m "提交訊息"`