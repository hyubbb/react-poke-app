import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormattedPokemonData } from "../types/FormattedPokemonData";
import { useDispatch } from "react-redux";
import { setAllPokemons } from "../stores/pokemon.slice";
import { useAppSelector } from "./redux";
import { Ability, PokemonDetail, Sprites, Stat } from "../types/PokemonDetail";
import {
  FlavorTextEntry,
  Name,
  PokemonDescription,
} from "../types/PokemonDescription";
import PokemonAllData from "../utils/AllDatas";
const useAllPokemonsData = () => {
  const [pokemon, setPokemon] = useState<FormattedPokemonData[]>([]);
  const dispatch = useDispatch();
  const { allPokemon } = useAppSelector((state) => state.pokemon);

  useEffect(() => {
    const cachedPokemonDataString = localStorage.getItem("pokemonData");
    const cachedPokemonData = cachedPokemonDataString
      ? JSON.parse(cachedPokemonDataString)
      : null;
    if (cachedPokemonData) {
      // console.log("localstorage data loaded!");
      setPokemon(cachedPokemonData);
    } else {
      // console.log("fetching data from api...");
      // fetchAllPokemons();
      fetchAllPokemonsFile();
    }
  }, []);

  const fetchAllPokemonsFile = async () => {
    setPokemon(PokemonAllData);
    localStorage.setItem("pokemonData", JSON.stringify(PokemonAllData));
    dispatch(setAllPokemons(PokemonAllData));
  };

  const fetchAllPokemons = async () => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=1025&offset=0`;
      const pokemonListResponse = await axios.get(url);
      const pokemonList = pokemonListResponse.data.results;
      const pokemonDataPromises = await Promise.all(
        pokemonList.map(async (pokemon: FormattedPokemonData) => {
          const { data: pokemonData } = await axios.get<PokemonDetail>(
            pokemon.url
          );
          const { name, id, types, weight, height, stats, abilities, sprites } =
            pokemonData;
          // // detail정보를 위한 데이터 가공
          const formattedPokemonData: FormattedPokemonData = {
            id,
            name,
            url: pokemon.url,
            koreanName: await pokemonKoreanName(id, name),
            weight: weight / 10,
            height: height / 10,
            previous: id - 1 === 0 ? 1 : id - 1,
            next: id + 1,
            abilities: formatPokemonAbilities(abilities),
            stats: formatPokemonStats(stats),
            DamageRelations: [],
            type: types[0].name,
            types: types.map((type) => type),
            sprites: formatPokemonSprites(sprites),
            description: "",
          };
          return formattedPokemonData;
        })
      );
      setPokemon(pokemonDataPromises);
      localStorage.setItem("pokemonData", JSON.stringify(pokemonDataPromises));
      dispatch(setAllPokemons(pokemonDataPromises));
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
        response.data.names.find((name: Name) => name.language.name === "ko")
          ?.name || pokeName;

      return result;
    } catch (error) {
      if (error.response && error.response?.status === 404) {
        console.log("데이터가 없는 포켓몬입니다.");
        return pokeName;
      } else {
        console.log("데이터를  가져오는 중 오류가 발생했습니다.");
        return "";
      }
    }
  };

  const formatPokemonAbilities = (abilities: Ability[]) => {
    return abilities
      .filter((_, i) => i <= 1)
      .map((obj: Ability) => obj.ability.name.replaceAll("-", " "));
  };
  const formatPokemonSprites = (sprites: Sprites): any => {
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

    let data = Object.entries(objects);

    const array = [];
    let minus = data.length / 2;
    for (let i = 0; i < data.length; i++) {
      if (i % 2 == 0) {
        // 0246
        array[i] = data[i / 2];
      } else {
        // 1357
        array[i] = data[data.length - minus];
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
};

export default useAllPokemonsData;
