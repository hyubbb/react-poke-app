import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import PokeDex from "./PokeDex";
import { PokemonDetail } from "../../types/PokemonDetail";
import notPokemon from "../../assets/img/404.png";
import { useDispatch } from "react-redux";
import { getFavorite } from "../../stores/pokemon.slice";

const PokedexPage = () => {
  const dispatch = useAppDispatch();
  const [sortedData, setSortedData] = useState<PokemonDetail[]>([]);
  const { favorite } = useAppSelector((state) => state.pokemon);

  useEffect(() => {
    dispatch(getFavorite());
  }, []);

  useEffect(() => {
    filterHandler("low");
  }, [favorite]);

  const filterHandler = (type: string) => {
    if (type === "low") {
      setSortedData([...favorite].sort((a, b) => a.id - b.id));
    } else {
      setSortedData([...favorite].sort((a, b) => b.id - a.id));
    }
  };

  return (
    <div>
      <div>
        <div className=' text-center my-4'>
          <h1>Pokedex</h1>
        </div>
        {favorite.length > 0 && (
          <div className='flex justify-center'>
            <div className='flex gap-4'>
              <div
                className='border-2 p-2 rounded-lg cursor-pointer'
                onClick={() => filterHandler("low")}
              >
                도감 번호 낮은 순
              </div>
              <div
                className='border-2 p-2 rounded-lg cursor-pointer'
                onClick={() => filterHandler("high")}
              >
                도감 번호 높은 순
              </div>
            </div>
          </div>
        )}
      </div>

      {favorite.length ? (
        <section className='pt-6 flex flex-col justify-content items-center overflow-hidden z-0'>
          <div className='flex flex-row flex-wrap p-8 gap-[16px] items-center justify-center max-w-4xl '>
            {sortedData.map((pokemon: PokemonDetail) => {
              return <PokeDex key={pokemon.name} pokemon={pokemon} />;
            })}
          </div>
        </section>
      ) : (
        <div className='flex flex-col items-center justify-center w-full h-full mt-[10%]'>
          <img
            src={notPokemon}
            alt='notPokemon'
            className='w-[40%] h-auto'
            loading='lazy'
          />
          <h1 className='text-3xl font-bold text-[black] mt-5'>
            추가된 포켓몬이 없습니다.
          </h1>
        </div>
      )}
    </div>
  );
};

export default PokedexPage;
