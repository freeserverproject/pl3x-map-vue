<script lang="ts" setup>
import { inject, onBeforeMount, onMounted, ref } from 'vue';
import { LMarkerKey, LMarkerStore } from '..';
import L from 'leaflet';

const { bindTooltip, unbindTooltip } = inject(LMarkerKey) as LMarkerStore;
const tooltipEl = ref<HTMLDivElement>();
let lTooltip: L.Tooltip | null = null;

const props = defineProps<{
  options?: L.TooltipOptions
}>();

onMounted(() => {
  lTooltip = new L.Tooltip(props.options);
  console.log(tooltipEl);

  if (tooltipEl.value) lTooltip.setContent(tooltipEl.value);

  bindTooltip(lTooltip);
});

onBeforeMount(() => {
  unbindTooltip();
});
</script>

<template>
  <div class="l-tooltip" ref="tooltipEl">
    <slot />
  </div>
</template>

<style lang="scss">
.leaflet-tooltip.reset {
  &.reset {
    padding: 0;
    background: inherit;
    border: inherit;
    border-radius: inherit;
    color: inherit;
    box-shadow: inherit;
    &.leaflet-tooltip-left::before, &.leaflet-tooltip-right::before {
      pointer-events: none;
      border: none;
      background: none;
    }
  }
}
</style>