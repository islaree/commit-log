import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center">
        <h1 className="text-6xl font-extrabold">Records your commitment to your goals.</h1>
        <Button asChild>
          <Link href="/login" className="rounded bg-black px-2 py-1 text-white">
            login
          </Link>
        </Button>
      </div>
    </>
  )
}
