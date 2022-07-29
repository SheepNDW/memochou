# Vue 3.x 中全域配置 axios

學習在全域配置 axios，方便於開發

###### tags: `vue`

### 為什麼要全域配置 axios ?
在實際開發中，幾乎每個元件都會用到 axios 向後端發起請求。 此時會遇到兩個問題：
1. 每個元件中都需要<font v-pre color="#AE3C3E">引入 axios</font> (程式碼變得臃腫)
2. 每次發起請求都需要填寫<font v-pre color="#AE3C3E">完整的請求路徑</font> (不利後期維護)

例如下方程式碼，每個 axios 請求中都重複了<font v-pre color="#AE3C3E">`http://api.com/users`</font>，一旦後端根路徑發生改變，就要進到每個元件進行修改。

```javascript
// 用戶列表元件
import axios from 'axios'
axios.get('http://api.com/users')
```
```javascript
// 用戶詳情元件
import axios from 'axios'
axios.get('http://api.com/profile')
```
```javascript
// 新聞元件
import axios from 'axios'
axios.post('http://api.com/news')
```
在 Vue 直播班裡，老師教了大家配置環境變數來引入根路徑，不過重複書寫的問題依然存在：
```javascript
// 會不斷地重複這個程式碼
${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}
```

### 如何全域配置 axios

在`main.js`入口檔案裡，通過 <font v-pre color="#AE3C3E">**app.config.globalProperties**</font> 全域掛載 axios，程式碼如下：
```javascript
import axios from 'axios'

// 為 axios 配置請求根路徑
axios.default.baseURL = 'http://api.com'

// 將 axios 掛載為 app 的全域自定義屬性
// 每個元件都能透過 this 直接訪問到全域掛載的自定義屬性
app.config.globalProperties.$http = axios
```
原本的程式碼就可以改成用下方的形式書寫：
```javascript
// 用戶列表元件
this.$http.get('/users')
```
```javascript
// 用戶詳情元件
this.$http.get('/profile')
```
```javascript
// 新聞元件
this.$http.post('/news')
```
