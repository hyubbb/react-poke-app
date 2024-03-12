import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import PokeCard from "../../components/PokeCard";
import Autocomplete from "../../components/Autocomplete";
import { PokemonData, PokemonNameAndUrl } from "../../types/PokemonData";
import { useDispatch, useSelector } from "react-redux";
import {
  defaultShouldDehydrateMutation,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { searchStatus } from "../../stores/pokemon.slice";
import Filter from "../../components/Filter";
import loading from "../../assets/img/loading.gif";
import useAllPokemonsData from "../../hooks/useAllPokemonsData";
// import AuseAllPokemonsData from "../../hooks/AuseAllPokemonsData";

function MainPage() {
  const dispatch = useAppDispatch();
  // 모든 포켓몬 데이터를 가지고 있는 State
  const { pokemon: fetchAllPokemonData } = useAllPokemonsData();
  const [allPokemons, setAllPokemons] = useState<PokemonNameAndUrl[]>([]);
  const [listPokemon, setListPokemon] = useState<PokemonNameAndUrl[]>([]);
  // 실제로 리스트로 보여주는 포켓몬 데이터를 가지고 있는 State
  const [displayPokemons, setDisplayPokemons] = useState<PokemonNameAndUrl[]>(
    []
  );
  const [isLoadingMain, setIsLoadingMain] = useState<boolean>(false);
  const { searchState } = useAppSelector((state) => state.pokemon);

  const fetchAllPokemons = async () => {
    // const res = await axios.get<PokemonData>(url);
    // const result = await filterDisplayedPokemonData(res.data.results);
    // setAllPokemons(result);

    const url = `https://pokeapi.co/api/v2/pokemon/?limit=10000&offset=0`;

    try {
      const pokemonListResponse = await axios.get(url);
      const pokemonList = pokemonListResponse.data.results;
      const pokemonDataPromises = await Promise.all(
        pokemonList.map(async (pokemon) => {
          const pokemonDetailsResponse = await axios.get(pokemon.url);
          const pokemonDetails = pokemonDetailsResponse.data;
          // console.log(pokemonDetails);
          return {
            name: pokemonDetails.name,
            url: pokemonDetails.url,
          };
        })
      );

      // Promise.all을 사용하여 모든 포켓몬 상세 정보 요청이 완료될 때까지 기다립니다.
      // // console.log(allPokemonData);
      // console.log(allPokemonData);
      setAllPokemons(pokemonDataPromises);
    } catch (error) {
      console.log("ERROR : " + error);
    }
  };

  useEffect(() => {
    console.log("first");
    setAllPokemons(fetchAllPokemonData);
    setDisplayPokemons(fetchAllPokemonData);
  }, [fetchAllPokemonData]);

  // console.log(pokemon);

  const fetchPage = useCallback(async (page: number) => {
    const offsetNum = page * 20;
    // const res = await axios.get<PokemonData>(
    //   `https://pokeapi.co/api/v2/pokemon/?offset=${offsetNum}&limit=20`
    // );

    // const limit = displayedPokemons.length + limitNum;
    // 모든 포켓몬 데이터에서 limitNum 만큼 더 가져오기
    const array = allPokemonsData.filter((_, index) => index + 1);
    return array;

    // return res.data;
  }, []);

  const {
    fetchNextPage, // 다음페이지 요청
    fetchPreviousPage, // 이전페이지
    hasNextPage, // 다음페이지가 있는지
    hasPreviousPage, // 이전페이지
    isFetchingNextPage, // 다음페이지를 불러오는 중인지
    isFetchingPreviousPage, // 이전 페이지
    data: fetchData,
  } = useInfiniteQuery({
    queryKey: ["pokemonData"],
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPageParam + 1;
    },
  });

  const fetchPokemons = fetchData?.pages[fetchData?.pages.length - 1];

  const pokemonKoreanName = async (pokeNum: number, pokeName: string) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokeNum}`
      );
      const koreanName =
        response.data.names.find((name) => name.language.name === "ko")?.name ||
        pokeName;
      return koreanName;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // 404 에러 처리
        // console.log("데이터가 없는 포켓몬입니다.");
        return pokeName;
      } else {
        // 기타 에러 처리
        console.log("데이터를 가져오는 중 오류가 발생했습니다.");
      }
    }
  };

  const filterDisplayedPokemonData = useCallback(
    async (pokemonsData: PokemonNameAndUrl[]) => {
      // 모든 포켓몬 데이터에서 limitNum 만큼 더 가져오기
      // const array = pokemonsData.filter((_, index) => index + 1 <= limit);

      const promises = pokemonsData.map(async (poke) => {
        const num = +poke.url.split("/")[6];
        const koreanName = await pokemonKoreanName(num, poke.name);
        const temp = {
          ...poke,
          num,
          koreanName,
        };
        return temp;
      });

      const result = await Promise.all(promises);
      return result;
    },
    []
  );

  const fetchPokeData = async ({ results: fetchPokemons }: PokemonData) => {
    setListPokemon((prev) => [...listPokemon, ...fetchPokemons]);

    if (searchState) {
      setDisplayPokemons(await filterDisplayedPokemonData(listPokemon));
    } else {
      setDisplayPokemons(
        await filterDisplayedPokemonData([...displayPokemons, ...fetchPokemons])
      );
    }
  };

  const backHandler = async () => {
    if (searchState) {
      setDisplayPokemons(await filterDisplayedPokemonData(listPokemon));
      dispatch(searchStatus(false));
    } else {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 10 &&
        hasNextPage &&
        !searchState
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, fetchNextPage, searchState]);

  useEffect(() => {
    setIsLoadingMain(false);
  }, [displayPokemons]);

  useEffect(() => {
    if (fetchPokemons) {
      fetchPokeData(fetchPokemons);
    }
  }, [fetchPokemons]);

  return (
    <>
      {isLoadingMain && (
        <div className='fixed w-full h-full flex justify-center items-center backdrop-blur-[2px] bg-[#ffffff1f] z-10'>
          <div className='text-center'>
            <img src={loading} alt='' width='200px' height='200px' />
            <div className='text-lg mt-3 text-white'>loading ...</div>
          </div>
        </div>
      )}

      <article className='pt-6'>
        <header className='flex flex-col gap-2 w-full px-4 z-50'>
          <Autocomplete
            allPokemons={allPokemons}
            setDisplayPokemons={setDisplayPokemons}
          />
          <div className='flex mt-10 mb-6 px-3 justify-center'>
            <Filter
              setDisplayPokemons={setDisplayPokemons}
              filterDisplayedPokemonData={filterDisplayedPokemonData}
              setIsLoadingMain={setIsLoadingMain}
              allPokemons={allPokemons}
            />
          </div>
        </header>
        {/* <AuseAllPokemonsData /> */}
        <section className='pt-6 flex flex-col justify-content items-center overflow-auto z-0'>
          <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl '>
            {displayPokemons?.length > 0 ? (
              displayPokemons.map((pokemon, idx) => {
                const { url, name, koreanName } = pokemon;
                return (
                  <div key={idx}>
                    <PokeCard url={url} name={name} koreanName={koreanName} />
                  </div>
                );
              })
            ) : (
              <div className='fixed w-full h-full flex justify-center items-center backdrop-blur-[2px] bg-[#ffffff1f] z-10'>
                <div className='text-center'>
                  <img src={loading} alt='' width='200px' height='200px' />
                  <div className='text-lg mt-3 text-white'>loading ...</div>
                </div>
              </div>
            )}
          </div>
        </section>
        <div className='text-center'>
          {
            // allPokemons.length > displayPokemons.length` &&displayPokemons.length > limitNum && (
            displayPokemons?.length >= 1 && (
              <button
                onClick={() => backHandler()}
                className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'
              >
                {searchState ? "뒤로가기" : " 더보기 "}
              </button>
            )
          }
        </div>
      </article>
    </>
  );
}

export default MainPage;
