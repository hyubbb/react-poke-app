import { useEffect, useMemo, useState } from "react";
import PokeCard from "../../components/PokeCard";
import Autocomplete from "../../components/Autocomplete";
import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { searchStatus, removeScrollNum } from "../../stores/pokemon.slice";
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
  const { searchState, scrollNum } = useAppSelector((state) => state.pokemon);
  const [allPokemons, setAllPokemons] = useState<FormattedPokemonData[]>([]);
  const getAllPokemonsData = useAllPokemonsData();
  const [displayPokemons, setDisplayPokemons] = useState<
    FormattedPokemonData[]
  >([]);
  const [isLoadingMain, setIsLoadingMain] = useState<boolean>(false);
  const [isNotData, setIsNotData] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    dispatch(searchStatus(false));
  }, []);
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
      const fetchPokemons = fetchData.pages[fetchData.pages.length - 1];
      fetchPokeData(fetchPokemons);
    }
  }, [fetchData]);

  const fetchPokeData = ({ data: fetchPokemons }: fetchDataType) => {
    setDisplayPokemons(fetchPokemons);
    setIsLoadingMain(false);
  };

  const backHandler = () => {
    if (searchState) {
      setIsLoadingMain(false);
      dispatch(searchStatus(false));
      const queryData = queryClient.getQueryData<
        UseInfiniteQueryResult<fetchDataType, unknown>
      >(["pokemonData"]);
      const pages = queryData?.pages;
      const lastPage = pages ? pages[pages.length - 1] : undefined;
      const lastData = lastPage ? lastPage.data : [];
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
      if (scrollNum) {
        const elm = document.getElementById(`pokemon_${scrollNum}`);
        if (elm) {
          elm.scrollIntoView({ behavior: "smooth", block: "start" });
          dispatch(removeScrollNum());
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
