import { computed, InjectionKey, reactive, ref } from 'vue';
import { requestConfig, Pl3xWorldType, requestWorldConfig, PlayersInfo, requestPlayers } from './config';
import L from 'leaflet';

export interface PrePl3xWorld {
  name: string;
  displayName: string;
  icon: string;
  order: number;
  type: Pl3xWorldType;
}

export interface Pl3xWorld extends PrePl3xWorld {
  markerUpdateInterval: number;
  playerTracker: {
    defaultHiiden: boolean;
    enabled: boolean;
    label: string;
    nameplates: {
      enabled: boolean;
      headsURL: string;
      show: {
        armor: boolean;
        heads: boolean;
        health: boolean;
      }
    }
    priority: number;
    showControls: boolean;
    updateInterval: number;
    zIndex: number;
  }
  spawn: {
    x: number;
    z: number;
  }
  tilesUpdateInterval: number;
  zoom: {
    def: number;
    extra: number;
    max: number;
  }
}

export interface UISetting {
  coordinates: {
    enabled: boolean;
    html: string;
  }
  link: {
    enabled: boolean;
  }
  sidebar: {
    pinned: boolean;
    playerListLabel: string;
    worldListLabel: string;
  }
  title: string;
}

export const usePl3xConfig = () => {
  const worlds = reactive<Map<string, PrePl3xWorld>>(new Map());
  const uiSetting = ref<UISetting | null>(null);
  const currentWorld = ref<Pl3xWorld | null>(null);
  const view = ref<{
    center: L.LatLngExpression,
    zoom: number
  }>({
    center: [0, 0],
    zoom: 0
  });
  const scale = computed(() => (1 / Math.pow(2, currentWorld.value?.zoom.max || 3)));
  const leafletMap = ref<L.Map | null>(null);
  const playersInfo = reactive<PlayersInfo>({
    max: 0,
    players: []
  });

  let loadPlayersHandler: number | null = null;

  const load = async () => {
    const configResponse = await requestConfig();

    worlds.clear();
    for (const world of configResponse.worlds) {
      worlds.set(world.name, {
        name: world.name,
        displayName: world.display_name,
        icon: world.icon,
        order: world.order,
        type: world.type
      });
    }

    uiSetting.value = {
      coordinates: {
        enabled: configResponse.ui.coordinates.enabled,
        html: configResponse.ui.coordinates.html
      },
      link: {
        enabled: configResponse.ui.link.enabled
      },
      sidebar: {
        pinned: configResponse.ui.sidebar.pinned === 'pinned',
        playerListLabel: configResponse.ui.sidebar.player_list_label,
        worldListLabel: configResponse.ui.sidebar.world_list_label
      },
      title: configResponse.ui.title
    };

    loadWorld(configResponse.worlds[0].name);
    if (typeof loadPlayersHandler === 'number') clearInterval(loadPlayersHandler);
    loadPlayers();
    loadPlayersHandler = setInterval(loadPlayers, 1000);
  };

  const loadPlayers = async () => {
    const playersInfoResponse = await requestPlayers();
    playersInfo.max = playersInfoResponse.max;
    playersInfo.players = playersInfoResponse.players;
  }

  const loadWorld = async (name: string, force: boolean = false, centering: boolean = true) => {
    if (!force && currentWorld.value?.name === name) return;

    const preWorld = worlds.get(name);
    if (!preWorld) {
      throw new Error(`Could not find world ${name}`);
    }

    const world = await requestWorldConfig(name);
    if (!world) {
      throw new Error(`Could not load world ${name}`);
    }

    currentWorld.value = {
      ...preWorld,
      markerUpdateInterval: world.marker_update_interval,
      playerTracker: {
        defaultHiiden: world.player_tracker.default_hiiden,
        enabled: world.player_tracker.enabled,
        label: world.player_tracker.label,
        nameplates: {
          enabled: world.player_tracker.nameplates.enabled,
          headsURL: world.player_tracker.nameplates.heads_url,
          show: {
            armor: world.player_tracker.nameplates.show_armor,
            heads: world.player_tracker.nameplates.show_heads,
            health: world.player_tracker.nameplates.show_health
          }
        },
        priority: world.player_tracker.priority,
        showControls: world.player_tracker.show_controls,
        updateInterval: world.player_tracker.update_interval,
        zIndex: world.player_tracker.z_index
      },
      spawn: world.spawn,
      tilesUpdateInterval: world.tiles_update_interval,
      zoom: world.zoom
    }

    if (centering) centerOn(currentWorld.value.spawn.x, currentWorld.value.spawn.z, currentWorld.value.zoom.def);
  }

  const centerOn = (x: number, z: number, zoom: number = leafletMap.value?.options.zoom || currentWorld.value?.zoom.def || 3) => {
    leafletMap.value?.setView(toLatLng(x, z), zoom);
  }

  const toLatLng = (x: number, z: number) => L.latLng(pixelsToMeters(-z), pixelsToMeters(x));
  const pixelsToMeters = (num: number) => num * scale.value;

  return {
    worlds,
    currentWorld,
    uiSetting,
    load,
    loadWorld,
    centerOn,
    view,
    leafletMap,
    playersInfo,
    toLatLng
  };
};

export type Pl3xConfigStore = ReturnType<typeof usePl3xConfig>;
export const Pl3xKey: InjectionKey<Pl3xConfigStore> = Symbol('Pl3xConfig');
