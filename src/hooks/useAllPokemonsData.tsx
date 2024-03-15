import React, { useEffect, useState } from "react";
import { FormattedPokemonData } from "../types/FormattedPokemonData";
import { useDispatch } from "react-redux";
import { setAllPokemons } from "../stores/pokemon.slice";
import PokemonAllData from "../utils/AllDatas";
import { useAppSelector } from "./redux";

const useAllPokemonsData = () => {
  const [pokemon, setPokemon] = useState<FormattedPokemonData[]>([]);
  const dispatch = useDispatch();
  const { allPokemon } = useAppSelector((state) => state.pokemon);

  useEffect(() => {
    if (!allPokemon.length) {
      console.log("fetching data from api...");
      dispatch(setAllPokemons(PokemonAllData));
      setPokemon(PokemonAllData);
    } else {
      console.log("localstorage data loaded!");
      setPokemon(allPokemon);
    }
  }, []);

  return pokemon;
};

export default useAllPokemonsData;
