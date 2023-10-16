import { type DefaultTheme } from 'vitepress';

export function sidebarJS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'JavaScripts Notes',
      collapsed: false,
      items: [{ text: 'Functional Programming (FP)', link: '/javascript/functional-programming' }],
    },
    {
      text: 'EcmaScript Notes',
      collapsed: false,
      items: [
        { text: 'ES6 學習筆記 (1)', link: '/javascript/advanced/es6' },
        { text: 'ES6 學習筆記 (2)', link: '/javascript/advanced/es6-2' },
        { text: 'ES6 學習筆記 (3)', link: '/javascript/advanced/es6-3' },
        { text: 'ES8 學習筆記', link: '/javascript/advanced/es8' },
        { text: 'ES9 學習筆記', link: '/javascript/advanced/es9' },
        { text: 'ES10 學習筆記', link: '/javascript/advanced/es10' },
        { text: 'ES11 學習筆記', link: '/javascript/advanced/es11' },
        { text: 'ES12 學習筆記', link: '/javascript/advanced/es12' },
        { text: 'ES13 學習筆記', link: '/javascript/advanced/es13' },
      ],
    },
    {
      text: 'JS 小遊戲',
      collapsed: false,
      items: [
        {
          text: 'Rock paper scissors',
          link: '/javascript/game-development/rock-paper-scissors',
        },
        {
          text: 'Tic Tac Toe',
          link: '/javascript/game-development/tic-tac-toe',
        },
      ],
    },
  ];
}
