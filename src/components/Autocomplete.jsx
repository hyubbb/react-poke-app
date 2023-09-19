/**
 *  ui li 방식을 활용한 autocomplete ui
 *  검색리스트의 스트롤이나 커서로 내려갔을때 리스트목록이 움직이지 않는 문제점이있음.
 *  datalist의 방식으로 변경해볼 예정
 */

import React, { useState, useRef } from "react";

const Autocomplete = ({ allPokemons, setDisplayedPokemons }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keyIndex, setKeyIndex] = useState(-1);

  const filterNames = (input) => {
    const value = input.toLowerCase();
    return value
      ? allPokemons.filter((e) => e.name.includes(value)).sort()
      : [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let text = searchTerm.trim(); // 문자열 좌우 공백제거
    if (keyIndex == -1 && searchTerm) {
      setDisplayedPokemons(filterNames(text));
      setSearchTerm("");
    }
  };

  const checkEqualName = (input) => {
    const filteredArray = filterNames(input);
    // setKeyIndex(-1);
    // console.log(filteredArray);
    // filterNames의 리턴값이 배열이다. 잘 확인 할 것
    // 검색한 값과 일치한 값이 있으면, autocomplete 보이지 않기
    return filteredArray[0]?.name === input ? [] : filteredArray;
  };

  const autoRef = useRef();
  //   const [liIndex, setLiIndex] = useState();

  const handleKeyArrow = (e) => {
    if (checkEqualName(searchTerm).length > 0) {
      const pokeLength = checkEqualName(searchTerm).length;
      // 데이터 갯수만큼 이상 keyindex가 늘어나지 않게
      // 데이터가 2개면 keyindex 1까지만, 1개면 0까지
      if (e.code === "ArrowDown" && pokeLength - 1 > keyIndex) {
        setKeyIndex(keyIndex + 1);
      }

      if (e.code === "ArrowUp" && keyIndex > 0) {
        setKeyIndex(keyIndex - 1);
      }

      if (e.code === "Enter" && keyIndex > -1) {
        // handleSubmit
        setKeyIndex(-1);
        setSearchTerm(checkEqualName(searchTerm)[keyIndex].name);
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

      {/* 검색한 결과값이 있을때만 보여주기 */}
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
            // className={`w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-0 overflow-auto`}
          >
            {checkEqualName(searchTerm).map((e, i) => (
              <li
                key={`${i}`}
                className={
                  `text-base w-full p-[2px] text-white hover:bg-gray-600 ` +
                  (keyIndex === i ? `${i} bg-neutral-600` : i)
                }
                onClick={() => setSearchTerm(e.name)}
              >
                {e.name}
                {/* <button
                  //   onClick={() => setSearchTerm(e.name)}
                  className={`text-base w-full hover:bg-gray-600 p-[2px] text-gray-100`}
                >
                  {e.name}
                </button> */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
