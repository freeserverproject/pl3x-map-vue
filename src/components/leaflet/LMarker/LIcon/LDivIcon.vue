<script lang="ts" setup>
import { inject, onBeforeMount, onMounted, ref } from 'vue';
import { LMarkerKey, LMarkerStore } from '..';
import L from 'leaflet';

const { setIcon } = inject(LMarkerKey) as LMarkerStore;
const divIcon = ref<HTMLDivElement>();
let icon: L.DivIcon | null = null;

const props = defineProps<{
  options?: L.DivIconOptions
}>();

onMounted(() => {
  icon = new L.DivIcon({
    html: divIcon.value,
    ...props.options
  });

  setIcon(icon);
});

onBeforeMount(() => {
  icon?.remove();
});

</script>
<template>
  <div ref="divIcon">
    <slot />
  </div>
</template>