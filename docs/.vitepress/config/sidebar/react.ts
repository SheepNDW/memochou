import { type DefaultTheme } from 'vitepress';

export function sidebarReact(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '原理',
      collapsed: false,
      items: [{ text: 'vdom, fiber and diff', link: '/react/react-internals/vdom' }],
    },
    {
      text: 'Redux',
      collapsed: false,
      items: [{ text: 'Redux Toolkit（RTK）', link: '/react/redux-toolkit' }],
    },
  ];
}
