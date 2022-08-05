export default {
  lang: 'zh-Hant-TW',
  title: 'シープの雑談メモ帳',
  description: '前端筆記&日常',
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
      '/game-development/': sidebarGameDev(),
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
  markdown: {
    theme: 'vitesse-dark',
  },
  // markdown: {
  //   theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
  // },
};

function nav() {
  return [
    { text: '關於', link: '/about/', activeMatch: '/about/' },
    { text: 'Vue', link: '/vue/', activeMatch: '/vue/' },
    { text: 'TypeScript', link: '/typescript/', activeMatch: '/typescript/' },
    {
      text: 'Tools',
      items: [
        { text: 'Vite', link: '/vite/', activeMatch: '/vite/' },
        { text: 'Git', link: '/git/', activeMatch: '/git/' },
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
      text: 'Vue Notes',
      collapsible: true,
      items: [{ text: '關於', link: '/vue/' }],
    },
    {
      text: 'Vue 3',
      collapsible: true,
      items: [
        { text: 'Vue 3.x 中全域配置 axios', link: '/vue/vue-axios' },
        { text: 'v-model 語法糖原理', link: '/vue/vue-vModel' },
        { text: '初探 Script Setup', link: '/vue/vue-script-setup-guide' },
      ],
    },
    {
      text: 'Pinia',
      collapsible: true,
      items: [
        { text: '初識 Pinia', link: '/vue/pinia-guide' },
        { text: 'Pinia 案例 - 購物車', link: '/vue/pinia-cart' },
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

function sidebarVite() {
  return [
    {
      text: 'Vite 開發記錄',
      collapsible: true,
      items: [
        { text: '關於', link: '/vite/' },
        { text: '在 vite 使用 MPA 開發', link: '/vite/vite-plugin-mpa' },
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
        { text: 'The Basic', link: '/typescript/' },
        { text: 'Everyday Types', link: '/typescript/everyday-types' },
        { text: 'Narrowing', link: '/typescript/narrowing' },
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
