import { reactive, ref, watch } from 'vue';
import type { ComponentInternalInstance, Ref, InjectionKey } from 'vue';

export interface Suggest {
  instance: ComponentInternalInstance | { uid: number }
  handler: () => void;
  index: number;
};

export const useSearchBoxProvider = () => {
  const suggestMap = reactive<Map<number, Suggest>>(new Map());
  const suggestQueue = ref<Suggest[]>([]);
  const selectedSuggest = ref<Suggest | null>(null);
  const searchBox = ref<HTMLInputElement | null>(null);
  const suggestionBox = ref<HTMLDivElement>();
  const isActive = ref(false);

  const currentSuggestIndex = () => suggestQueue.value.findIndex(suggest => suggest === selectedSuggest.value);

  const suggestUp = () => {
    if (selectedSuggest.value === null) {
      selectedSuggest.value = suggestQueue.value[suggestQueue.value.length - 1] || null;
    } else {
      const index = currentSuggestIndex();
      if (index === -1) {
        selectedSuggest.value = suggestQueue.value[0];
      } else if (index > 0) {
        selectedSuggest.value = suggestQueue.value[index - 1];
      } else {
        selectedSuggest.value = null;
      }
    }
  }

  const suggestDown = () => {
    if (selectedSuggest.value === null) {
      selectedSuggest.value = suggestQueue.value[0] || null;
    } else {
      const index = currentSuggestIndex();
      if (index === -1) {
        selectedSuggest.value = suggestQueue.value[0];
      } else if (index < suggestQueue.value.length - 1) {
        selectedSuggest.value = suggestQueue.value[index + 1];
      } else {
        selectedSuggest.value = null;
      }
    }
  }

  const clickSuggest = () => {
    if (selectedSuggest.value) {
      searchBox.value?.blur();
      selectedSuggest.value.handler();
    }
  };

  const addSuggest = (suggest: Suggest) => suggest.instance.uid !== -1 ? suggestMap.set(suggest.instance.uid, suggest) : void 0;
  const removeSuggest = (suggest: Suggest) => {
    suggestMap.delete(suggest.instance.uid);
  }

  const otherClickHandler = (e: MouseEvent) => {
    if (isActive.value 
      && (
        (suggestionBox.value && !suggestionBox.value.contains(e.target as Node))
        && (searchBox.value && !searchBox.value.contains(e.target as Node))
      )
    ) {
      isActive.value = false;
    }
  }

  watch(isActive, () =>
    isActive.value
    ? document.addEventListener('mousedown', otherClickHandler)
    : document.removeEventListener('mousedown', otherClickHandler));

  return {
    suggestQueue,
    searchBox,
    suggestionBox,
    addSuggest,
    removeSuggest,
    selectedSuggest,
    isActive,
    suggestUp,
    suggestDown,
    clickSuggest,
    suggestMap
  };
};

export type SearchBoxStore = ReturnType<typeof useSearchBoxProvider>;
export const SearchBoxKey: InjectionKey<SearchBoxStore> = Symbol('SearchBox');
