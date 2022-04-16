<script lang="ts" setup>
import { inject, onBeforeMount, onMounted } from 'vue';
import { LMarkerKey, LMarkerStore } from '..';
import L from 'leaflet';

const { setIcon } = inject(LMarkerKey) as LMarkerStore;
let icon: L.Icon | null = null;

const props = defineProps<{
  options: L.IconOptions;
}>();

onMounted(() => {
  icon = new L.Icon(props.options);
  setIcon(icon);
});

onBeforeMount(() => {
  icon?.remove();
});
</script>
