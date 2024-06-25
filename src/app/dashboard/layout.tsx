import StoreProvider from '@/components/store-provider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'contribute | dashboard',
  description: '...',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="mx-auto max-w-2xl px-4">{children}</div>
    </StoreProvider>
  )
}
