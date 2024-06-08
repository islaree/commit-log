import { Navigation } from '@/components/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen">
        <div className="w-60 border-r border-gray-100 bg-gray-100">
          <Navigation />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </>
  )
}
