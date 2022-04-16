<script lang="ts" setup>
import L from 'leaflet';
import { inject, onMounted, onUnmounted, provide, toRefs, watch } from 'vue';
import { LMapKey, LMapStore } from '../LMap';
import { useLMarker, LMarkerKey } from '.';

const lMarkerProvider = useLMarker()
provide(LMarkerKey ,lMarkerProvider)

const { lMap } = inject(LMapKey) as LMapStore;
const { lMarker } = lMarkerProvider;

const props = defineProps<{
  latLng: L.LatLng;
  options?: L.MarkerOptions;
}>();

lMarker.value = new L.Marker(props.latLng, props.options);

onMounted(() => {
  lMap.value && lMarker.value && lMarker.value.addTo(lMap.value);
});

watch(toRefs(props).latLng, (nv, ov) => {
  if (nv.equals(ov)) return;
  if (lMarker.value) lMarker.value.setLatLng(props.latLng);
});

onUnmounted(() => {
  lMap.value && lMarker.value && lMarker.value.removeFrom(lMap.value);
});
</script>
<template>
  <slot />
</template>
