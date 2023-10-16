import { type DefaultTheme } from 'vitepress';

export function sidebarVite(): DefaultTheme.SidebarItem[] {
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
