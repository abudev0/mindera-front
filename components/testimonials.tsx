import Image from 'next/image'

const teachers = [
  { name: 'Sardor Olimov', level: 'IELTS 8.5', image: '/img7.png' },
  { name: 'Shaxriyor Karimov', level: 'IELTS 8', image: '/img8.png' },
  { name: 'Elvira Abdimalikova', level: 'IELTS 7.5', image: '/img9.png' },
  { name: 'Ziyoda', level: 'IELTS 7.5', image: '/img10.png' },
]

export default function Testimonials() {
  return (
    <section className="w-full bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="text-center text-[38px] font-extrabold leading-tight text-black md:text-[56px]">
          Ustozlar jamoasi
        </h2>
        <p className="mb-14 mt-3 text-center text-[20px] text-gray-700 md:text-[26px]">
          Sizga ushbu ustozlardan biri biriktiriladi
        </p>

        <div className="scrollbar-hidden flex gap-4 overflow-x-auto pb-3 md:gap-5">
          {teachers.map((teacher) => (
            <div
              key={teacher.name}
              className="relative aspect-[4/5.4] w-[260px] shrink-0 overflow-hidden rounded-[14px] bg-[#202020] sm:w-[300px]"
            >
              <Image
                src={teacher.image}
                alt={teacher.name}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
