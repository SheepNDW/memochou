import { type DefaultTheme } from 'vitepress';

export function sidebarTS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'TypeScript Handbook',
      collapsed: false,
      items: [
        { text: 'The Basic', link: '/typescript/handbook/the-basic' },
        { text: 'Everyday Types', link: '/typescript/handbook/everyday-types' },
        { text: 'Narrowing', link: '/typescript/handbook/narrowing' },
        {
          text: 'More on Functions',
          link: '/typescript/handbook/more-on-functions',
        },
        { text: 'Object Types', link: '/typescript/handbook/object-types' },
        {
          text: 'Type Manipulation',
          items: [
            {
              text: 'Creating Types from Types',
              link: '/typescript/handbook/creating-types-from-types',
            },
            { text: 'Generics', link: '/typescript/handbook/generics' },
            {
              text: 'Keyof Type Operator',
              link: '/typescript/handbook/keyof-types',
            },
            {
              text: 'Typeof Type Operator',
              link: '/typescript/handbook/typeof-types',
            },
            {
              text: 'Indexed Access Types',
              link: '/typescript/handbook/indexed-access-types',
            },
            {
              text: 'Conditional Types',
              link: '/typescript/handbook/conditional-types',
            },
            { text: 'Mapped Types', link: '/typescript/handbook/mapped-types' },
            {
              text: 'Template Literal Types',
              link: '/typescript/handbook/template-literal-types',
            },
          ],
        },
        { text: 'Classes', link: '/typescript/handbook/classes' },
        { text: 'Modules', link: '/typescript/handbook/modules' },
      ],
    },
    {
      text: 'TypeScript Notes',
      collapsed: false,
      items: [
        { text: '泛型 Generics', link: '/typescript/generics' },
        { text: '裝飾器 Decorators', link: '/typescript/decorators' },
        { text: 'Partial & Pick', link: '/typescript/partial-pick' },
        { text: 'Readonly & Record', link: '/typescript/readonly-record' },
        { text: 'infer 關鍵字', link: '/typescript/infer' },
      ],
    },
  ];
}
