
const BlackFridayBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 sm:p-16 w-full bg-zinc-900 text-white">
      
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-center">
        <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 leading-none">
          BLACK
          <br className="sm:hidden" />
          FRIDAY
        </span>
      </h1>

      <p className="text-xl sm:text-2xl font-medium mb-8 text-zinc-200">
        Desapego do Felipe
      </p>


      <a
        href="/products"
        className="px-8 py-4 mb-4 text-xl sm:text-2xl font-bold rounded-lg shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.03] bg-linear-to-r from-blue-600 to-purple-600 text-white text-center w-auto cursor-pointer"
      >
        GARANTA O SEU
      </a>

      <p className="text-sm text-zinc-400 mt-2">
        Só até domingo! Estoque limitado
      </p>
    </div>
  );
};

export default BlackFridayBanner;