# npm

## npm 的使用

```bash
npm init
npm install 套件名 –g  （uninstall,update）# -g 全域安裝
npm install 套件名 --save-dev (uninstall,update) # -D 安裝到 devDeps
npm list -g (不加-g，列舉目前目錄下的安裝套件)
npm info 套件名（詳細資訊） npm info 套件名 version(取得最新版本)
npm install md5@1（安裝指定版本）
npm outdated (檢查套件是否已經過時)
```

```json
"dependencies": {
  "md5": "^2.3.0" // ^ 表示如果直接 npm install 將會安裝 md5 `2.*.*`  最新版本
}
"dependencies": {
  "md5": "~2.3.0" // ~ 表示如果直接 npm install 將會安裝 md5 `2.1.*`  最新版本
}
"dependencies": {
  "md5": "*" // * 表示如果直接 npm install 將會安裝 md5 最新版本
}
```

## yarn 的使用

安裝 yarn：`npm install -g yarn`

```bash
# 初始化
yarn init

# 安裝套件
yarn add [package] 
yarn add [package]@[version] 
yarn add [package] --dev 

# 升級套件
yarn upgrade [package]@[version]
yarn remove [package]

# 安裝專案的全部依賴
yarn install
```
