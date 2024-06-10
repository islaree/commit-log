import Link from 'next/link'

import { HomeIcon } from '@radix-ui/react-icons'

import { createClient } from '@/utils/supabase/server'
import { Products } from '@/components/products'
import { Account } from '@/components/account'

export const Navigation = async () => {
  const db = createClient()
  const {
    data: { user },
  } = await db.auth.getUser()

  const { data } = await db
    .from('products')
    .select()
    .eq('user_id', user?.id)
    .order('created_at', { ascending: true })

  return (
    <div className="py-4">
      <div className="mb-2 px-2">
        <Account user={user} />
      </div>
      <div className="mb-6 px-2">
        <Link
          href="/dashboard"
          className="flex w-full items-center rounded px-2 py-1 hover:bg-gray-200"
        >
          <HomeIcon className="h-4 w-4" />
          <span className="ml-2 text-sm font-medium">ホーム</span>
        </Link>
      </div>
      <div className="px-2">
        <Products user={user} data={data ?? []} />
      </div>
    </div>
  )
}
