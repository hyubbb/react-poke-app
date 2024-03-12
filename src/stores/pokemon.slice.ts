import { createSlice } from "@reduxjs/toolkit";
import { PokemonData } from "../types/PokemonData";
import { FormattedPokemonData } from "../types/FormattedPokemonData";

type SearchType = {
  searchState: boolean;
  favorite: string[];
  pokemons: FormattedPokemonData[];
};

const initialState: SearchType = {
  searchState: false,
  favorite: localStorage.getItem("favoritePokemons")
    ? JSON.parse(localStorage.getItem("favoritePokemons") || "")
    : [],
  pokemons: [],
};

export const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    searchStatus: (state, action) => {
      state.searchState = action.payload;
    },
    allPokemons: (state, action) => {
      state.pokemons = action.payload;
    },
    addFavorite: (state, action) => {
      state.favorite.push(action.payload);
      localStorage.setItem("favoritePokemons", JSON.stringify(state.favorite));
    },
    removeFavorite: (state, action) => {
      console.log(action.payload.name);
      state.favorite = state.favorite.filter(
        (pokemon) => pokemon.name !== action.payload.name
      );
      localStorage.setItem("favoritePokemons", JSON.stringify(state.favorite));
    },
  },
});

export default pokemonSlice.reducer;
export const { searchStatus, addFavorite, removeFavorite, allPokemons } =
  pokemonSlice.actions;
