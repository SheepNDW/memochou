import { type DefaultTheme } from 'vitepress';

export function sidebarNode(): DefaultTheme.SidebarItem[] {
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
