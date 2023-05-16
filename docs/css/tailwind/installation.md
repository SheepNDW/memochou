# 安裝 Tailwind CSS

## Vite + Vue 3
> [官方文件連結](https://tailwindcss.com/docs/guides/vite)

1. 在 Vite 專案中安裝 Tailwind，並執行 `npx tailwindcss init -p` 初始化 `tailwind.config.js` 和 `postcss.config.js`

```sh
# npm
npm install -D tailwindcss postcss autoprefixer

# pnpm
pnpm add -D tailwindcss postcss autoprefixer

# 初始化 tailwind
npx tailwindcss init -p
```

2. 在 `tailwind.config.js` 的 content 中填入這兩行：

```js {3-6}
/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. 在 css 檔案中加入 tailwind directives：

```css
/* ./src/assets/styles/index.css (檔案位置可以自訂) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. 在 `main.js` 中匯入

```js {3}
import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/index.css'

createApp(App).mount('#app')
```

## CDN
> [官方文件連結](https://tailwindcss.com/docs/installation/play-cdn)

1. 直接在 HTML 檔案的 `<head>` 插入一個 script 標籤把 CDN 引入即可使用：

```html {6,9-11}
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```

2. 可以在引入 CDN 的 script 標籤後再寫一個 script 去寫 `tailwind.config`：

```html {7-11}
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      // ...
    }
  </script>
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```

3. 使用 `type="text/tailwindcss"` 去客製化樣式：

```html {7-13,16}
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style type="text/tailwindcss">
    @layer utilities {
      .content-auto {
        content-visibility: auto;
      }
    }
  </style>
</head>
<body>
  <div class="lg:content-auto">
    <!-- ... -->
  </div>
</body>
</html>
```
