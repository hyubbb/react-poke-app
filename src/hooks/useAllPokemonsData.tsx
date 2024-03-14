import React, { useEffect, useState } from "react";
import { Ability, PokemonDetail, Sprites, Stat } from "../types/PokemonDetail";
import { FormattedPokemonData } from "../types/FormattedPokemonData";
import axios from "axios";
import {
  FlavorTextEntry,
  PokemonDescription,
} from "../types/PokemonDescription";
import { useDispatch } from "react-redux";
import { allPokemons } from "../stores/pokemon.slice";
import PokemonAllData from "../utils/AllDatas";
// import PokemonAllData from "../utils/AllDaTas";

const useAllPokemonsData = () => {
  const [pokemon, setPokemon] = useState<FormattedPokemonData[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const cachedPokemonData = JSON.parse(localStorage.getItem("pokemonData"));
    if (cachedPokemonData) {
      console.log("localstorage data loaded!");
      setPokemon(cachedPokemonData);
    } else {
      console.log("fetching data from api...");
      fetchAllPokemons();
    }
  }, []);

  const fetchAllPokemons = async () => {
    try {
      // const url = `https://pokeapi.co/api/v2/pokemon/?limit=1025&offset=0`;
      // const pokemonListResponse = await axios.get(url);
      // const pokemonList = pokemonListResponse.data.results;
      // console.log(pokemonList);
      // const pokemonDataPromises = await Promise.all(
      //   pokemonList.map(async (pokemon: FormattedPokemonData) => {
      //     const { data: pokemonData } = await axios.get<PokemonDetail>(
      //       pokemon.url
      //     );
      //     const { name, id, types, weight, height, stats, abilities, sprites } =
      //       pokemonData;

      //     // // detail정보를 위한 데이터 가공
      //     const formattedPokemonData: FormattedPokemonData = {
      //       id,
      //       name,
      //       url: pokemon.url,
      //       koreanName: await pokemonKoreanName(id, name),
      //       weight: weight / 10,
      //       height: height / 10,
      //       previous: id - 1 === 0 ? 1 : id - 1,
      //       next: id + 1,
      //       abilities: formatPokemonAbilities(abilities),
      //       stats: formatPokemonStats(stats),
      //       DamageRelations: [],
      //       type: types[0].type.name,
      //       types: types.map((type) => type.type),
      //       sprites: formatPokemonSprites(sprites),
      //       description: await formatPokemonDescription(name),
      //     };
      //     return formattedPokemonData;
      //   })
      // );
      // setPokemon(pokemonDataPromises);
      // localStorage.setItem("pokemonData", JSON.stringify(pokemonDataPromises));
      // dispatch(allPokemons(pokemonDataPromises));
      setPokemon(PokemonAllData);
      localStorage.setItem("pokemonData", JSON.stringify(PokemonAllData));
      dispatch(allPokemons(PokemonAllData));
    } catch (error) {
      console.log("에러 : " + error);
    }
  };

  const pokemonKoreanName = async (pokeNum: number, pokeName: string) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokeNum}`
      );
      const result =
        response.data.names.find((name) => name.language.name === "ko")?.name ||
        pokeName;

      return result;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // 404 에러 처리
        console.log("데이터가 없는 포켓몬입니다.");
        return pokeName;
      } else {
        return "";
        // 기타 에러 처리
        // console.log("데이터를  가져오는 중 오류가 발생했습니다.");
      }
    }
  };

  const formatPokemonDescription = async (
    id: number | string
  ): Promise<string> => {
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

export default useAllPokemonsData;
