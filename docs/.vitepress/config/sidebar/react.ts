import { type DefaultTheme } from 'vitepress';

export function sidebarReact(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Redux',
      collapsed: false,
      items: [{ text: 'Redux Toolkit（RTK）', link: '/react/redux-toolkit' }],
    },
  ];
}
