export const SplashScreen = () => {
  return (
    <>
      <style>
        {`
                @keyframes fadeInOut {
                0%, 100% {
                opacity: 0;
                }
                50% {
                opacity: 1;
                }
                }
                .fade-in-out {
                animation: fadeInOut 3s infinite;
                }
            `}
      </style>
      <div className="flex flex-col items-center justify-center h-dvh bg-main">
        <img
          src="/img/logo_juventut.svg"
          alt="Logo"
          className="w-full h-auto p-5 fade-in-out"
        />
        <img
          src="/img/logo_ajt_pa.png"
          alt="Logo"
          className="w-full h-auto p-5 fade-in-out"
        />
      </div>
    </>
  );
};
