# Components 解答

###### tags: `vue`

## functional component

> [題目連結](https://vuejs-challenges.netlify.app/questions/21-functional-component/README.html)

### 解答

```vue
<script setup>
import { ref, h } from 'vue';

/**
 * Implement the functional component :
 * 1. Render list elements (ul/li) with list data
 * 2. Change the list item text color to be red when click it.
 */

// answer 1:
const ListComponent = (props) => {
  return h(
    'ul',
    props.list.map(({ name }, index) => {
      return h(
        'li',
        {
          key: name,
          class: { active: props['active-index'] === index },
          onClick: () => props.onToggle(index),
        },
        name
      );
    })
  );
};
// ListComponent.props = ['list', 'activeIndex'];

const list = [
  {
    name: 'John',
  },
  {
    name: 'Doe',
  },
  {
    name: 'Smith',
  },
];

const activeIndex = ref(0);

function toggle(index) {
  activeIndex.value = index;
}
</script>

<template>
  <list-component :list="list" :active-index="activeIndex" @toggle="toggle" />
</template>

<style>
.active {
  color: red;
}
</style>
```

* 使用 JSX 寫法
> 要記得補上 lang 才能讓 vue 識別：`<script setup lang="jsx">`
```jsx
// answer 2:
const ListComponent = (props) => {
  return (
    <ul>
      {props.list.map(({ name }, index) => {
        return (
          <li
            key={name}
            class={{ active: props['active-index'] === index }}
            onClick={() => props.onToggle(index)}
          >
            {name}
          </li>
        );
      })}
    </ul>
  );
};
```

> 參考閱讀：[Render Functions & JSX](https://vuejs.org/guide/extras/render-function.html)


## render function[h()]

> [題目連結](https://vuejs-challenges.netlify.app/questions/218-h-render-function/README.html)

### 解答

```vue
<script>
import { h } from 'vue';

export default {
  name: 'MyButton',
  props: {
    disabled: {
      type: Boolean,
    },
  },
  emits: ['customClick'],
  render() {
    return h(
      'button',
      {
        disabled: this.disabled,
        onClick: () => this.$emit('customClick'),
      },
      this.$slots.default()
    );
  },
};
</script>
```
