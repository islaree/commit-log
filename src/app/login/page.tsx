import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const db = createClient()
  const {
    data: { user },
  } = await db.auth.getUser()

  const signIn = async () => {
    'use server'
    const db = createClient()
    const origin = headers().get('origin')
    const { data, error } = await db.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
    } else {
      return redirect(data.url)
    }
  }

  return (
    <>
      <h1>this is login page!</h1>
      <div className="flex min-h-screen items-center justify-center">
        <form action={signIn}>
          <Button>login</Button>
        </form>
      </div>
    </>
  )
}
