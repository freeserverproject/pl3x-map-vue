<script lang="ts" setup>
import { ref } from 'vue';
</script>
<template>
  <nav class="topbar">
    <slot />
  </nav>
</template>
<style lang="scss">
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;
  pointer-events: none;
  box-sizing: border-box;

  > * {
    pointer-events: auto;
  }
}
</style>