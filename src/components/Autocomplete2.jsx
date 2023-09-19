import { useEffect, useState } from "react";

const Autocomplete2 = ({ allPokemons, setDisplayedPokemons }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filterNames = (input) => {
    const value = input.toLowerCase();
    return value
      ? allPokemons.filter((e) => e.name.includes(value)).sort()
      : [];
  };

  const [online, setOnline] = useState([]);

  useEffect(() => {
    // console.log(searchTerm);
    setOnline(checkEqualName(searchTerm));
    console.log(online);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let text = searchTerm.trim(); // 문자열 좌우 공백제거
    setDisplayedPokemons(filterNames(text));
  };

  const checkEqualName = (input) => {
    const filteredArray = filterNames(input);
    console.log(filteredArray);
    // filterNames의 리턴값이 배열이다. 잘 확인 할 것
    // 검색한 값과 일치한 값이 있으면, autocomplite 보이지 않기
    return filteredArray[0]?.name === input ? [] : filteredArray;
  };

  return (
    <>
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
          />
          <button
            type='submit'
            className='text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700'
          >
            검색
          </button>
        </form>

        {/* <div>{checkEqualName(searchTerm).length > 0 && ""}</div> */}
      </div>
    </>
  );
};

export default Autocomplete2;
