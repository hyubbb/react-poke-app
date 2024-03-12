import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LazyImage from "../../components/LazyImage";
import { useAppSelector } from "../../hooks/redux";
import like from "../../assets/img/pokeball1.png";
import unLike from "../../assets/img/pokeball2.png";
import { useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../../stores/pokemon.slice";
import { PokemonDetail } from "../../types/PokemonDetail";

interface PokeData {
  pokemon: PokemonDetail;
}

const PokeDex = ({ pokemon }: PokeData) => {
  const boxRef = useRef(null);
  const overlayRef = useRef(null);
  const { favorite } = useAppSelector((state) => state.pokemon);
  const dispatch = useDispatch();

  const favoriteHandler = () => {
    dispatch(removeFavorite(pokemon));
  };

  useEffect(() => {
    // boxRef.current는 실제 DOM 요소를 가리킵니다.
    const box = boxRef.current;
    const overlay = overlayRef.current;
    if (!box) return;

    const handleMouseMove = (e) => {
      const boxRect = box.getBoundingClientRect(); // 부모 요소의 위치와 크기 정보
      const x = e.pageX - window.scrollX - boxRect.left; // 페이지 내 위치에서 스크롤 위치와 부모 요소의 왼쪽 경계를 뺀 값
      const y = e.pageY - window.scrollY - boxRect.top; // 페이지 내 위치에서 스크롤 위치와 부모 요소의 상단 경계를 뺀 값

      const rotateX = (1 / 6) * y - 20;
      const rotateY = (-1 / 6) * x + 20;

      box.style = `transform: perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg);`;
      overlay.style = `background-position : ${x / 5 + y / 5}%; 
      filter : opacity(${x / 240}) brightness(1.2);`;
    };
    const handleMouseLeave = () => {
      overlay.style = "filter : opacity(0);";
      box.style = `transform: rotateX(0deg) rotateY(0deg);`;
    };

    // 이벤트 리스너 추가
    box.addEventListener("mousemove", handleMouseMove);
    box.addEventListener("mouseleave", handleMouseLeave);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      box.removeEventListener("mousemove", handleMouseMove);
      box.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []); // 의존성 배열이 비어있으므로 마운트될 때 한 번만 실행됩니다.

  const bg = `bg-${pokemon?.type}`;
  const border = `border-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  // const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  return (
    <>
      <div
        ref={boxRef}
        className={`box group ${pokemon.name} relative transition duration-[0.1s] ease-out z-[1] `}
      >
        <button onClick={favoriteHandler} className='absolute z-10'>
          <div
            className={`invisible group-hover:visible py-1.5 px-3 font-bold text-2xl ${text}`}
          >
            {<img src={like} width='30' />}
          </div>
        </button>
        <Link
          to={`/pokemon/${pokemon?.name}`}
          state={pokemon.koreanName}
          className={`${bg} flex flex-col block box-border rounded-lg ${border} w-[15rem] h-[15rem] z-0 justify-between items-center`}
        >
          <div
            ref={overlayRef}
            className='overlay absolute w-full h-full bg-[linear-gradient(115deg,_transparent_40%,_rgba(255,_219,_112,_0.6)_45%,_rgba(132,_50,_255,_0.1)_50%,_transparent_54%)] filter brightness-110 opacity-0 group-hover:opacity-60 mix-blend-color-dodge bg-[length:150%_150%] bg-[100%] transition duration-[0.1s] z-[2]'
          ></div>
          <div
            className={`text-black relative h-[1.5rem] text-md w-full pt-1 px-2 flex rounded-t-lg justify-between`}
          >
            <div></div>#{pokemon.id?.toString().padStart(3, "00")}
          </div>
          <div className={` w-full f-6 flex- items-center justify-center`}>
            <div
              className={`box-border relative flex w-full h-[9rem] basis justify-center items-center `}
            >
              <LazyImage url={img} alt={pokemon.name} />
            </div>
          </div>
          <div
            className={`bg-slate-800 w-full text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium pt-1 text-center`}
          >
            {pokemon.koreanName}
          </div>
        </Link>
      </div>
    </>
  );
};

export default PokeDex;
