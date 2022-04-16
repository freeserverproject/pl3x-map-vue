import { InjectionKey, Ref } from 'vue';

import L from 'leaflet';

export const useLMap = (lMap: Ref<L.Map | undefined>) => ({
  lMap
});
export type LMapStore = ReturnType<typeof useLMap>;
export const LMapKey: InjectionKey<LMapStore> = Symbol('LMap');