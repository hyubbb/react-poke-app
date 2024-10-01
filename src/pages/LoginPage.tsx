const LoginPage = () => {
  return (
    <div>
      <section className='bg-gray-50 min-h[90vh] flex items-center justify-center'>
        {/* 작으면 hidden, md사이즈 이상이면 보여지게 */}
        <div className='bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center'>
          <div className='md:w-1/2 px-8 mdd:px-16'>
            <h2 className='font-bold text-2xl'>Pokemon</h2>
            <p className='text-xs mt-5 text-[#002d74]'>
              포켓몬 사이트에 오신걸
            </p>
            <p className='text-xs mt-5 text-[#002d74]'>환영합니다.</p>
            <p className='text-xs mt-5 text-[#002d74]'>로그인 해주세요</p>
          </div>
          <div className='md:block hidden w-1/2'>
            <img
              src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
              className='rounded-2xl'
              alt='login'
              loading='lazy'
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
