export default function StaticHero() {
  return (
    <section className="bg-[#fcfaf7] py-12 sm:py-16 lg:py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Images - Hidden on mobile */}
          <div className="hidden lg:grid lg:col-span-3 gap-4 items-start">
            <div className="w-32 h-24 object-cover rounded-2xl shadow-lg transform -rotate-3 ml-4 bg-gray-200" />
            <div className="w-28 h-32 object-cover rounded-2xl shadow-lg transform rotate-2 bg-gray-200" />
            <div className="w-32 h-28 object-cover rounded-2xl shadow-lg transform -rotate-2 ml-4 bg-gray-200" />
          </div>

          {/* Center Content */}
          <div className="lg:col-span-6 flex flex-col items-center text-center">
            <div className="mb-4 flex justify-center">
              <span className="bg-[#f8eac7] text-[#b48a1e] px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold font-display">
                Exclusive Perks
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-[#23272f] mb-4 sm:mb-6 leading-tight font-display">
              Exclusive Perks for Ambitious Founders
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#6b6f76] mb-6 sm:mb-8 max-w-2xl">
              Get exclusive deals, discounts, and perks designed for startup teams and founders.
            </p>
          </div>

          {/* Right Images - Hidden on mobile */}
          <div className="hidden lg:grid lg:col-span-3 gap-4 items-end">
            <div className="w-32 h-28 object-cover rounded-2xl shadow-lg transform rotate-3 ml-auto bg-gray-200" />
            <div className="w-28 h-32 object-cover rounded-2xl shadow-lg transform -rotate-2 mr-auto bg-gray-200" />
            <div className="w-32 h-24 object-cover rounded-2xl shadow-lg transform rotate-2 ml-auto bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
