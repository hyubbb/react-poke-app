import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loading } from "../../assets/Loading";
import { LessThan } from "../../assets/LessThan";
import { GreaterThan } from "../../assets/GreaterThan";
import { ArrowLeft } from "../../assets/ArrowLeft";
import { Balance } from "../../assets/Balance";
import { Vector } from "../../assets/Vector";
import Type from "../../components/Type";
import BaseStat from "../../components/BaseStat";
import DamageRelations from "../../components/DamageRelations";
import DamageModal from "../../components/DamageModal";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const pokeId = params.id;
  const baseUrl = "https://pokeapi.co/api/v2/pokemon/";
  useEffect(() => {
    fetchPokemonData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchPokemonData();
  }, [pokeId]);

  const fetchPokemonData = async () => {
    const url = `${baseUrl}${pokeId}`;
    try {
      const { data: pokemonData } = await axios.get(url);
      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities, sprites } =
          pokemonData;
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

        // 비동기작업 한꺼번에 처리 후 리턴,
        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations;
          })
        );

        // detail정보를 위한 데이터 가공
        const formattedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          DamageRelations,
          types: types.map((type) => type.type.name),
          sprites: formatPokemonSprites(sprites),
          description: await formatPokemonDescription(name),
        };

        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const getNextAndPreviousPokemon = async (id) => {
    // id -1 을 하는 이유는 현재값이 5이면 (5-1)해서 4다음부터 limits=1 1개의 값을 가져오겟다.
    // 즉 5를 불러오는거라서 -1
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;
    const { data: pokemonData } = await axios.get(urlPokemon);

    const nextResponse =
      pokemonData.next && (await axios.get(pokemonData.next));
    const previousResponse =
      pokemonData.previous && (await axios.get(pokemonData.previous));

    return {
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name,
    };
  };

  const formatPokemonDescription = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

    const { data: pokemonSpecies } = await axios.get(url);
    const result = filterFormatDescription(pokemonSpecies.flavor_text_entries);

    return result[Math.floor(Math.random() * result.length)];
  };

  const filterFormatDescription = (flavorText) => {
    const koreanDescripiton = flavorText
      ?.filter((text) => text.language.name == "ko")
      .map((text) => text.flavor_text.replace(/\r|\n|\f/g, " "));
    return koreanDescripiton;
  };

  const formatPokemonAbilities = (abilities) => {
    return abilities
      .filter((_, i) => i <= 1)
      .map((obj) => obj.ability.name.replaceAll("-", " "));
  };

  const formatPokemonSprites = (sprites) => {
    const newSprites = { ...sprites };

    Object.keys(newSprites).forEach((key) => {
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
    // console.log(Object.entries(objects).length);

    objects = Object.entries(objects);
    // console.log(Object.entries(newSprites));
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

    // console.log(array);
    // console.log(newSprites);
    // return Object.values(newSprites);
    return array;
  };

  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEP,
    statSPD,
  ]) => {
    return [
      { name: "Hit points", baseStat: statHP.base_stat },
      { name: "Attack", baseStat: statATK.base_stat },
      { name: "Defense", baseStat: statDEP.base_stat },
      { name: "Special Attack", baseStat: statSATK.base_stat },
      { name: "Special Defense", baseStat: statSDEP.base_stat },
      { name: "Speed", baseStat: statSPD.base_stat },
    ];
  };
  if (isLoading) {
    return (
      <div className='absolute h-25 w-25 top-1/3 -translate-x-1/2 left-1/2 z-500'>
        <Loading rand={Math.floor(Math.random() * 2) + 1} />
      </div>
    );
  }

  if (!isLoading && !pokemon) {
    return <div>not found</div>;
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  // console.log(pokemon.types?.[1]);
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;

  if (!isLoading && pokemon) {
    return (
      <article className={`flex items-center gap-1 flex-col w-full`}>
        <div
          className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
        >
          {pokemon.previous && (
            <Link
              className={`absolute top-[40%] -translate-y-1/2 z-50 left-1 w-3`}
              to={`/pokemon/${pokemon.previous}`}
            >
              <LessThan />
            </Link>
          )}
          {pokemon.next && (
            <Link
              className={`absolute top-[40%] -translate-y-1/2 z-50 right-1 w-3`}
              to={`/pokemon/${pokemon.next}`}
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
                <h1 className='text-zinc-200 font-bold text-xl capitalize'>
                  {pokemon.name}
                </h1>
              </div>
              <div className='text-zinc-200 font-bold text-medium'>
                #{pokemon.id.toString().padStart(3, "00")}
              </div>
            </div>

            <div className='relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16'>
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
              {/* <Type
              type={pokemon.types}
              damageValue={pokemon.DamageRelations}
            ></Type> */}

              {pokemon.types.map((type) => (
                <Type key={type} type={type} />
              ))}
            </div>
            <h2 className={`text-base font-semibold my-3 ${text}`}>정보</h2>

            <div className='flex w-full items-center justify-between max-w-[400px] text-center'>
              <div className='w-full'>
                <h4 className='text-[0.5rem] text-zinc-100 font-extrabold capitalize '>
                  weight
                </h4>
                <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-200'>
                  <Balance />
                  {pokemon.weight}
                </div>
              </div>
              <div className='w-full'>
                <h4 className='text-[0.5rem] text-zinc-100 font-extrabold capitalize '>
                  height
                </h4>
                <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-200'>
                  <Vector />
                  {pokemon.height}
                </div>
              </div>
              <div className='w-full'>
                <h4 className='text-[0.5rem] text-zinc-100 font-extrabold capitalize '>
                  ability
                </h4>
                {pokemon.abilities.map((ability, i) => (
                  <div
                    key={ability}
                    className='text-[0.5rem] text-zinc-100 capitalize'
                  >
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
                      type={pokemon.types[0]}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* {pokemon.damage_relations ?? (
            <div className='w-10/12'>
              <h2 className={`text-base text-center font-semibold ${text}`}>
                <DamageRelations damages={pokemon.DamageRelations} />
              </h2>
            </div>
          )} */}

            <h2 className={`text-base font-semibold ${text} my-3`}>설명</h2>
            <p className='text-md leading-4 font-sans text-zinc-200 max-w-[30rem] text-center'>
              {pokemon.description}
            </p>
            {/* 
            <div className='flex justify-center flex-wrap my-3'>
              {pokemon.sprites.reverse().map((sprite) => (
                <img key={sprite} src={sprite} />
              ))}
            </div> */}

            <div className='flex justify-center flex-wrap my-3'>
              {pokemon.sprites.reverse().map((sprite) => (
                <img key={sprite[0]} src={sprite[1]} />
              ))}
            </div>
          </section>
        </div>
        {isModalOpen && (
          <DamageModal
            setIsModalOpen={setIsModalOpen}
            damages={pokemon.DamageRelations}
          />
        )}
      </article>
    );
  }
};

export default DetailPage;
