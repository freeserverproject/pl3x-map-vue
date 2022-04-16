<script lang="ts" setup>
import { onMounted, provide, ref, useSlots } from 'vue';
import L from 'leaflet';
import { LMapKey, useLMap } from '.';

const root = ref<HTMLElement>();
const lMap = ref<L.Map>();

provide(LMapKey, useLMap(lMap));

const props = defineProps<{
    options?: L.MapOptions;
}>();

const emit = defineEmits<{
    (e: 'ready', map: L.Map): void;
}>();

onMounted(() => {
  if (!root.value) return;
  lMap.value = new L.Map(root.value, props.options);
  emit('ready', lMap.value);
});
</script>
<template>
  <div class="l-map" ref="root">
    <slot />
  </div>
</template>
