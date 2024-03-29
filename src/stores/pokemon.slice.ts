import { createSlice, current } from "@reduxjs/toolkit";
import { PokemonData } from "../types/PokemonData";
import { FormattedPokemonData } from "../types/FormattedPokemonData";

type SearchType = {
  searchState: boolean;
  favorite: string[];
  allPokemon: FormattedPokemonData[];
  scrollNum: number;
};

const initialState: SearchType = {
  searchState: false,
  favorite: localStorage.getItem("favoritePokemons")
    ? JSON.parse(localStorage.getItem("favoritePokemons") || "")
    : [],
  allPokemon: localStorage.getItem("allPokemon")
    ? JSON.parse(localStorage.getItem("allPokemon") || "")
    : [],
  scrollNum: 0,
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
    addFavorite: (state, action) => {
      state.favorite.push(action.payload);
      localStorage.setItem("favoritePokemons", JSON.stringify(state.favorite));
    },
    removeFavorite: (state, action) => {
      state.favorite = state.favorite.filter(
        (pokemon) => pokemon.name !== action.payload.name
      );
      localStorage.setItem("favoritePokemons", JSON.stringify(state.favorite));
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
  addFavorite,
  removeFavorite,
  setAllPokemons,
  setScrollNum,
  removeScrollNum,
} = pokemonSlice.actions;
