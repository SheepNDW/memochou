# Pinia 學習筆記 PART 1

###### tags: `vue`

從 0 開始學 Pinia，學習目標：學習 Pinia 基本使用。參考 [repo](https://github.com/SheepNDW/pinia-demo) 

## #0 創建 Vite 專案

&emsp;&emsp;關於鼎鼎大名的 [Vite](https://cn.vitejs.dev/)，我早就對它抱持著很大的興趣，不過在之前直播班的時候為了求穩以及出 bug 時能夠快速找到問題，當時還是選擇了使用 Vue Cli 去做開發，在第一次提交作業後，等待批改的同時我也開始學習本次菁英班的主題 [Pinia](https://pinia.vuejs.org/)，既然都已經在學新的工具了，我就想說那我順便來了解了解 Vite 好了，於是便開始了一連串的~~踩坑之旅~~，在進入 Pinia 前，先來記錄一下我怎麼使用 Vite 把我的專案給建起來的。

1. `npm init vue@latest` 這邊我是參考 [vue 官方文件](https://staging-cn.vuejs.org/guide/scaling-up/tooling.html#vite)起專案的

![](https://i.imgur.com/xmDb95x.png)

2. 本次的相關設定如下：

![](https://i.imgur.com/J5MNu04.png)

3. 剩下的就是進入專案後，`npm install`把需要的東西裝一裝，就可以執行`npm run dev`跑起來看一看了

![](https://i.imgur.com/LGofDe8.png)

4. 修改一些配置
   * 把 Router 改回`Hash`模式，因為它預設會幫你設定成`History`
       ```javascript
        import { createRouter, createWebHashHistory } from 'vue-router'
        import HomeView from '../views/HomeView.vue'

        const router = createRouter({
          history: createWebHashHistory(),
          routes: [
            {
              path: '/',
              name: 'home',
              component: HomeView
            },
            {
              path: '/about',
              name: 'about',
              component: () => import('../views/AboutView.vue')
            }
          ]
        })

        export default router
       ```
   * 加入[css預處理器](https://cn.vitejs.dev/guide/features.html#css-pre-processors)，這裡我用平常使用的sass為例 `npm add -D sass`

5. 設定完後就可以開始玩我們的 Pinia 了。

## #1 安裝並引入 Pinia

&emsp;&emsp;我在建立專案的時候就已經安裝了，一開始沒裝也可以直接執行`npm install pinia`安裝。然後在`main.js`中註冊使用：
```javascript
import { createApp } from 'vue'

// 引入 createPinia 方法
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 用 use 的方式引用 Pinia
app.use(createPinia())
app.use(router)

app.mount('#app')
```

## #2 defineStore

&emsp;&emsp;來到 src 下的 stores 資料夾裡新建一個`user.js`檔案，從 Pinia 中引入一個 defineStore 方法來建立一個新的 store：
```javascript
import { defineStore } from 'pinia'

// 1. Store 名稱
// 2. 屬性參數
export default defineStore('User Store', {
  // Data
  state: () => {
    return {}
  },
    
  // Computed
  getters: {},
    
  // Methods
  actions: {}
})
```
在 state 裡定義需要用到的資料：
```javascript
state: () => {
  return {
    name: '綿羊',
    wallet: 300
  }
}
```
在 getters 裡也可以寫成一個箭頭函式：
```javascript
getters: {
  getUserName: (state) => `我的名字叫做 ${state.name}`
}
```
在 actions 裡寫方法：
```javascript
actions: {
  // 可以使用 this
  updateName() {
    this.name = 'Sheep'
  }
}
```

## #3 Options API 的使用方式
來到`AboutView.vue`裡，將剛才寫的 userStore 給 import 進來並使用：
```vue
<script>
import userStore from '@/stores/user'
import { mapActions, mapState } from 'pinia'

// Options API
export default {
  computed: {
    // 1. Store
    // 2. 要帶入的 State, Getters
    ...mapState(userStore, ['name', 'getUserName', 'wallet'])
  },
  methods: {
    ...mapActions(userStore, ['updateName'])
  }
}
</script>
```
在 template 中使用 store 傳進來的資料：
```vue
<template>
  <div class="about">
    <h2>{{ name }}</h2>
    <h2>{{ getUserName }}</h2>
    <h2>{{ wallet }}</h2>
    <button type="button" @click="updateName">點我改名</button>
  </div>
</template>
```
在其他元件中觀察資料的變化：
```vue
// OptionsDemo.vue
<script>
import userStore from '@/stores/user'
import { mapState } from 'pinia'
export default {
  computed: {
    ...mapState(userStore, ['name'])
  }
}
</script>

<template>
  <div class="about">
    <h2>{{ name }}</h2>
  </div>
</template>
```
回到 About 頁面中更改資料就會發現 OptionsDemo 頁裡的 name 也會被改變了。可以在此測試 [demo](https://sheepndw.github.io/pinia-demo/) 中實驗看看。
![](https://i.imgur.com/PToyjM5.gif)

## #4 Composition API 的使用方式

新建一個`AboutComposition.vue`檔案，改成以`setup()`的方式撰寫：
```vue
<script>
import userStore from '@/stores/user'

// Composittion API
export default {
  setup() {
    const user = userStore()

    return {
      user
    }
  }
}
</script>
```
然後就可以在 template 中直接使用了：
```vue
<template>
  <div class="about">
    <h2>{{ user.name }}</h2>
    <h2>{{ user.getUserName }}</h2>
    <h2>{{ user.wallet }}</h2>
    <br />
    <button type="button" @click="user.updateName">點我改名</button>
  </div>
</template>
```
#### 在 Composition API 裡修改資料的方式：
1. user 是一個 reatctive 如果要更改的話可以直接使用`user.XXX = OOO`去做修改
   ```javascript
   setup() {
     const user = userStore()
     // reactive
     user.name = '許普'

     return {
       user
     }
   } 
   ```
2. `storeToRefs`方法，從 Pinia 中導入`import { storeToRefs } from 'pinia'`
   ```javascript
   setup() {
     const user = userStore()
     
     // 將其解構出來就可以返回模板中直接使用，就能把前面的 user. 給拿掉
     const { name, wallet, getUserName } = storeToRefs(user)
     
     // ref
     name.value = '許普'
     

     return {
       user,
       name,
       wallet,
       getUserName
     }
   } 
   ```
3. 直接透過 action 方法去更改 (不需要做到雙向綁定)
   ```javascript
   setup() {
     const user = userStore()
     
     // 直接從 user 中把 updateName 解構出來
     const { updateName } = user
     
     return {
       user,
       updateName
     }
   } 
   ```
4. 自定義一個 function，在模板中新增一個按鈕並綁定點擊事件觸發它
   ```javascript
   setup() {
     const user = userStore()
     
     // 定義一個方法，透過 $patch 直接傳入要修改的內容
     const updateData = () => {
       user.$patch({
         name: 'シープ',
         wallet: 1000
       })
     }
     
     return {
       user,
       updateData
     }
   } 
   ```
5. 重置資料的方法`$reset()`
   ```javascript
   setup() {
     const user = userStore()
     
     const reset = () => {
       user.$reset()
     }
     
     return {
       user,
       reset
     }
   } 
   ```
實際操作起來如下：
![](https://i.imgur.com/eA7J1A2.gif)
