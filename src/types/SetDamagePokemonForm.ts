export interface SetDamagePokemonForm {
  double_damage?: Damage[];
  half_damage?: Damage[];
  no_damage?: any[];
}

export interface Damage {
  damageValue: string;
  name: string;
  url: string;
}

export interface DamageFromAndTo {
  to: SetDamagePokemonForm;
  from: SetDamagePokemonForm;
}
