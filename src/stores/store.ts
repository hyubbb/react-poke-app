import { configureStore } from "@reduxjs/toolkit";
import pokemonSlice from "./pokemon.slice";

const store = configureStore({
  reducer: {
    pokemon: pokemonSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
