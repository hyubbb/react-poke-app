import React from "react";

interface TypeProps {
  type: string;
  damageValue?: string;
}

const Type = ({ type, damageValue }: TypeProps) => {
  const bg = `bg-${type}`;
  return (
    <div
      className={`h-[1.5rem] py-1 px-3 rounded-2xl ${bg} font-bold text-zinc-800 text-[1rem] leading-[1rem] capitalize flex gap-1 justify-center items-center mt-3`}
    >
      <span>{type}</span>
      {damageValue && (
        <span className='bg-zinc-200/40 p-[.125rem] rounded'>
          {damageValue}
        </span>
      )}
    </div>
  );
};

export default Type;
