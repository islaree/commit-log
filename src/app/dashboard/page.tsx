import { cache } from 'react'

import { Account } from '@/components/account'
import { Products } from '@/components/products'
import { createClient } from '@/utils/supabase/server'

const getUser = cache(async () => {
  const db = createClient()
  const {
    data: { user },
  } = await db.auth.getUser()

  return user
})

export default async function Dashboard() {
  const user = await getUser()

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Account user={user} />
      </div>
      <div className="mt-6 flex flex-col gap-y-4">
        <Products user={user} />
      </div>
    </div>
  )
}
