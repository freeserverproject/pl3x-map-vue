<script lang="ts" setup>
import L from 'leaflet';
import LMap from '../leaflet/LMap/LMap.vue';

const emit = defineEmits<{
  (e: 'ready', map: L.Map): void;
}>();
</script>
<template>
  <LMap
    :options="{
      crs: L.CRS.Simple,
      center: [0, 0],
      attributionControl: false,
      preferCanvas: true,
      zoomControl: false,
      zoomAnimation: true,
      markerZoomAnimation: true
    }"

    @ready="(map) => emit('ready', map)"
  >
    <slot />
  </LMap>
</template>
