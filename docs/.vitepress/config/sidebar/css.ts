import { type DefaultTheme } from 'vitepress';

export function sidebarCSS(): DefaultTheme.SidebarItem[] {
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
