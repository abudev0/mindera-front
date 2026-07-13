export type PlanMonth = 1 | 2 | 3

export const coursePlanOptions: Array<{
  months: PlanMonth
  discount: number
  label: string
  hook: string
}> = [
  { months: 1, discount: 0, label: '1 oy', hook: 'Boshlash uchun eng oson qadam' },
  { months: 2, discount: 5, label: '2 oy', hook: 'Chegirma bilan barqaror davom etish' },
  { months: 3, discount: 10, label: '3 oy', hook: 'Eng katta foyda va to‘liq natija rejasi' },
]

export function isPlanMonth(value: number): value is PlanMonth {
  return value === 1 || value === 2 || value === 3
}

export function getCoursePlan(monthlyPrice: number, months: PlanMonth) {
  const option = coursePlanOptions.find((item) => item.months === months) ?? coursePlanOptions[0]
  const original = monthlyPrice * option.months
  const saving = Math.round(original * (option.discount / 100))

  return {
    ...option,
    original,
    saving,
    total: original - saving,
  }
}

export function formatUsd(value: number) {
  return `$${new Intl.NumberFormat('en-US').format(value)}`
}
