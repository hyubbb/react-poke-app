import axios from "axios";
import { useEffect, useState } from "react";
import LazyImage from "./LazyImage";
import { Link, json } from "react-router-dom";
import { PokemonNameAndUrl } from "../types/PokemonData";
import { PokemonDetail } from "../types/PokemonDetail";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import like from "../assets/img/pokeball1.png";
import unLike from "../assets/img/pokeball2.png";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addFavorite, removeFavorite } from "../stores/pokemon.slice";
import { FormattedPokemonData } from "../types/FormattedPokemonData";
interface PokeData {
  id: number;
  types: string;
  name: string;
  url: string;
  koreanName: string;
}

interface PokeCardProps {
  pokemons: FormattedPokemonData;
  name: string;
}

const PokeCard = ({ pokemons, name }: PokeCardProps) => {
  const { favorite } = useAppSelector((state) => state.pokemon);
  const [pokemon, setPokemon] = useState<FormattedPokemonData>(pokemons);
  const dispatch = useAppDispatch();
  const favMatching = favorite?.find((fav: PokeData) => {
    return fav.name === name;
  });
  useEffect(() => {
    setPokemon(pokemons);
  }, [pokemons]);

  const favoriteHandler = () => {
    favMatching
      ? dispatch(removeFavorite(pokemon))
      : dispatch(addFavorite(pokemon));
  };
  const bg = `bg-${pokemon?.type}`;
  const border = `border-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`;
  return (
    <>
      {pokemon?.name && (
        <div className='group relative block'>
          <button onClick={favoriteHandler} className='absolute z-10'>
            <div
              className={`invisible group-hover:visible py-1.5 px-3 font-bold text-2xl ${text}`}
            >
              {favMatching ? (
                <img src={like} width='20' />
              ) : (
                <img src={unLike} width='20' />
              )}
            </div>
          </button>
          <Link
            to={`/pokemon/${pokemon?.name}`}
            state={{ id: pokemon.id }}
            className={`block box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0 bg-slate-800 justify-between items-center`}
          >
            <div
              className={`${text} relative h-[1.5rem] text-md w-full pt-1 px-2 flex rounded-t-lg justify-between`}
            >
              <div></div>#{pokemon.id?.toString().padStart(3, "00")}
            </div>
            <div className={` w-full f-6 flex- items-center justify-center`}>
              <div
                className={`box-border relative flex w-full h-[5.5rem] basis justify-center items-center `}
              >
                <LazyImage url={img} alt={name} />
              </div>
            </div>
            <div
              className={` ${bg} text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium pt-1 text-center`}
            >
              {pokemon.koreanName}
            </div>
          </Link>
        </div>
      )}
    </>
  );
};
export default PokeCard;
