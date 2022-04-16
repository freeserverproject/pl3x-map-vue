<script lang="ts" setup>
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, reactive } from 'vue';
import { SearchBoxKey, SearchBoxStore, Suggest } from '.';

const instance = getCurrentInstance() || { uid: -1 };

const { addSuggest, removeSuggest, isActive, selectedSuggest } = inject(SearchBoxKey) as SearchBoxStore;
const clickHandler = () => {
  isActive.value = false;
  emit('click');
};
const suggest = reactive<Suggest>({
  handler: clickHandler,
  instance,
  index: -1
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

onMounted(() => {
  addSuggest(suggest);
});

onBeforeUnmount(() => {
  removeSuggest(suggest);
});
</script>
<template>
  <div :class="['suggest-item', {
    selected: selectedSuggest === suggest
  }]" @click="clickHandler" tabindex="-1">
    <slot :index="suggest.index"/>
  </div>
</template>
<style lang="scss" scoped>
.suggest-item {
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow:ellipsis;

  :deep() small {
    color: #7d7d7d;
  }

  &:hover, &.selected {
    background-color: #e9e9e9;
  }
}
</style>