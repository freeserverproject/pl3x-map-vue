<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import Pl3xMap from './components/pl3x/Pl3xMap.vue';
import Pl3xTileLayer from './components/pl3x/Pl3xTileLayer.vue';

import LMarker from './components/leaflet/LMarker/LMarker.vue';
import LDivIcon from './components/leaflet/LMarker/LIcon/LDivIcon.vue';

import Topbar from './components/topbar/Topbar.vue';
import SuggestItem from './components/topbar/searchBox/SuggestItem.vue';
import SearchBox from './components/topbar/searchBox/SearchBox.vue';
import GIcon from './components/GIcon/GIcon.vue';

import { Pl3xConfigStore, Pl3xKey } from './pl3xConfigProvider';
import L from 'leaflet';
import { getDimensionColor, generateHeadURL } from './util';

const { currentWorld, view, leafletMap, worlds, playersInfo, load, loadWorld, centerOn, toLatLng } = inject(Pl3xKey) as Pl3xConfigStore;
const searchInput = ref('');

const leafletReady = (map: L.Map) => {
  leafletMap.value = map;
  load();
}

const filteredWorlds = computed(() => searchInput.value === ''
  ? Array.from(worlds)
  : Array.from(worlds).filter(([,world]) => world.displayName.toLowerCase().includes(searchInput.value.toLowerCase())));
const filteredPlayers = computed(() => searchInput.value === ''
  ? (playersInfo.players)
  : (playersInfo.players).filter((player) => player.name.toLowerCase().includes(searchInput.value.toLowerCase())));
</script>
<template>
  <Pl3xMap :view="view" @ready="leafletReady">
    <Pl3xTileLayer v-if="currentWorld" :world="currentWorld" />
    <!-- Player Marker -->
    <template v-for="player in playersInfo.players">
      <LMarker v-if="player.world === currentWorld?.name" :key="player.uuid" :lat-lng="toLatLng(player.x, player.z)">
        <LDivIcon :options="{
          className: 'player-icon'
        }">
          <img src="./assets/player.png" :style="{
            transform: `rotateZ(${player.yaw + 180}deg)`,
          }">
        </LDivIcon>
      </LMarker>
    </template>
  </Pl3xMap>
  <Topbar>
    <SearchBox v-model="searchInput">
      <!-- ワールド検索結果 -->
      <SuggestItem v-for="[,world] in filteredWorlds" :key="world.name" @click="() => {loadWorld(world.name, true)}">
        <GIcon icon="public" class="point-mark" :style="{
          color: getDimensionColor(world.type),
        }"/>
        {{ world.displayName }} <small v-if="world.displayName !== world.name">{{ world.name }}</small>
      </SuggestItem>
      <!-- プレイヤー検索結果 -->
      <SuggestItem v-for="player in filteredPlayers" :key="player.name" @click="() => {loadWorld(player.world, false, false).then(() => centerOn(player.x, player.z))}">
        <img
          :src="generateHeadURL(currentWorld?.playerTracker.nameplates.headsURL || '', player)"
          class="point-mark pixelated"
        >
        {{ player.name }} <small>{{ `${player.x} | ${player.z} ${player.world !== currentWorld?.name ? `in ${player.world}` : '' }` }}</small>
      </SuggestItem>
    </SearchBox>
  </Topbar>
</template>

<style lang="scss">
.l-map {
  width: 100vw;
  height: 100vh;
}

.leaflet-div-icon {
  background-color: #00000000;
  border: none;
}
</style>
<style lang="scss">
img.pixelated {
  image-rendering: pixelated;
}

.leaflet-marker-pane img, .player-icon {
  transition: all 0.25s;
}
body {
  margin: 0;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
