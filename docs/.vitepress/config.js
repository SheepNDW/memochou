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
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You',
    },
    outlineTitle: '頁面大綱',
    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
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
  ];
}
