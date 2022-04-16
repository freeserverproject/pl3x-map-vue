<script lang="ts" setup>
import L from 'leaflet';
import { onMounted, ref, inject, onUnmounted, withDefaults, defineProps } from 'vue';
import type { LMapStore } from './LMap/';
import { LMapKey } from './LMap/';

interface TilelayerOptions {
  url: string;
  options?: L.TileLayerOptions;
}

const { lMap } = inject(LMapKey) as LMapStore;

const lTileLayer = ref<L.TileLayer>();
const props = withDefaults(
  defineProps<TilelayerOptions>(),
  {
  }
);

onMounted(() => {
  lTileLayer.value = new L.TileLayer(props.url, props.options);
  lMap.value && lMap.value.addLayer(lTileLayer.value);
});

onUnmounted(() => {
  if (lTileLayer.value && lMap.value) lMap.value.removeLayer(lTileLayer.value);
});
</script>
