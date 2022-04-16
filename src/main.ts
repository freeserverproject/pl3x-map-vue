import { createApp } from 'vue';
import App from './App.vue';

import { usePl3xConfig, Pl3xKey } from './pl3xConfigProvider';
import 'leaflet/dist/leaflet.css';

createApp(App)
  .provide(Pl3xKey, usePl3xConfig())
  .mount('#app');
