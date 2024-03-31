import { createSlice, current } from "@reduxjs/toolkit";
import { PokemonData } from "../types/PokemonData";
import { FormattedPokemonData } from "../types/FormattedPokemonData";

interface favType extends FormattedPokemonData {
  uId: string;
}

type SearchType = {
  searchState: boolean;
  favorite: FormattedPokemonData[];
  allPokemon: FormattedPokemonData[];
  scrollNum: number;
};

const initialState: SearchType = {
  searchState: false,
  favorite: [],
  allPokemon: localStorage.getItem("allPokemon")
    ? JSON.parse(localStorage.getItem("allPokemon") || "")
    : [],
  scrollNum: 0,
};

const storageData = () => {
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData).email : [];
  const favData = localStorage.getItem("favoritePokemons");
  const fav = favData ? (JSON.parse(favData) as favType[]) : [];
  return { fav, user };
};

export const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    searchStatus: (state, action) => {
      state.searchState = action.payload;
    },
    setAllPokemons: (state, action) => {
      state.allPokemon = action.payload;
      localStorage.setItem("allPokemon", JSON.stringify(action.payload));
    },

    removeAllPokemons: (state, action) => {
      state.allPokemon = action.payload;
    },
    getFavorite: (state, action) => {
      const { fav, user } = storageData();
      state.favorite = fav?.filter(({ uId }) => uId === user);
    },
    addFavorite: (state, action) => {
      const { fav, user } = storageData();

      const newStorageData = [...fav, { ...action.payload, uId: user }];
      state.favorite.push(action.payload);
      localStorage.setItem("favoritePokemons", JSON.stringify(newStorageData));
    },
    removeFavorite: (state, action) => {
      const { fav, user } = storageData();
      const userFavPoke = current(state.favorite);

      state.favorite = userFavPoke.filter(
        (pokemon: FormattedPokemonData) => pokemon.name !== action.payload.name
      );
      const newStorageData = fav.filter(
        (pokemon: favType) =>
          !(pokemon.name === action.payload.name && pokemon.uId === user)
      );

      localStorage.setItem("favoritePokemons", JSON.stringify(newStorageData));
    },
    setScrollNum: (state, action) => {
      state.scrollNum = action.payload;
      localStorage.setItem("scrollNum", JSON.stringify(action.payload));
    },
    removeScrollNum: (state) => {
      state.scrollNum = 0;
      localStorage.removeItem("scrollNum");
    },
  },
});

export default pokemonSlice.reducer;
export const {
  searchStatus,
  getFavorite,
  addFavorite,
  removeFavorite,
  setAllPokemons,
  setScrollNum,
  removeScrollNum,
} = pokemonSlice.actions;
