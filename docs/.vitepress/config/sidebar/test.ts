import { type DefaultTheme } from 'vitepress';

export function sidebarTest(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vitest',
      items: [
        { text: '[Udemy] Testing Basics', link: '/test/vitest/basics' },
        { text: '[Udemy] Writing Good Tests', link: '/test/vitest/good-tests' },
        {
          text: '[Udemy] Integration Tests',
          link: '/test/vitest/integration-tests',
        },
        {
          text: '[Udemy] Advanced Testing Concepts',
          link: '/test/vitest/advanced',
        },
        { text: '[Udemy] Mocking & Spies', link: '/test/vitest/mocking-spies' },
        { text: '[Udemy] More on Mocking', link: '/test/vitest/more-mocking' },
        { text: '[Udemy] Testing & The DOM', link: '/test/vitest/dom' },
      ],
    },
  ];
}
