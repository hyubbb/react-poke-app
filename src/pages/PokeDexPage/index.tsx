import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { PokemonData } from "../../types/PokemonData";
import axios from "axios";
import LazyImage from "../../components/LazyImage";
import { Link } from "react-router-dom";
import PokeDex from "./PokeDex";
import { PokemonDetail } from "../../types/PokemonDetail";

const PokedexPage = () => {
  const dispatch = useAppDispatch();
  const { favorite } = useAppSelector((state) => state.pokemon);
  const sortedFavorites = [...favorite].sort((a, b) => a.id - b.id);

  return (
    <div>
      <h1>Pokedex</h1>
      <section className='pt-6 flex flex-col justify-content items-center overflow-hidden z-0'>
        <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center max-w-4xl '>
          {sortedFavorites.map((pokemon: PokemonDetail) => {
            return <PokeDex key={pokemon.name} pokemon={pokemon} />;
          })}
        </div>
      </section>
    </div>
  );
};

export default PokedexPage;
