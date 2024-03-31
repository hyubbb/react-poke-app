import axios, { all } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Loading } from "../../assets/Loading";
import { LessThan } from "../../assets/LessThan";
import { GreaterThan } from "../../assets/GreaterThan";
import { ArrowLeft } from "../../assets/ArrowLeft";
import { Balance } from "../../assets/Balance";
import { Vector } from "../../assets/Vector";
import Type from "../../components/Type";
import BaseStat from "../../components/BaseStat";
import { FormattedPokemonData } from "../../types/FormattedPokemonData";
import { Ability, Species, Sprites } from "../../types/PokemonDetail";

import { DamageRelationsOfType } from "../../types/DamageRelationsOfType";
import {
  FlavorTextEntry,
  PokemonDescription,
} from "../../types/PokemonDescription";
import NotData from "../../components/NotData";
import DamageRelations from "../../components/DamageRelations";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { searchStatus, setScrollNum } from "../../stores/pokemon.slice";

const DetailPage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [pokemon, setPokemon] = useState<FormattedPokemonData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { id: pokeId } = location.state;
  const { allPokemon } = useAppSelector((state) => state.pokemon);

  useEffect(() => {
    dispatch(searchStatus(true));
  }, []);

  useEffect(() => {
    fetchPokemonData();
    dispatch(setScrollNum(pokeId));
  }, [pokeId, allPokemon]);

  const fetchPokemonData = async () => {
    try {
      const pokemonData = allPokemon?.find(
        ({ id }: { id: number }) => id === pokeId
      );
      if (pokemonData) {
        const { types, sprites, name, abilities } = pokemonData;
        // 비동기작업 한꺼번에 처리 후 리턴,
        const DamageRelations = await Promise.all(
          types.map(async (i: Species) => {
            const type = await axios.get<DamageRelationsOfType>(i.url);
            return type.data.damage_relations;
          })
        );

        // detail정보를 위한 데이터 가공
        const formattedPokemonData: FormattedPokemonData = {
          ...pokemonData,
          DamageRelations,

          description: await formatPokemonDescription(name),
        };

        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("서버에 상세데이터가 없는 포켓몬입니다.");
      setIsLoading(false);
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
      return "";
    }
  };

  if (isLoading) {
    return (
      <div className='absolute h-25 w-25 top-1/3 -translate-x-1/2 left-1/2 z-500'>
        <Loading />
      </div>
    );
  }
  if (!isLoading && !pokemon) {
    console.log(isLoading, pokemon);
    return <NotData />;
  }
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  // console.log(pokemon.types?.[1]);
  const bg = `bg-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  if (!isLoading && pokemon) {
    return (
      <article className={`flex items-center gap-1 flex-col w-full`}>
        <div
          className={`${bg} w-full h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
        >
          {pokemon.previous && (
            <Link
              className={`absolute top-[40%] -translate-y-1/2 z-50 left-1 w-3`}
              to={`/pokemon/${pokemon.previous}`}
              state={{ id: pokemon.id - 1 }}
            >
              <LessThan />
            </Link>
          )}
          {pokemon.next && (
            <Link
              className={`absolute top-[40%] -translate-y-1/2 z-50 right-1 w-3`}
              to={`/pokemon/${pokemon.next}`}
              state={{ id: pokemon.id + 1 }}
            >
              <GreaterThan />
            </Link>
          )}

          <section className='w-full flex flex-col z-20 items-center justify-end relative h-full'>
            <div className='absolute z-30 top-6 flex items-center w-full justify-between px-2'>
              <div className='flex items-center gap-1'>
                <Link to='/'>
                  <ArrowLeft className='w-6 h-0 text-zinc-200' />
                </Link>
                <h1 className='text-zinc-200 font-bold text-5xl capitalize'>
                  {pokemon.koreanName}
                </h1>
              </div>
              <div className='text-zinc-200 font-bold text-2xl'>
                #{pokemon.id.toString().padStart(3, "00")}
              </div>
            </div>

            <div className='relative h-auto max-w-[20rem] z-20 mt-6 -mb-16'>
              <img
                src={img}
                width='100%'
                height='100%'
                loading='lazy'
                alt={pokemon.name}
                className='object-contain h-full'
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </section>

          <section
            className={`w-full mih-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4
        `}
          >
            <div className='flex items-center justify-center gap-4'>
              {pokemon?.types?.map((type, idx) => {
                return <Type key={idx} type={type} />;
              })}
            </div>
            <h2 className={`text-base font-semibold ${text} my-3`}>설명</h2>
            <p className='text-lg leading-5 text-zinc-200 max-w-[30rem] text-center'>
              {pokemon.description}
            </p>
            <h2 className={`text-base font-semibold my-3 ${text}`}>정보</h2>
            <div className='flex w-full items-center justify-between max-w-[400px] text-center'>
              <div className='w-full'>
                <h4 className='text-[1rem] text-zinc-100 font-extrabold capitalize '>
                  weight
                </h4>
                <div className='text-lg flex mt-1 gap-2 justify-center text-zinc-200'>
                  <Balance />
                  {pokemon.weight}
                </div>
              </div>
              <div className='w-full'>
                <h4 className='text-[1rem] text-zinc-100 font-extrabold capitalize '>
                  height
                </h4>
                <div className='text-lg flex mt-1 gap-2 justify-center text-zinc-200'>
                  <Vector />
                  {pokemon.height}
                </div>
              </div>
              <div className='w-full'>
                <h4 className='text-[1rem] text-zinc-100 font-extrabold capitalize '>
                  ability
                </h4>
                {pokemon.abilities.map((ability, i) => (
                  <div key={i} className='text-[1rem] text-zinc-100 capitalize'>
                    {ability}
                  </div>
                ))}
              </div>
            </div>
            <h2 className={`text-base font-semibold my-3 ${text}`}>
              기본 능력치
            </h2>
            <div className='w-full flex justify-center items-center'>
              <table>
                <tbody>
                  {pokemon.stats.map((stat) => (
                    <BaseStat
                      key={stat.name}
                      valueStat={stat.baseStat}
                      nameStat={stat.name}
                      type={pokemon.type}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {pokemon?.DamageRelations && (
              <>
                <h2 className={`text-base font-semibold my-3 ${text}`}>
                  상성 관계성
                </h2>
                <div className='w-10/12'>
                  <h2 className={`text-base text-center font-semibold ${text}`}>
                    <DamageRelations damages={pokemon.DamageRelations} />
                  </h2>
                </div>
              </>
            )}
            <h2 className={`text-base font-semibold my-3 ${text}`}>
              이로치 폼
            </h2>
            <div className='flex justify-center flex-wrap my-3'>
              {[...pokemon.sprites].reverse().map((sprite) => (
                <img key={sprite[0]} src={sprite[1]} width={150} />
              ))}
            </div>
          </section>
        </div>
        {/* {isModalOpen && (
          <DamageModal
            setIsModalOpen={setIsModalOpen}
            damages={pokemon.DamageRelations}
          />
        )} */}
      </article>
    );
  }
};

export default DetailPage;
