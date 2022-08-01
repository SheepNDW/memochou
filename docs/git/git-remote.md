# Git 筆記 04 - Git 遠端分支操作

###### tags: `git`

## 1. 將本地分支推送到遠端倉庫

如果是<font v-pre color="#A10710">第一次</font>將本地分支推送到遠端倉庫，需要執行如下指令：

```sh
# -u 表示把本地分支和遠端分支進行關聯，只在第一次推送時要帶上 -u 參數
git push -u 遠端倉庫的別名 本地分支名稱:遠端分支別名

# 實際案例
git push -u origin payment:pay

# 如果希望遠端分支的名稱和本地分支的名稱保持一致，可對指令進行簡化
git push -u origin payment
```

> 注意：只有在第一次推送分支時需要 -u，之後只須執行 git push 即可推送程式碼到遠端分支。

## 2. 查看遠端倉庫中所有的分支列表

通過如下指令，可以查看遠端倉庫中所有的分支列表的資訊：

```sh
git remote show 遠端倉庫名稱
```

## 3. 追蹤分支

追蹤分支指的是：從遠端倉庫中，把遠端分支下載到本地倉庫中。須執行的指令是：

```sh
# 從遠端倉庫中，把對應的遠端分支下載到本地倉庫，保持本地分支和遠端分支名稱相同
git checkout 遠端分支
# 範例：
git checkout pay

# 從遠端倉庫中，把對應的遠端分支下載到本地倉庫，並把下載的本地分支進行重命名
git checkout -b 本地分支名稱 遠端倉庫名稱/遠端分支名稱
# 範例：
git checkout -b payment origin/pay
```

## 4. 拉取遠端分支的最新程式碼

可以使用如下的指令，把遠端分支最新的程式碼下載到本地對應的分支中：

```sh
git pull
```

## 5. 刪除遠端分支

可以使用如下的指令，刪除遠端倉庫中的指定分支：

```sh
# 刪除遠端倉庫中指定名稱的遠端分支
git push 遠端倉庫名稱 --delete 遠端分支名稱
# 範例：
git push origin --delete pay
```

## 補充：[Git 學習小遊戲](https://learngitbranching.js.org/?locale=zh_TW)
