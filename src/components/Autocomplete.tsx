/**
 *  ui li 방식을 활용한 autocomplete ui
 *  검색리스트의 스트롤이나 커서로 내려갔을때 리스트목록이 움직이지 않는 문제점이있음.
 *  datalist의 방식으로 변경해볼 예정
 */

import React, { useState, useRef } from "react";
import { PokemonNameAndUrl } from "../types/PokemonData";
import { useAppDispatch } from "../hooks/redux";
import { searchStatus } from "../stores/pokemon.slice";
import { FormattedPokemonData } from "../types/FormattedPokemonData";

interface AutoCompleteProps {
  allPokemons: FormattedPokemonData[];
  setDisplayPokemons: React.Dispatch<
    React.SetStateAction<FormattedPokemonData[]>
  >;
}

const Autocomplete = ({
  allPokemons,
  setDisplayPokemons,
}: AutoCompleteProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [keyIndex, setKeyIndex] = useState(-1);
  const dispatch = useAppDispatch();

  const filterNames = (input: string) => {
    const isNumber = redefineType(input);
    const result =
      input &&
      allPokemons
        .filter((e) => {
          return isNumber
            ? e.id.toString().includes(input)
            : e.koreanName.includes(input);
        })
        .sort();
    return result;
  };

  const redefineType = (value: string | number) => {
    // 숫자로 변환 가능한지 확인
    const isNumber =
      !isNaN(value as number) && !isNaN(parseFloat(value as string));
    // 숫자일 경우 숫자로 변환, 아니면 문자열 그대로 반환
    return isNumber || false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let text: string = searchTerm.toString().trim(); // 문자열 좌우 공백제거
    if (keyIndex == -1 && searchTerm) {
      if (searchTerm !== "") {
        if (filterNames(text).length) {
          setDisplayPokemons(filterNames(text) as FormattedPokemonData[]);
          dispatch(searchStatus(true));
          setSearchTerm("");
        } else {
          console.log(4);
          e.stopPropagation();
        }
      }
    }
  };

  const checkEqualName = (input: string) => {
    if (input === "") return [];
    const filteredArray: FormattedPokemonData[] = filterNames(input);
    return filteredArray[0]?.koreanName === input ? [] : filteredArray;
  };

  const autoRef = useRef<HTMLUListElement>(null);

  const handleKeyArrow = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (checkEqualName(searchTerm).length) {
      const pokeLength = checkEqualName(searchTerm).length;

      if (e.code === "ArrowDown" && pokeLength - 1 > keyIndex) {
        setKeyIndex(keyIndex + 1);
      }

      if (e.code === "ArrowUp" && keyIndex > 0) {
        setKeyIndex(keyIndex - 1);
      }

      if (e.code === "Enter" && keyIndex > -1) {
        setKeyIndex(-1);
        setSearchTerm(checkEqualName(searchTerm)[keyIndex].koreanName);
      }
    }
  };

  return (
    <div className='relative z-50'>
      <form
        onSubmit={handleSubmit}
        className='relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto'
      >
        <input
          type='text'
          className='text-xs w-[20.5rem] h-6 px2 py-1 rounded-lg text-gray-300 text-center bg-[hsl(214,13%,47%)]'
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          onKeyUp={handleKeyArrow}
        />
        <button
          type='submit'
          className='text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700'
        >
          검색
        </button>
      </form>

      {checkEqualName(searchTerm).length > 0 && (
        <div
          className={`w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-2`}
        >
          <div
            className={`w-0 h-0 bottom-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2`}
          ></div>

          <ul
            ref={autoRef}
            className={`w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-0 overflow-auto scrollbar-none`}
          >
            {checkEqualName(searchTerm).map(
              (e: FormattedPokemonData, i: number) => (
                <li
                  key={`${i}`}
                  className={
                    `text-base w-full px-2  text-white hover:bg-gray-600 ` +
                    (keyIndex === i
                      ? `${e.koreanName} bg-neutral-600`
                      : e.koreanName)
                  }
                  onClick={() => setSearchTerm(e.koreanName)}
                >
                  {e.koreanName}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
