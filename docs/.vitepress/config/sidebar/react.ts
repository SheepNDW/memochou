import { type DefaultTheme } from 'vitepress';

export function sidebarReact(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '原理',
      collapsed: false,
      items: [{ text: 'vdom, fiber and diff', link: '/react/react-internals/vdom' }],
    },
    {
      text: 'Hooks',
      collapsed: false,
      items: [
        { text: 'useState', link: '/react/hooks/useState' },
        { text: 'useRef', link: '/react/hooks/useRef' },
        { text: 'useImperativeHandle', link: '/react/hooks/useImperativeHandle' },
        { text: 'useEffect', link: '/react/hooks/useEffect' },
        { text: 'useLayoutEffect', link: '/react/hooks/useLayoutEffect' },
        { text: 'useReducer', link: '/react/hooks/useReducer' },
        { text: 'useImmer', link: '/react/hooks/useImmer' },
      ],
    },
    {
      text: 'Redux',
      collapsed: false,
      items: [{ text: 'Redux Toolkit（RTK）', link: '/react/redux-toolkit' }],
    },
  ];
}
