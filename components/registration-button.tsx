'use client'

import type { ReactNode } from 'react'

export default function RegistrationButton({
  children,
  className,
  mode = 'register',
}: {
  children: ReactNode
  className: string
  mode?: 'register' | 'login'
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('open-registration-modal', { detail: { mode } }))}
      className={className}
    >
      {children}
    </button>
  )
}
