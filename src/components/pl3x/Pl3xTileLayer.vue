<script lang="ts">
import L from 'leaflet';
import { inject, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import type { Pl3xWorld } from '../../pl3xConfigProvider';
import type { LMapStore } from '../leaflet/LMap';
import { LMapKey } from '../leaflet/LMap';

export class TileLayer extends L.TileLayer {
  createTile (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = document.createElement('img');

    L.DomEvent.on(tile, 'load', () => {
      URL.revokeObjectURL(tile.src);
      this._tileOnLoad(done, tile);
    });
    L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));

    if (this.options.crossOrigin || this.options.crossOrigin === '') tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;

    tile.alt = '';
    tile.setAttribute('role', 'presentation');
    tile.classList.add('pixelated');

    fetch(this.getTileUrl(coords))
      .then(res => {
        if (!res.ok) return this._tileOnError(done, tile, new Error(res.statusText));
        res.blob().then(blob => {
          tile.src = URL.createObjectURL(blob);
        });
      }).catch(err => this._tileOnError(done, tile, err));

    return tile;
  }
}
</script>
<script lang="ts" setup>


const { lMap } = inject(LMapKey) as LMapStore;
const pl3xTileLayer = ref<TileLayer>();

const props = withDefaults(
  defineProps<{
    world: Pl3xWorld
  }>(),
  {}
);

onMounted(() => {
  pl3xTileLayer.value = new TileLayer(`tiles/${props.world.name}/{z}/{x}_{y}.png`, {
    maxNativeZoom: 3,
    minNativeZoom: 0,
    tileSize: 512
  });

  lMap.value && pl3xTileLayer.value.addTo(lMap.value);
});

watchEffect(() => {
  if (pl3xTileLayer.value)
    pl3xTileLayer.value.setUrl(`tiles/${props.world.name}/{z}/{x}_{y}.png`);
});

onUnmounted(() => {
  pl3xTileLayer.value && lMap.value?.removeLayer(pl3xTileLayer.value);
  pl3xTileLayer.value = undefined;
});

</script>
<template></template>
