<script lang="ts">
export type IconType = 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';
</script>
<script lang="ts" setup>
const porps = withDefaults(
  defineProps<{
    type?: IconType;
    icon: string;
  }>(),
  {
    type: 'outlined'
  }
)
</script>
<template>
  <span :class="[
    'g-icon',
    icon,
    type === 'filled' ? 'material-icons' : `material-icons-${type}`
  ]">
    {{ icon }}
  </span>
</template>
<style lang="scss" scoped>
.g-icon {
  cursor: inherit;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;

  user-select: none;
  vertical-align: top;
}
</style>