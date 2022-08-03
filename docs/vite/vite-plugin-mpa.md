# 在 vite 使用 MPA 開發

透過插件 [vite-plugin-mpa](https://github.com/IndexXuan/vite-plugin-mpa) 實現 MPA 架構

## 使用方式

### 1. 安裝 plugin

```sh
# npm
npm i vite-plugin-mpa
# pnpm
pnpm add vite-plugin-mpa
```

### 2. 在 `vite.config.js` 中進行設定

```js {5,9}
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mpa from 'vite-plugin-mpa'; // 引入插件

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mpa()], // 註冊插件
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

### 3. 目錄結構

預設路徑會讀取 `src/pages/*/index.html`，可以參考文檔自行修改

```
├─ src
  └─ pages
     ├─ index
     │  ├─ index.html
     │  └─ main.js
     ├─ foo
     │  ├─ index.html
     │  └─ main.js
     └─ bar
        ├─ index.html
        └─ main.js
```

