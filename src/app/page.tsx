import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const db = createClient()
  const {
    data: { user },
  } = await db.auth.getUser()

  return (
    <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Build your component library
      </h1>
      <span
        className="max-w-[750px] text-center text-lg font-light text-foreground"
        data-br=":r6j:"
        data-brr="1"
      >
        Beautifully designed components that you can copy and paste into your apps. Accessible.
        Customizable. Open Source.
      </span>
      <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        {user && (
          <Button variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
