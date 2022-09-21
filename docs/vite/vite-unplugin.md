# Unplugin 系列插件

## [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)

自動引入 vue 子元件，不需要再自行去引入

```sh
# npm
npm i -D unplugin-vue-components
```

```js
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({ /* options */ }),
  ],
})
```

## [unplugin-icons](https://github.com/antfu/unplugin-icons)

icon 插件，支援各種使用方式

圖標庫 https://icones.js.org/

* 安裝

```sh
npm i -D unplugin-icons

# 全安裝
npm i -D @iconify/json

# 按需安裝 @iconify-json/[collection-id]
npm i -D @iconify-json/mdi
```

```js
// 自動安裝
Icons({
  // expiremental
  autoInstall: true,
})
```

* 註冊：

```js
// vite.config.js
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    Icons({
      autoInstall: true,
    }),
  ],
  // ...
});
```

### 配合 `unplugin-vue-components` 使用

```js
// vite.config.js
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default {
  plugins: [
    Vue(),
    Components({
      resolvers: [
        IconsResolver(),
      ],
    }),
    Icons(),
  ],
}
```

如果要自訂 prefix 可以參考 https://github.com/antfu/unplugin-icons#name-conversion

```javascript
IconsResolver({
  prefix: 'icon', // <-- 預設為 i
})
```
