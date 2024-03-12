import React from "react";
import notPokemon from "../assets/img/404.png";
import { Link, useNavigate } from "react-router-dom";

const NotData = () => {
  const navigate = useNavigate();
  const handle = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      navigate(-1);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center w-full h-full mt-[10%]'>
      <img
        src={notPokemon}
        alt='notPokemon'
        className='w-[40%] h-auto'
        loading='lazy'
      />
      <h1 className='text-3xl font-bold text-[black] mt-5'>
        해당 포켓몬의 정보가 없습니다.
      </h1>

      <Link
        to='/'
        onClick={handle}
        className='bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white'
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotData;
