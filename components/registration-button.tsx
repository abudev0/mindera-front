'use client'

import type { ReactNode } from 'react'

export default function RegistrationButton({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('open-registration-modal'))}
      className={className}
    >
      {children}
    </button>
  )
}
