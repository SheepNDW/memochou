import { type DefaultTheme } from 'vitepress';

export function sidebarGit(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Git 學習筆記',
      items: [
        { text: '安裝並配置 Git', link: '/git/' },
        { text: 'Git 的基本操作', link: '/git/git-basics' },
        { text: 'Git 分支', link: '/git/git-branch' },
        { text: 'Git 遠端分支操作', link: '/git/git-remote' },
      ],
    },
  ];
}
