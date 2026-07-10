'use client'

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-[10px] bg-[#ffc329] px-5 py-3 text-[16px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d] print:hidden"
    >
      PDF saqlash / Chop etish
    </button>
  )
}
