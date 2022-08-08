# Git 筆記 03 - Git 分支

###### tags: `git`

進行多人開發時，為了防止互相干擾，提高合作開發的體驗，建議每個開發者都基於分支進行專案功能的開發。

## Master (Main) 主分支

在初始化本地 Git 倉庫時，Git 會預設幫我們創建一個名字叫做 <font v-pre color="#A10710">master (main)</font> 的分支。通常我們把這個分支稱為<font v-pre color="#A10710">主分支</font>。

![](https://i.imgur.com/HpPmXzY.png)

> 實際工作中，master 主分支的作用是：**用來保存和記錄整個專案已完成的功能程式碼**。
> 因此，不允許工程師直接在 master 分支上修改程式碼，因為這樣做的風險太高，容易導致整個專案崩潰。


## 功能分支

由於工程師不能直接在 master 分支上進行功能的開發，所以就有了功能分支的概念。

<font v-pre color="#A10710"><strong>功能分支</strong></font>指的是<font v-pre color="#A10710">專門用來開發新功能的分支</font>，它是臨時從 master 主分支上分叉出來的，當新功能開發且測試完畢後，最終需要合併到 master 主分支上，如上面的範例圖。

## 查看分支列表

使用如下指令，可以查看當前 Git 倉庫中所有的分支列表：

```sh
git branch
```

> 注意：分支名字前面的 <font v-pre color="#A10710">*</font> 表示<font v-pre color="#A10710">當前所處的分支</font>

## 建立新分支

使用如下指令，可以基於<font v-pre color="#A10710">基於當前分支</font>，<font v-pre color="#A10710">建立一個新的分支</font>，此時新分支上的程式碼與當前分支完全一樣：

```sh
git branch 分支名稱
```

![](https://i.imgur.com/mGG0YOP.png)

實際操作範例：

![](https://i.imgur.com/WuSYnWG.png)

## 切換分支

使用如下指令，可以<font v-pre color="#A10710">切換到指定分支上</font>進行開發：

```sh
git checkout 分支名稱
```

實際操作範例：

![](https://i.imgur.com/p9UavBJ.png)


## 分支的快速建立和切換

使用如下指令，可以<font v-pre color="#A10710">建立指定名稱的新分支</font>並<font v-pre color="#A10710">立即切換到新分支</font>上：

```sh
# -b 表示建立一個新分支
# checkout 表示切換到剛才新建的分支上
git checkout -b 分支名稱
```

> 它其實是 `git branch 分支名稱` 和 `git checkout 分支名稱` 兩道指令的縮寫

實際操作範例：

![](https://i.imgur.com/s7Qo3bG.png)


## 合併分支

功能分支的程式碼開發測試完畢之後，可以使用如下指令，將完成後的程式碼合併到 master 主分支上：

```sh
# 1. 先切換到 master 主分支上
git checkout master

# 2. 在 master 主分支上運行 git merge 指令，將 login 分支的程式碼合併到 master 上
git merge login
```
實際操作範例：

![](https://i.imgur.com/nHZ6lX3.png)

:::warning
**合併分支的注意點：** 假設要將 C 分支的程式碼合併到 A 分支，需要先切換到 A 分支上，再執行 git merge 指令來合併 C 分支
:::

## 刪除分支

當把功能分支的程式碼合併到 master 主分支上後，就可以使用如下指令，刪除對應的功能分支：

```sh
git branch -d 分支名稱
```

實際操作範例：

![](https://i.imgur.com/qbG9EoF.png)

## 遇到衝突時的分支合併

如果<font v-pre color="#A10710">在兩個不同的分支中</font>，對<font v-pre color="#A10710">同一支檔案</font>進行了<font v-pre color="#A10710">不同的修改</font>，Git 就沒法乾淨的合併它們。 此時我們需要打開這些包含衝突的檔案然後<font v-pre color="#A10710">**手動解決衝突**</font>

```sh
# 假設：在 reg 分支合併到 master 分支期間，程式碼發生了衝突
git checkout master
git merge reg

# 打開包含衝突的檔案，手動解除衝突後，再執行如下指令
git add .
git commit -m "解決了分支合併衝突問題"
```

實際操作範例：

1. 合併 reg 後出現下圖情境

![](https://i.imgur.com/rfm842n.png)

2. 此時再打開 vscode 到 index.html 檔案時，會看到如下顯示

![](https://i.imgur.com/M2mScvZ.png)

3. 根據需要解決衝突問題


