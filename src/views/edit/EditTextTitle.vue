<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <h1>{{ title }}</h1>
</template>

<style lang="scss">
h1 {
  margin: 40px 0 64px;
  font-size: var(--o-font_size-display1);
  font-weight: 400;
  color: var(--o-color-text2);
}
</style>
