import { defineConfig, type DefaultTheme } from 'vitepress';
import mathjax3 from 'markdown-it-mathjax3';
import { customElements } from './config/markdown';

export default defineConfig({
  base: '/memochou/',
  lang: 'zh-Hant-TW',
  title: 'シープの雑談メモ帳',
  description: '前端筆記&日常',
  lastUpdated: true,
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/logo/code-sheep-light.svg',
      },
    ],
  ],
  themeConfig: {
    logo: '/logo/code-sheep-light.svg',
    nav: nav(),
    sidebar: {
      '/vue/': sidebarVue(),
      '/vite/': sidebarVite(),
      '/git/': sidebarGit(),
      '/typescript/': sidebarTS(),
      '/node/': sidebarNode(),
      '/css/': sidebarCSS(),
      '/javascript/': sidebarJS(),
      '/test/': sidebarTest(),
      '/react/': sidebarReact(),
      '/ithelp2023/': sidebarIthelp2023(),
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Sheep Yang`,
    },
    outline: {
      label: 'ON THIS PAGE',
    },
    docFooter: {
      prev: '前一篇',
      next: '下一篇',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/SheepNDW' }],
  },
  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    config: (md) => {
      md.use(mathjax3);
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: '關於', link: '/about/', activeMatch: '/about/' },
    { text: 'Vue', link: '/vue/', activeMatch: '/vue/' },
    { text: 'React', link: '/react/redux-toolkit', activeMatch: '/react/' },
    { text: 'TypeScript', link: '/typescript/', activeMatch: '/typescript/' },
    { text: 'Node', link: '/node/basic/commonjs', activeMatch: '/node/' },
    { text: 'JavaScript', link: '/javascript/', activeMatch: '/javascript/' },
    { text: 'CSS', link: '/css/', activeMatch: '/css/' },
    { text: '2023 鐵人賽', link: '/ithelp2023/Day01', activeMatch: '/ithelp2023/' },
    {
      text: 'Tools',
      items: [
        { text: 'Vite', link: '/vite/', activeMatch: '/vite/' },
        { text: 'Git', link: '/git/', activeMatch: '/git/' },
        { text: 'Test', link: '/test/', activeMatch: '/test/' },
      ],
    },
  ];
}

function sidebarVue(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vue 3 Notes',
      collapsed: false,
      items: [
        { text: 'Vue 3.x 中全域配置 axios', link: '/vue/vue-axios' },
        { text: 'v-model 語法糖原理', link: '/vue/vue-vModel' },
        { text: '初探 Script Setup', link: '/vue/vue-script-setup-guide' },
        { text: 'effectScope API', link: '/vue/vue-effectScope' },
        { text: 'Advanced Ref APIs', link: '/vue/advanced-ref' },
      ],
    },
    {
      text: 'Pinia',
      collapsed: false,
      items: [
        { text: '初識 Pinia', link: '/vue/pinia/pinia-guide' },
        { text: 'Pinia 案例 - 購物車', link: '/vue/pinia/pinia-cart' },
      ],
    },
    {
      text: 'Vue.js challenges',
      collapsed: false,
      items: [
        { text: 'Built-ins', link: '/vue/challenges/built-ins' },
        { text: 'CSS Features', link: '/vue/challenges/css-features' },
        { text: 'Components', link: '/vue/challenges/components' },
        { text: 'Composable Function', link: '/vue/challenges/composable' },
        { text: 'Composition API', link: '/vue/challenges/composition' },
        { text: 'Directives', link: '/vue/challenges/directives' },
        { text: 'Event Handling', link: '/vue/challenges/event-handling' },
      ],
    },
  ];
}

function sidebarCSS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Tailwind CSS',
      collapsed: false,
      items: [
        { text: '安裝 Tailwind', link: '/css/tailwind/installation' },
        { text: '客製化 Tailwind', link: '/css/tailwind/customization' },
      ],
    },
    {
      text: 'Uno CSS',
      collapsed: false,
      items: [{ text: 'UnoCSS 使用', link: '/css/unocss/installation' }],
    },
    {
      text: 'CSS Tricks',
      collapsed: false,
      items: [
        {
          text: 'fieldset 與 legend 標籤',
          link: '/css/css-tricks/fieldset-and-legend',
        },
      ],
    },
  ];
}

function sidebarVite(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vite 開發記錄',
      items: [
        { text: '在 vite 使用 MPA 開發', link: '/vite/vite-plugin-mpa' },
        { text: 'unplugin 系列', link: '/vite/vite-unplugin' },
      ],
    },
  ];
}

function sidebarGit(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Git 學習筆記',
      items: [
        { text: '安裝並配置 Git', link: '/git/' },
        { text: 'Git 的基本操作', link: '/git/git-basics' },
        { text: 'Git 分支', link: '/git/git-branch' },
        { text: 'Git 遠端分支操作', link: '/git/git-remote' },
      ],
    },
  ];
}

function sidebarTS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'TypeScript Handbook',
      collapsed: false,
      items: [
        { text: 'The Basic', link: '/typescript/handbook/the-basic' },
        { text: 'Everyday Types', link: '/typescript/handbook/everyday-types' },
        { text: 'Narrowing', link: '/typescript/handbook/narrowing' },
        {
          text: 'More on Functions',
          link: '/typescript/handbook/more-on-functions',
        },
        { text: 'Object Types', link: '/typescript/handbook/object-types' },
        {
          text: 'Type Manipulation',
          items: [
            {
              text: 'Creating Types from Types',
              link: '/typescript/handbook/creating-types-from-types',
            },
            { text: 'Generics', link: '/typescript/handbook/generics' },
            {
              text: 'Keyof Type Operator',
              link: '/typescript/handbook/keyof-types',
            },
            {
              text: 'Typeof Type Operator',
              link: '/typescript/handbook/typeof-types',
            },
            {
              text: 'Indexed Access Types',
              link: '/typescript/handbook/indexed-access-types',
            },
            {
              text: 'Conditional Types',
              link: '/typescript/handbook/conditional-types',
            },
            { text: 'Mapped Types', link: '/typescript/handbook/mapped-types' },
            {
              text: 'Template Literal Types',
              link: '/typescript/handbook/template-literal-types',
            },
          ],
        },
        { text: 'Classes', link: '/typescript/handbook/classes' },
        { text: 'Modules', link: '/typescript/handbook/modules' },
      ],
    },
    {
      text: 'TypeScript Notes',
      collapsed: false,
      items: [
        { text: '泛型 Generics', link: '/typescript/generics' },
        { text: '裝飾器 Decorators', link: '/typescript/decorators' },
        { text: 'Partial & Pick', link: '/typescript/partial-pick' },
        { text: 'Readonly & Record', link: '/typescript/readonly-record' },
        { text: 'infer 關鍵字', link: '/typescript/infer' },
      ],
    },
  ];
}

function sidebarJS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'JavaScripts Notes',
      collapsed: false,
      items: [{ text: 'Functional Programming (FP)', link: '/javascript/functional-programming' }],
    },
    {
      text: 'EcmaScript Notes',
      collapsed: false,
      items: [
        { text: 'ES6 學習筆記 (1)', link: '/javascript/advanced/es6' },
        { text: 'ES6 學習筆記 (2)', link: '/javascript/advanced/es6-2' },
        { text: 'ES6 學習筆記 (3)', link: '/javascript/advanced/es6-3' },
        { text: 'ES8 學習筆記', link: '/javascript/advanced/es8' },
        { text: 'ES9 學習筆記', link: '/javascript/advanced/es9' },
        { text: 'ES10 學習筆記', link: '/javascript/advanced/es10' },
        { text: 'ES11 學習筆記', link: '/javascript/advanced/es11' },
        { text: 'ES12 學習筆記', link: '/javascript/advanced/es12' },
        { text: 'ES13 學習筆記', link: '/javascript/advanced/es13' },
      ],
    },
    {
      text: 'JS 小遊戲',
      collapsed: false,
      items: [
        {
          text: 'Rock paper scissors',
          link: '/javascript/game-development/rock-paper-scissors',
        },
        {
          text: 'Tic Tac Toe',
          link: '/javascript/game-development/tic-tac-toe',
        },
      ],
    },
  ];
}

function sidebarNode(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Node.js 基礎',
      collapsed: false,
      items: [
        { text: 'CommonJS modules', link: '/node/basic/commonjs' },
        { text: 'npm', link: '/node/basic/npm' },
        { text: 'Built-in Modules', link: '/node/basic/built-in' },
        { text: 'Route', link: '/node/basic/route' },
      ],
    },
    {
      text: 'Express',
      collapsed: false,
      items: [
        { text: 'Express 基本使用', link: '/node/express/basic-usage' },
        { text: 'Express Middleware', link: '/node/express/middleware' },
      ],
    },
  ];
}

function sidebarTest(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vitest',
      items: [
        { text: '[Udemy] Testing Basics', link: '/test/vitest/basics' },
        { text: '[Udemy] Writing Good Tests', link: '/test/vitest/good-tests' },
        {
          text: '[Udemy] Integration Tests',
          link: '/test/vitest/integration-tests',
        },
        {
          text: '[Udemy] Advanced Testing Concepts',
          link: '/test/vitest/advanced',
        },
        { text: '[Udemy] Mocking & Spies', link: '/test/vitest/mocking-spies' },
        { text: '[Udemy] More on Mocking', link: '/test/vitest/more-mocking' },
        { text: '[Udemy] Testing & The DOM', link: '/test/vitest/dom' },
      ],
    },
  ];
}

function sidebarReact(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Redux',
      collapsed: false,
      items: [{ text: 'Redux Toolkit（RTK）', link: '/react/redux-toolkit' }],
    },
  ];
}

function sidebarIthelp2023(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '前端可以會的資結&演算法',
      collapsed: false,
      items: [
        {
          text: 'Day 01 - 前言與系列文簡介',
          link: '/ithelp2023/Day01',
        },
        {
          text: 'Day 02 - 什麼是資料結構？演算法又是什麼？',
          link: '/ithelp2023/Day02',
        },
        {
          text: 'Day 03 - 時間與空間複雜度',
          link: '/ithelp2023/Day03',
        },
        {
          text: 'Day 04 - Stack',
          link: '/ithelp2023/Day04',
        },
        {
          text: 'Day 05 - Queue',
          link: '/ithelp2023/Day05',
        },
        {
          text: 'Day 06 - Deque',
          link: '/ithelp2023/Day06',
        },
        {
          text: 'Day 07 - Linked List (1)',
          link: '/ithelp2023/Day07',
        },
        {
          text: 'Day 08 - Linked List (2)',
          link: '/ithelp2023/Day08',
        },
        {
          text: 'Day 09 - Hash Table',
          link: '/ithelp2023/Day09',
        },
        {
          text: 'Day 10 - Sequential Search & Binary Search',
          link: '/ithelp2023/Day10',
        },
        {
          text: 'Day 11 - Tree & Binary Tree',
          link: '/ithelp2023/Day11',
        },
        {
          text: 'Day 12 - Tree 的深度優先走訪',
          link: '/ithelp2023/Day12',
        },
        // {
        //   text: 'Day 13 - Tree 的廣度優先走訪 & 印出一棵 Tree',
        //   link: '/ithelp2023/Day13',
        // },
        // {
        //   text: 'Day 14 - Binary Search Tree',
        //   link: '/ithelp2023/Day14',
        // },
        // {
        //   text: 'Day 15 - Heap',
        //   link: '/ithelp2023/Day15',
        // },
        // {
        //   text: 'Day 16 - Priority Queue',
        //   link: '/ithelp2023/Day16',
        // },
        // {
        //   text: 'Day 17 - 排序簡介 & Bubble Sort',
        //   link: '/ithelp2023/Day17',
        // },
        // {
        //   text: 'Day 18 - Selection Sort & Insertion Sort',
        //   link: '/ithelp2023/Day18',
        // },
        // {
        //   text: 'Day 19 - Shell Sort',
        //   link: '/ithelp2023/Day19',
        // },
        // {
        //   text: 'Day 20 - Merge Sort',
        //   link: '/ithelp2023/Day20',
        // },
        // {
        //   text: 'Day 21 - Quick Sort',
        //   link: '/ithelp2023/Day21',
        // },
        // {
        //   text: 'Day 22 - Counting Sort & Bucket Sort',
        //   link: '/ithelp2023/Day22',
        // },
        // {
        //   text: 'Day 23 - Radix Sort',
        //   link: '/ithelp2023/Day23',
        // },
        // {
        //   text: 'Day 24 - Sorting 總結',
        //   link: '/ithelp2023/Day24',
        // },
        // {
        //   text: 'Day 25 - Fisher-Yates Shuffle',
        //   link: '/ithelp2023/Day25',
        // },
        // {
        //   text: 'Day 26 - Backtracking (1)',
        //   link: '/ithelp2023/Day26',
        // },
        // {
        //   text: 'Day 27 - Backtracking (2)',
        //   link: '/ithelp2023/Day27',
        // },
        // {
        //   text: 'Day 28 - Dynamic Programming (1)',
        //   link: '/ithelp2023/Day28',
        // },
        // {
        //   text: 'Day 29 - Dynamic Programming (2)',
        //   link: '/ithelp2023/Day29',
        // },
      ],
    },
  ];
}
