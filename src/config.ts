export const ENDPOINTS = {
  config: './tiles/settings.json',
  worldConfig: (name: string) => `./tiles/${name}/settings.json`,
  markers: (name: string) => `./tiles/${name}/markers.json`,
  players: './tiles/players.json'
};

export type Pl3xWorldType = 'normal' | 'nether' | 'the_end';

export interface ConfigResponse {
  ui: {
    coordinates: {
      enabled: boolean;
      html: string;
    };
    link: {
      enabled: boolean;
    };
    sidebar: {
      pinned: 'pinned' | 'unpinned';
      player_list_label: string;
      world_list_label: string;
    },
    title: string
  },
  worlds: {
    name: string;
    display_name: string;
    icon: string;
    order: number;
    type: Pl3xWorldType;
  }[]
}

interface WorldConfigResponse {
  marker_update_interval: number;
  player_tracker: {
    default_hiiden: boolean;
    enabled: boolean;
    label: string;
    nameplates: {
      enabled: boolean;
      heads_url: string;
      show_armor: boolean;
      show_heads: boolean;
      show_health: boolean;
    }
    priority: number;
    show_controls: boolean;
    update_interval: number;
    z_index: number;
  }
  spawn: {
    x: number;
    z: number;
  }
  tiles_update_interval: number;
  zoom: {
    def: number;
    extra: number;
    max: number;
  }
}

export interface PlayersInfo {
  max: number;
  players: Pl3xPlayer[];
}

export interface Pl3xPlayer {
  armor: number;
  health: number;
  name: string;
  uuid: string;
  world: string;
  x: number;
  z: number;
  yaw: number;
}

export interface Pl3xMarkerPoint {
  x: number;
  z: number;
}

export type Pl3xMarkerType = 'polyline' | 'rectangle' | 'icon';

export interface Pl3xMarkerBase {
  type: Pl3xMarkerType;
}

export interface Pl3xPolyLineMarker extends Pl3xMarkerBase {
  color: string;
  points: Pl3xMarkerPoint[];
  tooltip: string;
  type: 'polyline';
}

export interface Pl3xRectangleMarker extends Pl3xMarkerBase {
  color: string;
  fillColor: string;
  points: Pl3xMarkerPoint[];
  popup: string;
  type: 'rectangle';
  weight: number;
}

export interface Pl3xIconMarker extends Pl3xMarkerBase {
  icon: string;
  anchor: Pl3xMarkerPoint;
  point: Pl3xMarkerPoint;
  size: Pl3xMarkerPoint;
  tooltip: string;
  tooltip_anchor: Pl3xMarkerPoint;
  type: 'icon';
}

export type Pl3xMarker = Pl3xPolyLineMarker | Pl3xRectangleMarker | Pl3xIconMarker;

export interface Pl3xMarkerLayer {
  control: boolean;
  hide: boolean;
  markers: Pl3xMarker[];
  name: string;
  order: number;
  timestamp: number;
  z_index: number;
}

export type Pl3xMarkerLayers = Pl3xMarkerLayer[]

export const requestConfig = async (): Promise<ConfigResponse> => await (await fetch(ENDPOINTS.config)).json();
export const requestWorldConfig = async (name: string): Promise<WorldConfigResponse> => await (await fetch(ENDPOINTS.worldConfig(name))).json();
export const requestPlayers = async (): Promise<PlayersInfo> => await (await fetch(ENDPOINTS.players)).json();
export const requestMarkers = async (name: string): Promise<Pl3xMarkerLayers> => await (await fetch(ENDPOINTS.markers(name))).json();
