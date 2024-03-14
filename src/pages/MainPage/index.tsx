import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import PokeCard from "../../components/PokeCard";
import Autocomplete from "../../components/Autocomplete";
import { PokemonData, PokemonNameAndUrl } from "../../types/PokemonData";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { searchStatus } from "../../stores/pokemon.slice";
import Filter from "../../components/Filter";
import loading from "../../assets/img/loading.gif";
import useAllPokemonsData from "../../hooks/useAllPokemonsData";
import NotData from "../../components/NotData";
import { FormattedPokemonData } from "../../types/FormattedPokemonData";

interface fetchDataType {
  data: FormattedPokemonData[];
  page: number;
}

function MainPage() {
  const dispatch = useAppDispatch();
  const [allPokemons, setAllPokemons] = useState<FormattedPokemonData[]>([]);
  const getAllPokemonsData = useAllPokemonsData();
  const [listPokemon, setListPokemon] = useState<FormattedPokemonData[]>([]);
  const [displayPokemons, setDisplayPokemons] = useState<
    FormattedPokemonData[]
  >([]);
  const [isLoadingMain, setIsLoadingMain] = useState<boolean>(false);
  const [isNotData, setIsNotData] = useState<boolean>(false);
  const { searchState } = useAppSelector((state) => state.pokemon);

  const queryClient = useQueryClient();

  useEffect(() => setAllPokemons(getAllPokemonsData), [getAllPokemonsData]);

  const fetchPage = (page: number) => {
    const itemsPerPage = 20; // 페이지 당 아이템 수
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = allPokemons.slice(0, endIndex);
    const result = { page, data: [...currentPageData] };

    return result;
  };

  const isDataLoaded = useMemo(() => allPokemons.length > 0, [allPokemons]);

  const {
    data: fetchData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["pokemonData"],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => fetchPage(pageParam),
    getNextPageParam: (lastPage, allPages) => lastPage.page + 1,
    enabled: isDataLoaded, // 쿼리 실행 조건
  });

  useEffect(() => {
    if (fetchData) {
      fetchDataFunc();
    }
  }, [fetchData]);

  const fetchDataFunc = () => {
    const fetchPokemons = fetchData?.pages[fetchData?.pages.length - 1];
    fetchPokeData(fetchPokemons);
  };

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
        console.log("데이터가 없는 포켓몬입니다.");
        return pokeName;
      } else {
        console.log("데이터를 가져오는 중 오류가 발생했습니다.");
      }
    }
  };

  const filterDisplayedPokemonData = useCallback(
    async (pokemonsData: PokemonNameAndUrl[]) => {
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

  const fetchPokeData = async ({ data: fetchPokemons }: fetchDataType) => {
    if (fetchPokemons.length > 0) {
      dispatch(searchStatus(false));
      setDisplayPokemons(fetchPokemons);
      setIsLoadingMain(false);
    }
    // if (searchState) {
    //   listPokemon.length === 0 && setListPokemon(fetchPokemons);
    //   setDisplayPokemons(fetchPokemons);
    //   setIsLoadingMain(false);
    //   dispatch(searchStatus(false));
    // } else {
    //   if (listPokemon.length > 0) {
    //     setDisplayPokemons(listPokemon);
    //     setListPokemon([]);
    //   } else {
    //     setDisplayPokemons(fetchPokemons);
    //   }
    // }
  };

  const backHandler = () => {
    if (searchState) {
      setIsLoadingMain(false);
      dispatch(searchStatus(false));
      const queryData = queryClient.getQueryData(["pokemonData"]).pages;
      const { data: lastData } = queryData[queryData.length - 1];
      setDisplayPokemons(lastData);
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
    const handlePageLoad = () => {
      const scrollNum = JSON.parse(localStorage.getItem("scrollNum"));
      if (scrollNum) {
        const elm = document.getElementById(`pokemon_${scrollNum}`);
        if (elm) {
          elm.scrollIntoView({ behavior: "smooth", block: "start" });
          localStorage.removeItem("scrollNum");
        }
      }
    };
    handlePageLoad();
    window.addEventListener("DOMContentLoaded", handlePageLoad);

    return () => {
      window.removeEventListener("DOMContentLoaded", handlePageLoad);
    };
  }, [displayPokemons]);

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
              setIsNotData={setIsNotData}
            />
          </div>
        </header>
        {/* <AuseAllPokemonsData /> */}
        <section className='pt-6 flex flex-col justify-content items-center overflow-auto z-0 scrollbar-none'>
          <div className='flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl '>
            {displayPokemons?.length > 0 ? (
              displayPokemons.map((pokemon, idx) => {
                const { url, name, id } = pokemon;
                return (
                  <div key={idx} id={`pokemon_${id}`}>
                    <PokeCard pokemons={pokemon} name={name} />
                  </div>
                );
              })
            ) : isNotData ? (
              <NotData />
            ) : (
              <div className='fixed w-full h-full flex justify-center items-center backdrop-blur-[2px] bg-[#ffffff1f] z-10'>
                <div className='text-center'>
                  <img src={loading} alt='' width='200px' height='200px' />
                  <div className='text-lg mt-3 text-black'>loading ...</div>
                </div>
              </div>
            )}
          </div>
        </section>
        <div className='text-center'>
          {displayPokemons?.length >= 1 && (
            <button
              onClick={() => backHandler()}
              className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'
            >
              {searchState ? "뒤로가기" : " 더보기 "}
            </button>
          )}
        </div>
      </article>
    </>
  );
}

export default MainPage;
