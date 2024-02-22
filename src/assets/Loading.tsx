import gif from "../assets/img/1.gif";
import gif2 from "../assets/img/2.gif";
import { ClassNameProps } from "../types/ClassNameProps";

export const Loading = ({ rand }: any) => (
  <div role='status' className='justify-center items-center text-center'>
    {rand == 1 ? (
      <img src={gif} alt='' width='200px' height='200px' />
    ) : (
      <img src={gif2} alt='' width='200px' height='200px' />
    )}
    <span className='text-gray-800 text-sm'>Loading...</span>
  </div>
);
