import { InjectionKey, ref } from "vue";

export const useLMarker = () => {
  const lMarker = ref<L.Marker | null>(null);

  const setIcon = (icon: L.Icon | L.DivIcon) => {
    console.log(!!lMarker.value);
    lMarker.value?.setIcon(icon);
  };

  return {
    lMarker,
    setIcon
  };
}

export type LMarkerStore = ReturnType<typeof useLMarker>;
export const LMarkerKey: InjectionKey<LMarkerStore> = Symbol('LMarker');
