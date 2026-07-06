export default function Footer() {
  return (
    <footer className="w-full bg-[#202020] px-9 py-7 text-white md:px-12">
      <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-3 md:items-start">
        <p className="max-w-[190px] text-[22px] font-medium leading-[1.2]">
          Barcha huquqlar himoyalangan.
        </p>

        <div>
          <h4 className="mb-5 text-[28px] font-extrabold leading-none">Yuridik manzil:</h4>
          <p className="text-[22px] font-medium leading-[1.2]">
            Toshkent,
            <br />
            Yashnobod tumani,
            <br />
            Olmos mahalla 58D
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-[28px] font-extrabold leading-none">Tezkor bog&apos;laning</h4>
          <div className="flex flex-col gap-5 text-[22px] font-extrabold leading-none">
            <a href="https://t.me/mindera_admin" className="transition-opacity hover:opacity-80">
              Telegram admin 1
            </a>
            <a href="https://t.me/mindera_admin" className="transition-opacity hover:opacity-80">
              Telegram admin 2
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
