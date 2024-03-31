import { createSlice, current } from "@reduxjs/toolkit";
import { PokemonData } from "../types/PokemonData";
import { FormattedPokemonData } from "../types/FormattedPokemonData";

type SearchType = {
  searchState: boolean;
  favorite: string[];
  allPokemon: FormattedPokemonData[];
  scrollNum: number;
};

const favCheckUser = () => {
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData).email : [];
  const favData = localStorage.getItem("favoritePokemons");
  const fav = favData ? JSON.parse(favData) : [];

  const match = fav?.filter((pokemon) => {
    return pokemon.uId == user;
  });
  return match;
};

const initialState: SearchType = {
  searchState: false,
  // favorite: localStorage.getItem("favoritePokemons")
  //   ? JSON.parse(localStorage.getItem("favoritePokemons") || "")
  //   : [],
  favorite: favCheckUser(),
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
      const userData = localStorage.getItem("userData");
      const user = userData ? JSON.parse(userData).email : [];
      const favData = localStorage.getItem("favoritePokemons");
      const fav = favData ? JSON.parse(favData) : [];

      const newStorageData = [...fav, { ...action.payload, uId: user }];
      state.favorite.push(action.payload);
      localStorage.setItem("favoritePokemons", JSON.stringify(newStorageData));
    },
    removeFavorite: (state, action) => {
      //즐겨차직 다 지우고, 로컬스토리지를 fav[id] 형식으로 만들어서 생성, 삭제 마다 fav[id]값 불러와서ㅓ 해결

      const favData = localStorage.getItem("favoritePokemons");
      const fav = favData ? JSON.parse(favData) : [];

      // state.favorite = state.favorite.filter(
      //   (pokemon) => pokemon.name !== action.payload.name
      // );

      state.favorite = fav.filter(
        (pokemon: PokemonData) => pokemon.name !== action.payload.name
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
