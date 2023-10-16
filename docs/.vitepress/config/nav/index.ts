import { type DefaultTheme } from 'vitepress';

export function nav(): DefaultTheme.NavItem[] {
  return [
    { text: '關於', link: '/about/', activeMatch: '/about/' },
    { text: 'Vue', link: '/vue/', activeMatch: '/vue/' },
    { text: 'React', link: '/react/redux-toolkit', activeMatch: '/react/' },
    { text: 'TypeScript', link: '/typescript/', activeMatch: '/typescript/' },
    { text: 'Node', link: '/node/basic/commonjs', activeMatch: '/node/' },
    { text: 'JavaScript', link: '/javascript/', activeMatch: '/javascript/' },
    { text: 'CSS', link: '/css/', activeMatch: '/css/' },
    { text: '2023 鐵人賽', link: '/ithelp2023/Day01', activeMatch: '/ithelp2023/' },
    {
      text: 'Tools',
      items: [
        { text: 'Vite', link: '/vite/', activeMatch: '/vite/' },
        { text: 'Git', link: '/git/', activeMatch: '/git/' },
        { text: 'Test', link: '/test/', activeMatch: '/test/' },
      ],
    },
  ];
}
