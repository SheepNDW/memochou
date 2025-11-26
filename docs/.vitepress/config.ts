import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { defineConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import { nav } from './config/nav';
import {
  sidebarCSS,
  sidebarGit,
  sidebarIthelp2023,
  sidebarJS,
  sidebarNode,
  sidebarReact,
  sidebarTest,
  sidebarTS,
  sidebarVite,
  sidebarVue,
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
    config(md) {
      md.use(groupIconMdPlugin);
    },
    theme: { light: 'github-light', dark: 'github-dark' },
    math: true,
    // @ts-ignore
    codeTransformers: [transformerTwoslash()],
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
});
