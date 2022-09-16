---
outline: deep
---

# UnoCSS 安裝 & 初始化設定

> [UnoCSS Github](https://github.com/unocss/unocss)
> 
> [UnoCSS Doc](https://uno.antfu.me/)

## Vite + Vue 專案

* 安裝

```sh
# npm
npm i -D unocss

# pnpm
pnpm add -D unocss
```

* 註冊 plugins

```js {6,10}
// vite.config.js
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Unocss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

* 在 main.js 中引入

```js {5}
// main.js
import { createApp } from 'vue';
import App from './App.vue';

import 'uno.css';

createApp(App).mount('#app');
```

## Presets Config

自訂規則 & 預設 Presets：

```js
import { presetUno, presetAttributify, presetIcons, presetWebFonts } from 'unocss';

export default defineConfig({
  plugins: [
    Unocss({
      // 客製自訂的規則
      rules: [['custom-rule', { color: 'red' }]],
      // 類似 Windi 的 shortcuts
      shortcuts: {
        'custom-shortcut': 'text-lg text-orange hover:text-teal',
      },
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          cdn: 'https://esm.sh/', // 使用 CDN
          prefix: 'i-', // 前綴 (預設為 i-)
        }),
        presetWebFonts({
          provider: 'google', // default provider
          fonts: {
            // these will extend the default theme
            sans: 'Roboto',
            mono: ['Fira Code', 'Fira Mono:400,700'],
            // custom ones
            lobster: 'Lobster',
            lato: [
              {
                name: 'Lato',
                weights: ['400', '700'],
                italic: true,
              },
              {
                name: 'sans-serif',
                provider: 'none',
              },
            ],
          },
        }),
      ],
    }),
  ],
});
```

* `presetUno`：提供了熱門 utilities-first 框架，如 Tailwind CSS, Windi CSS, Bootstrap 等框架的 utility 規則。
* `presetAttributify`：開啟 Attributify Mode
* `presetIcons`：使用 Pure CSS Icon，除了使用 CDN 模式也可以直接安裝圖標庫在本地裡 (`npm i -D @iconify-json/[the-collection-you-want]`)
* `presetWebFonts`：使用線上字體 (預設會從 google font 引入)

## Style Resetting

UnoCSS 預設沒有 CSS Reset 或 Preflight 以確保最大的彈性而且不會去擴充你的全域 CSS，因此可以直接與其他 CSS frameworks 一起使用 (他們可能已經 reset 過了)，如果專案中只有 UnoCSS 的話可以安裝 `@unocss/reset` 自行引入：

```sh
npm i @unocss/reset
```

```js
// main.js
// pick one of the following

// normalize.css
import '@unocss/reset/normalize.css'
// reset.css by Eric Meyer https://meyerweb.com/eric/tools/css/reset/index.html
import '@unocss/reset/eric-meyer.css'
// preflights from tailwind
import '@unocss/reset/tailwind.css'
```

## TransFormers

### `@unocss/transformer-directives`
> [參考連結](https://github.com/unocss/unocss/tree/main/packages/transformer-directives)

UnoCSS transformer for `@apply`、`@screen` and `theme()` directive

```js
import { transformerDirectives } from 'unocss';

export default defineConfig({
  plugins: [
    Unocss({
      transformers: [transformerDirectives()],
    }),
  ],
});
```

#### Usage

`@apply`

```css
.custom-div {
  @apply text-center my-0 font-medium;
}
```

### `@unocss/transformer-variant-group`
> [參考連結](https://github.com/unocss/unocss/tree/main/packages/transformer-variant-group)

Enables the variant group feature of Windi CSS for UnoCSS.

```js
import { transformerVariantGroup } from 'unocss';

export default defineConfig({
  plugins: [
    Unocss({
      transformers: [transformerVariantGroup()],
    }),
  ],
});
```

#### Usage：

```html
<div class="hover:(bg-gray-400 font-medium) font-(light mono)"/>
```
