import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'contribute | dashboard',
  description: '...',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl">{children}</div>
}
