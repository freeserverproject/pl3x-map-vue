<script lang="ts">
import { computed, defineComponent, h, inject, nextTick, watch } from 'vue';
import { SearchBoxKey, SearchBoxStore, Suggest } from './';
import { getVNodesByType } from '@tsutoringo/vue-utils';

import SuggestItem from './SuggestItem.vue';

export default defineComponent({
  setup (props, { slots }) {
    const defaultSlot = computed(() => slots.default?.());
    const { suggestMap, suggestQueue, suggestionBox } = inject(SearchBoxKey) as SearchBoxStore;

    watch(() => suggestMap.size, () => {
      if (!defaultSlot.value) return;
      const suggestItemNodes = getVNodesByType(defaultSlot.value, SuggestItem);
      nextTick(() => {
        suggestQueue.value = suggestItemNodes
          .filter(suggest => {
            return suggestMap.has(suggest.component?.uid || -1)
          })
          .reduce((a: Suggest[], suggestComponent, index) => {
            const suggest = suggestMap.get(suggestComponent.component?.uid || -1);
            if (suggest) {
              suggest.index = index;
              a.push(suggest);
            };
            return a;
          }, []);
      });
    });

    return () => h('div', {
      class: 'suggest-box',
      ref: suggestionBox
    }, [
      defaultSlot.value,
    ]);
  }
});
</script>
<style lang="scss" scoped>
.suggest-box {
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 0 0 3px 3px;
  position: absolute;
  top: 100%;
  background-color: inherit;
  overflow: hidden;
  padding-bottom: 3px;
  width: 100%;
}
</style>