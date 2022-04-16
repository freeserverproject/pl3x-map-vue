import { Pl3xPlayer, Pl3xWorldType } from "./config";

export const DIMENSION_COLORS: {
  [key in Pl3xWorldType]: string;
} = {
  'normal': '#a4ec6b',
  'nether': '#ec6b8a',
  'the_end': '#b36bec'
} as const;

export const getDimensionColor = (dimension: Pl3xWorldType): string => DIMENSION_COLORS[dimension];
export const generateHeadURL = (temp: string, player: Pl3xPlayer) => temp.replaceAll('{name}', player.name).replaceAll('{uuid}', player.uuid);
