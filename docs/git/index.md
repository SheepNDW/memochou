# Git 筆記 01 - 安裝並配置 Git

###### tags: `git`

## 1. 安裝

前往官網根據你的系統下載對應的安裝包執行安裝

https://git-scm.com/downloads

> 安裝過程只需瘋狂點擊 next 即可

## 2. 設置使用者資訊

安裝完 Git 之後，要做的第一件事就是設置自己的<font v-pre color="#95292C">使用者名稱</font>和<font v-pre color="#95292C">信箱</font>，例：

```sh
git config --global user.name "sheep"
git config --global user.email "sheep@gmail.com"
```
> 注意：如果使用了 <font v-pre color="#95292C">`--global`</font> 選項，那麼該指令只需要執行一次，即可永久生效。

## 3. Git 的全域設定檔

通過 `git config --global user.name` 和 `git config --global user.email` 配置的使用者名稱與信箱，會被寫入到 <font v-pre color="#95292C">C:/Users/使用者名稱資料夾/.gitconfig</font> 檔案中。這個是 Git 的全域設定檔，設定一次即可永久生效。


## 4. 檢查配置資訊

除了使用記事本打開查看全域設定檔之外，也可以執行如下的終端指令，快速查看 Git 的全域配置資訊：

```sh
# 查看所有全域配置項
git config --list --global
# 查看指定的全域配置項
git config user.name
git config user.email
```

## 5. 取得說明文件

可以使用 <font v-pre color="#95292C">`git help (verb)`</font> 指令，無須上網即可打開說明文件，例如：
```sh
# 想要打開 git config 指令的說明文件
git help config
```

如果不想查看完整的說明文件，那麼可以用 -h 選項取得更簡明的 help 輸出：
```sh
# 想要打開 git config 指令的說明文件的快速參考
git config -h
```


