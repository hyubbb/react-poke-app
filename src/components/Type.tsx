import axios from "axios";
import React, { useEffect, useState } from "react";
import { Species } from "../types/PokemonDetail";
import { Name } from "../types/DamageRelationsOfType";

interface TypeProps {
  type: Species;
  damageValue?: string;
}

const Type = ({ type, damageValue }: TypeProps) => {
  const bgColor = type.name ? type.name : type;
  const [koName, setKoName] = useState([]);

  useEffect(() => {
    getFilterList(type.url);
  }, []);

  const getFilterList = async (url: string) => {
    if (url) {
      const result = await koTypeName(url);
      setKoName(result.koName);
    }
  };

  const koTypeName = async (url: string) => {
    const response = await axios.get(url);
    const result = response.data.names.reduce(
      (acc: { koName: string; name: string }, curr: Name) => {
        if (curr.language.name === "ko" && curr.name !== "???") {
          acc = { koName: curr.name, name: response.data.name };
        }
        return acc;
      },
      {}
    );
    return result;
  };

  const bg = `bg-${bgColor}`;

  return (
    <div
      className={`h-[1.5rem] py-1 px-3 rounded-2xl ${bg} font-bold text-zinc-800 text-[1rem] leading-[1rem] capitalize flex gap-1 justify-center items-center mt-3`}
    >
      <span>{koName}</span>
      {damageValue && (
        <>
          <span className='bg-zinc-200/40 p-[.125rem] rounded'>
            {damageValue}
          </span>
        </>
      )}
    </div>
  );
};

export default Type;
