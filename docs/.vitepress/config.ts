import { defineConfig } from 'vitepress';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { nav } from './config/nav';
import {
  sidebarVue,
  sidebarVite,
  sidebarGit,
  sidebarTS,
  sidebarCSS,
  sidebarJS,
  sidebarNode,
  sidebarReact,
  sidebarTest,
  sidebarIthelp2023,
} from './config/sidebar';

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
    search: {
      provider: 'local',
    },
  },
  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    math: true,
    codeTransformers: [transformerTwoslash()],
  },
});
