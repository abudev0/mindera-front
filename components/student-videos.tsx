import Image from 'next/image'

const feedbackVideos = [
  { id: '4hHL9YRE1RY', title: "O'quvchi fikri 1" },
  { id: 'Tq7o0FfYCvA', title: "O'quvchi fikri 2" },
  { id: 'hulDy4xnceI', title: "O'quvchi fikri 3" },
]

const feedbackImages = [
  '/img11.jpg',
  '/img12.jpg',
  '/img13.jpg',
  '/img14.jpg',
  '/img15.jpg',
  '/img16.jpg',
  '/img17.jpg',
  '/img18.jpg',
]

const lessonVideos = [
  { id: 'D3oiAeK-hzY', title: "Darslik namunasi 1" },
  { id: 'X14zrryt6s0', title: "Darslik namunasi 2" },
  { id: 'rVO7WZ8uKEg', title: "Darslik namunasi 3" },
]

function VideoRow({
  videos,
  images = [],
}: {
  videos: { id: string; title: string }[]
  images?: string[]
}) {
  return (
    <div className="scrollbar-hidden mt-10 flex gap-6 overflow-x-auto pb-3">
      {videos.map((video) => (
        <div
          key={video.id}
          className="relative aspect-[9/16] w-[230px] shrink-0 overflow-hidden bg-black md:w-[280px]"
        >
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ))}
      {images.map((image, index) => (
        <div
          key={image}
          className="relative aspect-[9/16] w-[230px] shrink-0 overflow-hidden bg-black md:w-[280px]"
        >
          <Image
            src={image}
            alt={`O'quvchi fikri rasmi ${index + 1}`}
            fill
            sizes="280px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export default function StudentVideos() {
  return (
    <section className="w-full bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mx-auto max-w-3xl text-center text-[34px] font-extrabold leading-tight text-black md:text-[52px]">
          Sizdan oldin o&apos;qigan o&apos;quvchilarimiz fikrlari
        </h2>

        <VideoRow videos={feedbackVideos} images={feedbackImages} />

        <h2 className="mx-auto mt-20 max-w-3xl text-center text-[34px] font-extrabold leading-tight text-black md:text-[52px]">
          Darsliklardan na&apos;munalar
        </h2>

        <VideoRow videos={lessonVideos} />
      </div>
    </section>
  )
}
