import { Tooltip } from 'leaflet';
import { InjectionKey, ref } from "vue";
import type L from 'leaflet';

export const useLMarker = () => {
  const lMarker = ref<L.Marker | null>(null);

  const setIcon = (icon: L.Icon | L.DivIcon) => {
    lMarker.value?.setIcon(icon);
  };

  const bindTooltip = (tooltip: L.Tooltip, options?: L.TooltipOptions) => {
    lMarker.value?.bindTooltip(tooltip, options);
  }

  const unbindTooltip = () => {
    lMarker.value?.unbindTooltip();
  }

  return {
    lMarker,
    setIcon,
    bindTooltip,
    unbindTooltip
  };
}

export const defineMarkerProps = () =>defineProps<{
  latLng: L.LatLng;
  options?: L.MarkerOptions;
}>();

export type LMarkerStore = ReturnType<typeof useLMarker>;
export const LMarkerKey: InjectionKey<LMarkerStore> = Symbol('LMarker');
