import React, { useEffect, useState } from "react";
import { Ability, PokemonDetail, Sprites, Stat } from "../types/PokemonDetail";
import { FormattedPokemonData } from "../types/FormattedPokemonData";
import axios from "axios";
import { PokemonData } from "../types/PokemonData";
import {
  FlavorTextEntry,
  PokemonDescription,
} from "../types/PokemonDescription";
import { DamageRelationsOfType } from "../types/DamageRelationsOfType";

interface NextAndPreviousPokemon {
  next: string | undefined;
  previous: string | undefined;
}
3;
const AuseAllPokemonsData = () => {
  const [pokemon, setPokemon] = useState<FormattedPokemonData[]>([]);
  const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

  useEffect(() => {
    fetchAllPokemons();
  }, []);

  const fetchAllPokemons = async () => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=10000&offset=0`;
      const pokemonListResponse = await axios.get(url);
      const pokemonList = pokemonListResponse.data.results;
      // console.log(pokemonList);
      const pokemonDataPromises = await Promise.all(
        pokemonList.map(async (pokemon) => {
          const { data: pokemonData } = await axios.get<PokemonDetail>(
            pokemon.url
          );
          const { name, id, types, weight, height, stats, abilities, sprites } =
            pokemonData;
          // const nextAndPreviousPokemon: NextAndPreviousPokemon =
          //   await getNextAndPreviousPokemon(id);
          // // 비동기작업 한꺼번에 처리 후 리턴,
          // const DamageRelations = await Promise.all(
          //   types.map(async (i) => {
          //     const type = await axios.get<DamageRelationsOfType>(i.type.url);
          //     return type.data.damage_relations;
          //   })
          // );
          // // detail정보를 위한 데이터 가공
          const formattedPokemonData: FormattedPokemonData = {
            id,
            name,
            koreanName: await pokemonKoreanName(id, name),
            weight: weight / 10,
            height: height / 10,
            previous: "",
            next: "",
            abilities: formatPokemonAbilities(abilities),
            stats: formatPokemonStats(stats),
            DamageRelations: [],
            types: types.map((type) => type.type.name),
            sprites: formatPokemonSprites(sprites),
            description: await formatPokemonDescription(name),
          };
          return formattedPokemonData;
        })
      );
      // Promise.all을 사용하여 모든 포켓몬 상세 정보 요청이 완료될 때까지 기다립니다.
      // const allPokemonData = await Promise.all(pokemonDataPromises);
      // console.log(pokemonDataPromises);
      // setPokemon(allPokemonData);
      // 이제 allPokemonData에는 모든 포켓몬의 이름과 타입이 포함되어 있습니다.
      // 이 데이터를 로컬에 저장하거나 상태 관리 라이브러리에 저장하여 사용할 수 있습니다.

      setPokemon(pokemonDataPromises);
    } catch (error) {
      console.log("에러 : " + error);
    }
  };

  const pokemonKoreanName = async (pokeNum: number, pokeName: string) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokeNum}`
      );
      const koreanName =
        response.data.names.find((name) => name.language.name === "ko")?.name ||
        pokeName;
      return koreanName;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // 404 에러 처리
        //console.log("데이터가 없는 포켓몬입니다.");
        return pokeName;
      } else {
        // 기타 에러 처리
        console.log("데이터를 가져오는 중 오류가 발생했습니다.");
      }
    }
  };

  const formatPokemonDescription = async (id: number): Promise<string> => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    try {
      const { data: pokemonSpecies } = await axios.get<PokemonDescription>(url);
      const result: string[] = filterFormatDescription(
        pokemonSpecies.flavor_text_entries
      );
      return result[Math.floor(Math.random() * result.length)];
    } catch (error) {
      return [];
    }
  };

  const filterFormatDescription = (flavorText: FlavorTextEntry[]): string[] => {
    const koreanDescripiton = flavorText
      ?.filter((text: FlavorTextEntry) => text.language.name == "ko")
      .map((text: FlavorTextEntry) =>
        text.flavor_text.replace(/\r|\n|\f/g, " ")
      );
    return koreanDescripiton;
  };

  const formatPokemonAbilities = (abilities: Ability[]) => {
    return abilities
      .filter((_, i) => i <= 1)
      .map((obj: Ability) => obj.ability.name.replaceAll("-", " "));
  };

  const formatPokemonSprites = (sprites: Sprites) => {
    const newSprites = { ...sprites };

    (Object.keys(newSprites) as (keyof typeof newSprites)[]).forEach((key) => {
      if (typeof newSprites[key] !== "string") {
        delete newSprites[key];
      }
    });

    let objects = Object.entries(newSprites).reduce(
      (accumulator, value, index) => {
        return (accumulator = { [index]: value[1], ...accumulator });
      },
      {}
    );
    objects = Object.entries(objects);

    const array = [];
    let minus = objects.length / 2;
    for (let i = 0; i < objects.length; i++) {
      if (i % 2 == 0) {
        // 0246
        array[i] = objects[i / 2];
        // console.log(i, leng / 2 + i);
      } else {
        // 1357
        array[i] = objects[objects.length - minus];
        minus--;
      }
    }

    return array;
  };

  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEP,
    statSPD,
  ]: Stat[]) => {
    return [
      { name: "Hit points", baseStat: statHP.base_stat },
      { name: "Attack", baseStat: statATK.base_stat },
      { name: "Defense", baseStat: statDEP.base_stat },
      { name: "Special Attack", baseStat: statSATK.base_stat },
      { name: "Special Defense", baseStat: statSDEP.base_stat },
      { name: "Speed", baseStat: statSPD.base_stat },
    ];
  };

  return pokemon;
  // return <div> sibal</div>;
};

export default AuseAllPokemonsData;
