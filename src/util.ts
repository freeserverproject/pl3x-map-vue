import { Pl3xPlayer, Pl3xWorldType } from "./config";

export const DIMENSIONS: {
  [key in Pl3xWorldType]: {
    color: string;
    iconURL: string;
  };
} = {
  'normal': {
    color: '#a4ec6b',
    iconURL: 'assets/icon/normal.webp'
  },
  'nether': {
    color: '#ec6b8a',
    iconURL: 'assets/icon/nether.webp'
  },
  'the_end': {
    color: '#b36bec',
    iconURL: 'assets/icon/the_end.webp'
  }
} as const;

export const getDimension = (dimension: Pl3xWorldType) => DIMENSIONS[dimension];
export const generateHeadURL = (temp: string, player: Pl3xPlayer) => temp.replaceAll('{name}', player.name).replaceAll('{uuid}', player.uuid);
