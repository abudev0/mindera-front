export default function OnlineLessons() {
  return (
    <section className="w-full bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-black mb-8">
          Darsliklardan na&apos;munalar
        </h2>

        {/* Online lessons grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center cursor-pointer hover:from-gray-600 transition-colors group">
                <div className="absolute top-3 left-3 bg-yellow-400 px-2 py-1 rounded text-xs text-black font-bold">
                  Online Lessons
                </div>
                <div className="text-white text-5xl group-hover:scale-110 transition-transform">▶</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
