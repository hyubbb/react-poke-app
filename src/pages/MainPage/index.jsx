import { useEffect, useState } from "react";
import axios from "axios";
import PokeCard from "../../components/PokeCard";
// import { useDebounce } from "./hooks/useDebounce";
import Autocomplete from "../../components/Autocomplete";
// import Autocomplete2 from "./components/Autocomplete2";

function MainPage() {
  // 모든 포켓몬 데이터 state
  const [allPokemons, setAllPokemons] = useState([]);

  // 실제로 보여지는 포켓몬 데이터 state
  const [displayedPokemons, setDisplayedPokemons] = useState([]);

  // 한번에 보여주는 포켓몬 수
  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;
  const [searchTerm, setSearchTerm] = useState("");

  // autocomplite후에 호출되므로 필요없다.
  // const debounceSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // console.log("useEffect");
    fetchPokeData();
  }, []);

  // useEffect(() => {
  //   handleSearchTerm(searchTerm);
  // }, [debounceSearchTerm]);

  const filterDisplayedPokemonData = (
    allPokemonsData,
    displayedPokemons = []
  ) => {
    // 초기값, 0+20

    const limit = displayedPokemons.length + limitNum;
    //모든 포켓몬 데이터에서 limitNum만큼 더 가져오기
    const array = allPokemonsData.filter(
      (pokemon, index) => index + 1 <= limit
    );
    return array;
  };

  const fetchPokeData = async () => {
    try {
      // 1008개의 포켓몬 데이터 받아오기
      const response = await axios.get(url);
      // 모든 데이터 저장
      setAllPokemons(response.data.results);
      //   console.log(allPokemons);
      // 실제로 화면에 보여줄 포켓몬 리스트 state
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));

      // setPokemons([...response.data.results]);
    } catch (error) {
      setDisplayedPokemons([]);
      console.error(error);
    }
  };

  // const handleSearchTerm = async () => {
  //   if (searchTerm.length > 0) {
  //     try {
  //       const response = await axios.get(
  //         `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
  //       );
  //       const pokemonData = {
  //         url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
  //         name: searchTerm,
  //       };

  //       setDisplayedPokemons([pokemonData]);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     // setDisplayedPokemons([]);
  //     fetchPokeData();
  //     // fetchPokeData(true);
  //   }
  // };
  return (
    <>
      <article className='pt-6'>
        <header className='flex flex-col gap-2 w-full px-4 z-50'>
          <Autocomplete
            allPokemons={allPokemons}
            setDisplayedPokemons={setDisplayedPokemons}
          />
        </header>
        <section className='pt-6 flex justify-center items-center overflow-auto z-0'>
          <div className='flex flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl '>
            {displayedPokemons.length > 0 ? (
              displayedPokemons.map(({ url, name }) => (
                <PokeCard key={url} url={url} name={name} />
              ))
            ) : (
              <h2 className='font-medium text-lg text-this.slate.black mb-1'>
                포켓몬이 없습니다.
              </h2>
            )}
          </div>
        </section>
        <div className='text-center'>
          {/* 더보기 할 데이터가 현재 보이는 데이터 보다 많을떄, 검색했을 경우에 더보기가 없어야한다.*/}
          {allPokemons.length > displayedPokemons.length &&
            displayedPokemons.length > 1 && (
              <button
                onClick={() =>
                  setDisplayedPokemons(
                    filterDisplayedPokemonData(allPokemons, displayedPokemons)
                  )
                }
                className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'
              >
                더 보기
              </button>
            )}

          {displayedPokemons.length <= 1 && (
            <button
              onClick={() => {
                setDisplayedPokemons(filterDisplayedPokemonData(allPokemons));
                setSearchTerm("");
              }}
              className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'
            >
              뒤로가기
            </button>
          )}
        </div>
      </article>
    </>
  );
}

export default MainPage;
