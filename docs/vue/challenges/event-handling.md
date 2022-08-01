# Event Handling 解答

###### tags: `vue`

## prevent event propagation

> [題目連結](https://vuejs-challenges.netlify.app/questions/243-prevent-event-propagation/README.html)

### 解答

```vue
<script setup>
const click1 = () => {
  console.log('click1');
};

const click2 = () => {
  console.log('click2');
};
</script>

<template>
  <div @click="click1()">
    <div @click.stop="click2()">click me</div>
  </div>
</template>
```

## Key Modifiers

> [題目連結](https://vuejs-challenges.netlify.app/questions/232-key-modifiers/README.html)

### 解答

```vue
<template>
  <!-- Add key modifiers made this will fire even if Alt or Shift is also pressed -->
  <button @click.alt.shift.exact="onClick1" class="btn">A</button>

  <!-- Add key modifiers made this will only fire when Shift and no other keys are pressed -->
  <button @click.shift.exact="onCtrlClick" class="btn">A</button>

  <!-- Add key modifiers made this will only fire when no system modifiers are pressed -->
  <button @click.exact="onClick2" class="btn">A</button>
</template>
```


