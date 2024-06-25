import { Account } from '@/components/account'
import { Products } from '@/components/products'
import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  const db = createClient()
  const {
    data: { user },
  } = await db.auth.getUser()

  return (
    <>
      <div className="flex justify-end">
        <Account user={user} />
      </div>
      <div className="mt-6 flex flex-col gap-y-4">
        <Products user={user} />
      </div>
    </>
  )
}
