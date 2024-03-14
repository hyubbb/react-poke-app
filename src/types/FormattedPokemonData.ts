import { Species } from "./PokemonDetail";

export interface FormattedPokemonData {
  id: number;
  name: string;
  url: string;
  koreanName: string;
  weight: number;
  height: number;
  previous: number | undefined;
  next: number | undefined;
  abilities: string[];
  stats: Stat[];
  DamageRelations: DamageRelation[];
  type: string;
  types: Species[];
  sprites: Array<string[]>;
  description: string;
}

export interface DamageRelation {
  double_damage_from: DoubleDamageFrom[];
  double_damage_to: DoubleDamageFrom[];
  half_damage_from: DoubleDamageFrom[];
  half_damage_to: DoubleDamageFrom[];
  no_damage_from: any[];
  no_damage_to: DoubleDamageFrom[];
}

export interface DoubleDamageFrom {
  name: string;
  url: string;
}

export interface Stat {
  name: string;
  baseStat: number;
}
