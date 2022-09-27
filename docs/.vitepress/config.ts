export default {
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
        href: 'https://raw.githubusercontent.com/vitejs/vite/main/docs/images/vite.svg',
      },
    ],
  ],
  themeConfig: {
    logo: 'https://raw.githubusercontent.com/vitejs/vite/main/docs/images/vite.svg',
    nav: nav(),
    sidebar: {
      '/vue/': sidebarVue(),
      '/vite/': sidebarVite(),
      '/git/': sidebarGit(),
      '/typescript/': sidebarTS(),
      '/css/': sidebarCSS(),
      '/game-development/': sidebarGameDev(),
      '/test/': sidebarTest(),
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Sheep Yang`,
    },
    outlineTitle: 'ON THIS PAGE',
    docFooter: {
      prev: '前一篇',
      next: '下一篇',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/SheepNDW' }],
  },
  // markdown: {
  //   theme: 'vitesse-dark',
  // },
  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
  },
};

function nav() {
  return [
    { text: '關於', link: '/about/', activeMatch: '/about/' },
    { text: 'Vue', link: '/vue/', activeMatch: '/vue/' },
    { text: 'TypeScript', link: '/typescript/', activeMatch: '/typescript/' },
    { text: 'CSS', link: '/css/', activeMatch: '/css/' },
    {
      text: 'Tools',
      items: [
        { text: 'Vite', link: '/vite/', activeMatch: '/vite/' },
        { text: 'Git', link: '/git/', activeMatch: '/git/' },
        { text: 'Test', link: '/test/', activeMatch: '/test/' },
      ],
    },
    {
      text: 'Game Dev',
      link: '/game-development/',
      activeMatch: '/game-development/',
    },
  ];
}

function sidebarVue() {
  return [
    {
      text: 'Vue 3',
      collapsible: true,
      items: [
        { text: 'Vue 3.x 中全域配置 axios', link: '/vue/vue-axios' },
        { text: 'v-model 語法糖原理', link: '/vue/vue-vModel' },
        { text: '初探 Script Setup', link: '/vue/vue-script-setup-guide' },
        { text: 'effectScope API', link: '/vue/vue-effectScope' },
      ],
    },
    {
      text: 'Pinia',
      collapsible: true,
      items: [
        { text: '初識 Pinia', link: '/vue/pinia/pinia-guide' },
        { text: 'Pinia 案例 - 購物車', link: '/vue/pinia/pinia-cart' },
      ],
    },
    {
      text: 'Vue.js challenges',
      collapsible: true,
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

function sidebarCSS() {
  return [
    {
      text: 'Tailwind CSS',
      collapsible: true,
      items: [
        { text: '安裝 Tailwind', link: '/css/tailwind/installation' },
        { text: '客製化 Tailwind', link: '/css/tailwind/customization' },
      ],
    },
    {
      text: 'Uno CSS',
      collapsible: true,
      items: [{ text: 'UnoCSS 使用', link: '/css/unocss/installation' }],
    },
    {
      text: 'CSS Tricks',
      collapsible: true,
      items: [
        {
          text: '<fieldset> 與 <legend> 標籤',
          link: '/css/css-tricks/fieldset-and-legend',
        },
      ],
    },
  ];
}

function sidebarVite() {
  return [
    {
      text: 'Vite 開發記錄',
      collapsible: true,
      items: [
        { text: '在 vite 使用 MPA 開發', link: '/vite/vite-plugin-mpa' },
        { text: 'unplugin 系列', link: '/vite/vite-unplugin' },
      ],
    },
  ];
}

function sidebarGit() {
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

function sidebarTS() {
  return [
    {
      text: 'TypeScript Handbook',
      collapsible: true,
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
  ];
}

function sidebarGameDev() {
  return [
    {
      text: 'JS 小遊戲',
      collapsible: true,
      items: [
        {
          text: 'Rock paper scissors',
          link: '/game-development/rock-paper-scissors',
        },
        { text: 'Tic Tac Toe', link: '/game-development/tic-tac-toe' },
      ],
    },
  ];
}

function sidebarTest() {
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
