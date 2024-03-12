import gif from "../assets/img/loading1.gif";
import gif2 from "../assets/img/loading2.gif";
import { ClassNameProps } from "../types/ClassNameProps";

const rand = Math.floor(Math.random() * 2) + 1;

export const Loading = () => (
  <div role='status' className='justify-center items-center text-center'>
    {rand == 1 ? (
      <img src={gif} alt='' width='200px' height='200px' />
    ) : (
      <img src={gif2} alt='' width='200px' height='200px' />
    )}
    <span className='text-gray-800 text-2xl'>Loading...</span>
  </div>
);
