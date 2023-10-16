import { type DefaultTheme } from 'vitepress';

export function sidebarVue(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vue 3 Notes',
      collapsed: false,
      items: [
        { text: 'Vue 3.x 中全域配置 axios', link: '/vue/vue-axios' },
        { text: 'v-model 語法糖原理', link: '/vue/vue-vModel' },
        { text: '初探 Script Setup', link: '/vue/vue-script-setup-guide' },
        { text: 'effectScope API', link: '/vue/vue-effectScope' },
        { text: 'Advanced Ref APIs', link: '/vue/advanced-ref' },
      ],
    },
    {
      text: 'Pinia',
      collapsed: false,
      items: [
        { text: '初識 Pinia', link: '/vue/pinia/pinia-guide' },
        { text: 'Pinia 案例 - 購物車', link: '/vue/pinia/pinia-cart' },
      ],
    },
    {
      text: 'Vue.js challenges',
      collapsed: false,
      items: [
        { text: 'Built-ins', link: '/vue/challenges/built-ins' },
        { text: 'CSS Features', link: '/vue/challenges/css-features' },
        { text: 'Components', link: '/vue/challenges/components' },
        { text: 'Composable Function', link: '/vue/challenges/composable' },
        { text: 'Composition API', link: '/vue/challenges/composition' },
        { text: 'Directives', link: '/vue/challenges/directives' },
        { text: 'Event Handling', link: '/vue/challenges/event-handling' },
      ],
    },
  ];
}
