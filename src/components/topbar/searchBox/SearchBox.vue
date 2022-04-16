<script lang="ts" setup>
import { computed, provide } from 'vue';
import SuggestionBox from './SuggestBox.vue';
import GIcon from '../../GIcon/GIcon.vue';
import { useSearchBoxProvider, SearchBoxKey } from '.';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const searchInput = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

const searchBoxProvider = useSearchBoxProvider();
const { isActive, suggestDown, suggestUp, clickSuggest, searchBox } = searchBoxProvider;
provide(SearchBoxKey, searchBoxProvider);

</script>
<template>
  <div :class="[
    'search-box',
    { 'active': isActive }
  ]">
    <GIcon icon="search" class="point-mark search-icon" />
    <input type="text" placeholder="PL3X Map を検索する" v-model="searchInput" ref="searchBox" @focus="isActive = true" @keydown.down="suggestDown" @keydown.up="suggestUp" @keydown.enter="clickSuggest">
    <SuggestionBox v-if="isActive">
      <slot/>
    </SuggestionBox>
  </div>
</template>
<style lang="scss" scoped>
.search-box {
  background-color: white;
  display: inline-flex;
  position: relative;
  justify-content: center;
  vertical-align: top;
  font-size: 15px;

  box-sizing: border-box;
  padding: 12px 12px 11px 12px;
  margin: 8px 0 0 8px;

  filter: drop-shadow(0 0 3px #0000002f);
  border-radius: 3px;

  &.active {
    border-radius: 3px 3px 0 0;
  }

  :deep() .g-icon.point-mark, :deep() .point-mark {
    width: 20px;
    height: 20px;
    font-size: 20px;
    margin-right: 12px;
    margin-left: 2px;
    color: rgb(125, 125, 125);
    vertical-align: top;
  }

  > input {
    font-family: 'Roboto', Arial, sans-serif;
    font-weight: 400;
    outline: none;
    background-color: transparent;
    vertical-align: baseline;
    padding: 0;
    border: none;
    display: inline-block;
    width: 300px;
  }
}
</style>
