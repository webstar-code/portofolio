export default function Home() {
  return (
    <main className="w-full relative h-screen">
      <div className="w-[90%] md:w-[80%] xl:w-[70%] max-w-6xl mx-auto h-full relative flex justify-center">
        <div className="absolute left-4 md:left-0 h-full flex gap-4">
          <div className="w-[3px] h-full bg-[#FCA311]"></div>
          <div className="w-[3px] h-full bg-[#E70000]"></div>
        </div>
        <div className="w-[80%] md:w-[75%] xl:w-[70%] max-w-4xl h-full flex flex-col gap-10 pt-20 px-4">
          <h2 className="text-base">hi, i am bhavesh choudhary and i'm</h2>
          <h1 className="text-3xl md:text-4xl font-normal leading-relaxed md:leading-relaxed">on a mission to craft exceptional digital experiences</h1>
        </div>
      </div>
    </main>
  );
}
