import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import PokeDex from "./PokeDex";
import { PokemonDetail } from "../../types/PokemonDetail";

const PokedexPage = () => {
  const dispatch = useAppDispatch();
  const { favorite } = useAppSelector((state) => state.pokemon);
  const [sortedData, setSortedData] = useState<PokemonDetail[]>([]);
  const sortedFavorites = [...favorite].sort((a, b) => a.id - b.id);

  useEffect(() => {
    filterHandler("low");
  }, []);

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
      </div>
      <section className='pt-6 flex flex-col justify-content items-center overflow-hidden z-0'>
        <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center max-w-4xl '>
          {sortedData.map((pokemon: PokemonDetail) => {
            return <PokeDex key={pokemon.name} pokemon={pokemon} />;
          })}
        </div>
      </section>
    </div>
  );
};

export default PokedexPage;
