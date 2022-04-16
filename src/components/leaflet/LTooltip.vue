<script lang="ts" setup>
import L, { Marker } from 'leaflet';
import { inject, onMounted } from 'vue';
import { LMarkerKey, LMarkerStore } from './LMarker';

const { lMarker } = inject(LMarkerKey) as LMarkerStore;
const props = defineProps<{
  options?: L.TooltipOptions;
}>();

onMounted(() => {
  const ltooltip = new L.Tooltip(props.options);
  lMarker.value && lMarker.value.bindTooltip(ltooltip);
});
</script>
<template>

</template>