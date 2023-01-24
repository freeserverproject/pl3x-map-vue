<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import Pl3xMap from './components/pl3x/Pl3xMap.vue';
import Pl3xTileLayer from './components/pl3x/Pl3xTileLayer.vue';

import LMarker from './components/leaflet/LMarker/LMarker.vue';
import LDivIcon from './components/leaflet/LMarker/LIcon/LDivIcon.vue';
import LTooltip from './components/leaflet/LMarker/LTooltip/LTooltip.vue';

import Topbar from './components/topbar/Topbar.vue';
import GIcon from './components/GIcon/GIcon.vue';
import Minetip from './components/tooltip/Minetip.vue';

import { Pl3xConfigStore, Pl3xKey } from './pl3xConfigProvider';
import L from 'leaflet';
import { getDimension, generateHeadURL } from './util';

import Suggestion from 'suggestion4vue';

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
        <LTooltip :options="{
          permanent: true,
          className: 'reset',
          offset: [5, 0]
        }">
          <Minetip class="nameplate">
            <div class="title">
              <img class="pixelated" :src="generateHeadURL(currentWorld?.playerTracker.nameplates.headsURL || '', player)" alt="頭"><small>{{ player.name }}</small>
            </div>
            <div class="state">
              <img class="health" :src="`/images/health/${player.health}.png`" alt="">
              <img class="armor"  :src="`/images/armor/${player.armor}.png`" alt="">
            </div>
          </Minetip>
        </LTooltip>
      </LMarker>
    </template>
  </Pl3xMap>
  <Topbar>
    <Suggestion.SearchBox>
      <GIcon icon="search" class="point-mark search-icon" />
      <Suggestion.Input v-model="searchInput" placeholder="Pl3xMapを検索する" />
      <Suggestion.Box>
        <template v-if="filteredPlayers.length != 0 || filteredWorlds.length != 0">
          <!-- ワールド検索結果 -->
          <Suggestion.Item v-for="[,world] in filteredWorlds" :key="world.name" @pick="() => {loadWorld(world.name, true)}">
            <img
              :src="getDimension(world.type).iconURL"
              class="point-mark pixelated"
            >{{ world.displayName }}<small v-if="world.displayName !== world.name">{{ world.name }}</small>
          </Suggestion.Item>

          <!-- プレイヤー検索結果 -->
          <template v-if="filteredPlayers.length != 0">
            <small>プレイヤー</small>
            <Suggestion.Item v-for="player in filteredPlayers" :key="player.name" @pick="() => {loadWorld(player.world, false, false).then(() => centerOn(player.x, player.z))}">
              <img
                :src="generateHeadURL(currentWorld?.playerTracker.nameplates.headsURL || '', player)"
                class="point-mark pixelated"
              >{{ player.name }}<small>{{ `${player.x} | ${player.z} ${player.world !== currentWorld?.name ? `in ${player.world}` : '' }` }}</small>
            </Suggestion.Item>
          </template>
        </template>
        <template v-else>
          なんにもないよ
        </template>
      </Suggestion.Box>
    </Suggestion.SearchBox>
  </Topbar>
</template>

<style lang="scss" scoped>
.minetip.nameplate {
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    img {
      margin-right: 8px;
      width: 14px;
      height: 14px;
    }

    small {
      flex: 1;
      text-align: left;
      display: inline-block;
      font-size: 12px;
    }
  }

  .state {
    display: flex;
    flex-direction: column;

    img {
      height: 12px;
    }
  }
}
</style>

<style lang="scss" src="./styles/suggestion.scss" scoped></style>
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
