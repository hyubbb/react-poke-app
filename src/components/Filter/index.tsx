import axios from "axios";
import React, { useEffect, useState } from "react";
import { searchStatus } from "../../stores/pokemon.slice";
import { useDispatch } from "react-redux";
import { koFilterName } from "../../types/FilterData";
import { Name, Pokemon } from "../../types/DamageRelationsOfType";
import { Species } from "../../types/PokemonDetail";
import { FormattedPokemonData } from "../../types/FormattedPokemonData";

interface FilterProps {
  setDisplayPokemons: any;
  filterDisplayedPokemonData: any;
  setIsLoadingMain: any;
  allPokemons: any;
  setIsNotData: any;
}
const Filter = ({
  setDisplayPokemons,
  setIsLoadingMain,
  allPokemons,
  setIsNotData,
}: FilterProps) => {
  const [filterList, setFilterList] = useState<koFilterName[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getFilterList();
  }, []);

  const getFilterList = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/`);
      const urls = response.data.results.map((type: Species) => type.url);
      const result = await Promise.all(
        urls.map((url: string) => koTypeName(url))
      );
      setFilterList(result);
    } catch (error) {
      console.error(error);
    }
  };

  const koTypeName = async (url: string) => {
    const response = await axios.get(url);
    const result = response.data.names.reduce(
      (acc: { koName: string; name: string }, curr: Name) => {
        if (curr.language.name === "ko" && curr.name !== "???") {
          acc = { koName: curr.name, name: response.data.name };
        }
        return acc;
      },
      {}
    );
    return result;
  };

  const getTypedPokemons = async (type: string) => {
    dispatch(searchStatus(true));
    const result = allPokemons.filter((pokemon: FormattedPokemonData) => {
      if (type === "all") {
        return pokemon.types;
      }
      return pokemon.types.some(({ name }) => name === type);
    });

    if (result.length === 0) {
      setIsNotData(true);
      setIsLoadingMain(false);
    }

    setDisplayPokemons(result);
  };

  return (
    <div className='relative border-[6px] border-dotted border-[#cac9c9] w-max p-5'>
      <div className='px-3 absolute top-[-1rem] bg-white'>
        <h2>Type filter</h2>
      </div>
      <div className='m-[0_auto]'>
        <ul className='max-w-[500px] flex gap-3 flex-wrap justify-center'>
          <li
            className='border-2 border-solid px-2 rounded-md cursor-pointer'
            onClick={() => location.reload()}
          >
            전부
          </li>
          {filterList.map((filter, index) => {
            if (!filter?.name) {
              return;
            }
            return (
              <li
                key={index}
                className={`bg-${filter?.name} px-2 rounded-md cursor-pointer`}
                onClick={() => getTypedPokemons(filter?.name)}
              >
                {filter?.koName}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Filter;
