---
outline: deep
---

# 客製化 Tailwind CSS

Tailwind 支援使用著去擴充或是客製化，可以去 `tailwind.config.js` 或是專案中引入 tailwind 指令的入口檔案中設定

[toc]

## [@layer](https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer)

使用 `@layer` 語法分別去對 `base`、`components`、`utilities` 新增自訂樣式

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /*擴充專案的全站樣式*/
}

@layer components {
  /*自組元件*/
}

@layer utilities{
  /*自組樣式*/
}
```

## Theme

如果想更改預設調色盤、間距比例、排版比例或斷點等內容，可以在 `tailwind.config.js` 檔案裡設定，例如：

```js
module.exports = {
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: { // 直接覆蓋掉原有主題，預設調色盤將失效
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: { // 在原有的主題下進行擴充
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  }
}
```
> 直接設定的話，它會是直接覆蓋掉預設的主題，如果想要在既有的主題下進行擴充，需要在 `extend` 下進行設置

* [範例練習 (客製化 Button)](https://codepen.io/SheepNDW/pen/abYRQJd?editors=1010)

### colors 

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 使用抽象名稱命名自定義顏色
        primary: '#5c6ac4',
        secondary: '#ecc94b',
        // 物件寫法
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
      }
    }
  }
}
```

### container

![](https://i.imgur.com/L3Oh0Nc.png)

Tailwind 提供了預設的 container 樣式，但每個專案的設計稿 container 的寬度都不太一樣，因此 Tailwind 也支持我們去自訂 container 樣式：

```js
module.exports = {
  theme: {
    container: {
      center: true, // 水平置中 (預設的 container 不是置中的要自己寫 mx-auto)
      padding: '2rem', // 水平間距
      padding: { // 水平間距物件寫法
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
}
```

### screens

在 `theme.screens` 自訂 breakpoints

```js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  }
}
```

除了可以去擴充和修改斷點之外，也可以自訂斷點的名稱：

```js
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
}
```
> 使用範例：`tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4`

也可以改成 Max-width breakpoints

```js
module.exports = {
  theme: {
    screens: {
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    }
  }
}
```

### font family

在 `theme.fontFamily` 自訂專案中會用到的字體

* 使用自定義名稱的外部字體

```js
theme: {
  fontFamily: {
    'display': ['"Fredoka One"', 'cursive'],
  }
}
```

* 使用 extend 擴充自定義名稱的外部字體

```js
theme: {
  extend: {
    fontFamily: {
  	'display': ['"Fredoka One"', 'cursive'],
    }
  }
}
```

* 全域設定

```css
@layer base {
  html {
    font-family: 'Fredoka One', 'cursive', system-ui, sans-serif;
  }
}
```

