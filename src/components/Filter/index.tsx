import axios from "axios";
import React, { useEffect, useState } from "react";
import { searchStatus } from "../../stores/pokemon.slice";
import { useDispatch } from "react-redux";
import { koFilterName } from "../../types/FilterData";
import { Generation, Name, Pokemon } from "../../types/DamageRelationsOfType";
import { Species } from "../../types/PokemonDetail";
import { FormattedPokemonData } from "../../types/FormattedPokemonData";
import NotData from "../NotData";

interface FilterProps {
  setDisplayPokemons: any;
  filterDisplayedPokemonData: any;
  setIsLoadingMain: any;
  allPokemons: any;
  setIsNotData: any;
}

const Filter = ({
  setDisplayPokemons,
  filterDisplayedPokemonData,
  setIsLoadingMain,
  allPokemons,
  setIsNotData,
}: FilterProps) => {
  const [filterList, setFilterList] = useState<koFilterName[]>([]);
  // type by type usestate
  const [type, setType] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getFilterList();
  }, []);

  // useEffect(() => {
  //   filteringPokemons(allPokemons);
  // }, [allPokemons]);

  // const filteringPokemons = (pokemons) => {
  //   const filtered = Object.groupBy(pokemons, ({ types }) => types[0]);
  //   setFilteredPokemons(filtered);
  // };

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

  // const getTypedPokemons = async (type: string) => {
  //   dispatch(searchStatus(true));
  //   setIsLoadingMain(true);
  //   setDisplayPokemons(filteredPokemons[type]);
  //   // setDisplayPokemons(result);
  //   // try {
  //   //   const response = await axios.get(
  //   //     `https://pokeapi.co/api/v2/type/${type}`
  //   //   );

  //   //   const result = await filterDisplayedPokemonData(
  //   //     redefineAllPokemons(response.data.pokemon)
  //   //   );
  //   //   setDisplayPokemons(result);
  //   // } catch (error) {
  //   //   console.error(error);
  //   // }
  // };

  const getTypedPokemons = async (type: string) => {
    // 타입별로 리스트를 가져오는데 타입이 2개이상일경우 그것도 비교해서 하나라도 그 타입이 이면 가져오기

    dispatch(searchStatus(true));

    // try {
    //   const response = await axios.get(
    //     `https://pokeapi.co/api/v2/type/${type}`
    //   );
    //   // const result = await filterDisplayedPokemonData(
    //   //   redefineAllPokemons(response.data.pokemon)
    //   // );
    //   const result = redefineAllPokemons(response.data.pokemon);
    //   console.log(result);
    //   setDisplayPokemons(result);
    // } catch (error) {
    //   console.error(error);
    // }

    const result = allPokemons.filter((pokemon: FormattedPokemonData) => {
      if (type === "all") {
        return pokemon.types;
      }
      return pokemon.types.some((pokeType) => pokeType === type);
    });

    console.log(result.length);

    if (result.length === 0) {
      setIsNotData(true);
      setIsLoadingMain(false);
    }

    setDisplayPokemons(result);
  };

  const redefineAllPokemons = (pokemons: Pokemon[]) => {
    const newPokemons = pokemons.map(({ pokemon }) => pokemon);
    return newPokemons;
  };
  // if (!isLoading && !displayPokemons.length) {
  //   return <NotData />;
  // }

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
            // onClick={() => getTypedPokemons("all")}
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
