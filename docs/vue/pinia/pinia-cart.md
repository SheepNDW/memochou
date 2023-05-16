# 用 Pinia 寫一個購物車

###### tags: `vue`

瞭解了 Pinia 的基本操作後，接著就來試著用在實戰裡，這次的目標為使用 Pinia 完成購物車的業務。


## 簡介
這次依然是使用 Vite 來進行開發，這是開發完成的 [repo](https://github.com/SheepNDW/vue3-pinia-shopping-cart) 以及 [線上demo](https://sheepndw.github.io/vue3-pinia-shopping-cart/#/)。
預覽圖：
![](https://i.imgur.com/QR2czwr.png)

## 專案設定
* 安裝 pinia
* 安裝 bootstrap
* 安裝 axios
* 安裝 nprogress (非必要)

## 初期設置

### bootstrap
執行`npm add -D sass`後，把 bootstrap 的 scss 給引入
`src/assets/styles/all.scss`
```scss
@import 'bootstrap/scss/bootstrap';
// 或是 @import '../../../node_modules/bootstrap/scss/bootstrap.scss';
```
`App.vue`
```vue
<style lang="scss">
@import '@/assets/styles/all.scss';
</style>
```
<font v-pre color="red">踩坑：</font>在 all.scss 中的引入如果加上了波浪符會出現如下之錯誤：

![](https://i.imgur.com/hjqXk2N.png)

這是因為在 vite 中把 sass-loader 給拿掉了，波浪符是從它來的，所以會出現上方的錯誤。[參考連結](https://stackoverflow.com/questions/37106230/node-sass-does-not-understand-tilde)

### Vite 中的環境變數

這裡告訴大家一件事，文件請看仔細，不看清楚至少看遷移指南，不然你會跟我一樣卡很久在這...
在 Cli => Vite 的[遷移指南](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)中 Step #6: Update Environment Variables 有提到這件事，白話一點就是原本的 `process` 變數被換成了 `import.meta.env`，原本的 `VUE_APP_` 也換成了 `VITE_`，使用起來就會像這樣：
```
// vue cli
VUE_APP_PATH=my-api-path

// Vite
VITE_API_PATH=my-api-path
```
```javascript
// 在其他地方引入使用
// vue cli
console.log(process.env.VUE_APP_PATH)

// Vite
console.log(import.meta.env.VITE_API_PATH)
```

### NProgress 套件

這是一款 Loading 效果的套件，想說既然都要玩玩新東西了，就換點口味這次就不用 vue-loading-overlay 了。
1. 安裝它 `npm install --save nprogress`
2. 在 src/utils 下新建一個 `nprogress.js` 檔案：
   ```javascript
   import Nprogress from 'nprogress'
   import 'nprogress/nprogress.css'

   export const start = () => {
     Nprogress.start()
   }

   export const close = () => {
     Nprogress.done()
   }
   ```
3. 它還有很多可以設定的東西，這次就先使用最簡單的用法，導出打開跟關閉兩個函式。
4. `src/utils/request.js` 在 axios 的攔截器中使用它，這樣將來在發請求時就會有讀取特效。
   ```javascript
   import { start, close } from './nprogress'
   // --- (略) ---
   instance.interceptors.request.use(config => {
     start()
     return config
   }, err => {
     return Promise.reject(err)
   })

   instance.interceptors.response.use(res => {
     close()
     return res.data
   }, err => {
     return Promise.reject(err)
   })
   ```

補充：它還可以設定在 Router 裡，在 router.beforeEach 時打開，在 router.afterEach (路由載入完成後) 關閉。

## productStore

首先來設定產品列表的 Store，在 stores 資料夾下新建一個 `productStore.js`
```javascript
import { defineStore } from 'pinia'
import { getProductsAll } from '@/api/product'

export const useProductStore = defineStore('productStore', {
  state: () => {
    return {
      productList: []
    }
  },
  getters: {
    sortProducts: (state) => state.productList.sort((a, b) => a.price - b.price)
  },
  actions: {
    getProducts() {
      getProductsAll().then((data) => {
        this.productList = data.products
      })
    }
  }
})
```
接著就可以在 Cart.vue 中改成使用 productStore 來獲取產品列表
```vue
<script>
import { computed } from 'vue'
import { useProductStore } from '@/stores/productStore'

export default {
  name: 'Cart',
  setup() {
    // 取得所有商品列表
    const productStore = useProductStore()
    const productList = computed(() => productStore.sortProducts)
    productStore.getProducts()

    return {
      productList
    }
  }
}
</script>
```

## statusStore

新建一個 statusStore 來管理所有狀態
```javascript
import { defineStore } from 'pinia'

export const useStatusStore = defineStore('statusStore', {
  state: () => {
    return {
      loadingItem: ''
    }
  }}
)
```

## cartStore

再來設定一個購物車的 Store，在 stores 資料夾下新建一個 `cartStore.js`
```javascript
import { defineStore } from 'pinia'
import { deleteCart, getCartList, insertCart, updateCart } from '@/api/cart'
import { useStatusStore } from './statusStore'

// 在 cartStore 中使用 status 資料
const status = useStatusStore()

export const useCartStore = defineStore('cartStore', {
  state: () => {
    return {
      cartData: {
        carts: [],
        final_total: 0,
        total: 0
      }
    }
  },
  actions: {
    // 取得購物車
    getCarts() {
      getCartList().then((res) => {
        this.cartData = res.data
      })
    },
    // 加入購物車
    addToCart(id, qty = 1) {
      status.loadingItem = id
      insertCart(id, qty).then(() => {
        this.getCarts()
        status.loadingItem = ''
      })
    },

    // 更新數量
    updateCartInfo(item) {
      status.loadingItem = item.id
      const reqParams = {
        productId: item.id,
        count: item.qty
      }
      updateCart(reqParams).then(() => {
        this.getCarts()
        status.loadingItem = ''
      })
    },

    // 刪除
    removeCartItem(id) {
      status.loadingItem = id
      deleteCart(id).then(() => {
        this.getCarts()
        status.loadingItem = ''
      })
    }
  }
})
```
前往 `Cart.vue` 使用 statusStore 和 cartStore
```vue
<script>
import { computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { useStatusStore } from '@/stores/statusStore'
export default {
  name: 'Cart',
  setup() {
    // 取得所有商品列表
    // (略) ...

    // 取得購物車內容
    const cartStore = useCartStore()
    const cartData = computed(() => cartStore.cartData)
    cartStore.getCarts()

    // 記錄當前狀態
    const statusStore = useStatusStore()
    const loadingItem = computed(() => statusStore.loadingItem)

    return {
      productList,
      cartData,
      loadingItem,
      addToCart: cartStore.addToCart,
      updateCartInfo: cartStore.updateCartInfo,
      removeCartItem: cartStore.removeCartItem
    }
  }
}
</script>
```

## Toast 元件

到這邊為止功能已經完成，最後一步就是加入 Toast 彈出訊息效果。來到 `statusStore.js` 加上 messages 相關的資料及方法：
```javascript
import { defineStore } from 'pinia'

export const useStatusStore = defineStore('statusStore', {
  state: () => {
    return {
      loadingItem: '',
      messages: []
    }
  },
  actions: {
    pushMessage(data) {
      const { title, content, style = 'success' } = data
      this.messages.push({ style, title, content })
    }
  }
})
```
在 cartStore 中使用，用加入購物車當例子：
```javascript
// 加入購物車
addToCart(id, qty = 1) {
  status.loadingItem = id
  insertCart(id, qty).then(() => {
     status.pushMessage({ title: '加入購物車成功' })
     this.getCarts()
     status.loadingItem = ''
  })
},
```
在 `ToastMessage.vue` 中將資料替換成 statusStore 的資料
```vue
<script>
import { useStatusStore } from '@/stores/statusStore'
import { storeToRefs } from 'pinia'
import Toast from './Toast.vue'
export default {
  name: 'ToastMessage',
  components: { Toast },
  setup() {
    const status = useStatusStore()
    const { messages } = storeToRefs(status)

    return {
      messages
    }
  }
}
</script>
```
這樣一來就大功告成了，至此就成功將購物車業務透過 Pinia 來進行狀態管理了。
