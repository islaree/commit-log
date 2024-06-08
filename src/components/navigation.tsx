import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export const Navigation = async () => {
  const db = createClient()
  const {
    data: { user },
  } = await db.auth.getUser()

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-2 py-1 hover:bg-gray-200">
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-gray-400">
          <Image src={user?.user_metadata.avatar_url} alt="" width={40} height={40} />
        </div>
        <div>{user?.user_metadata.name}さん</div>
      </div>
      <form action="/auth/signout" method="post">
        <button>signout</button>
      </form>
      <div className="px-2 py-4">
        <div className="mb-4">
          <Link href="/dashboard" className="flex p-2 hover:bg-gray-200">
            home
          </Link>
        </div>
        <div className="mb-2 text-sm text-gray-600">Projects</div>
        <div>
          <Link href="/dashboard/a" className="flex p-2 hover:bg-gray-200">
            a
          </Link>
        </div>
        <div>
          <Link href="/dashboard/b" className="flex p-2 hover:bg-gray-200">
            b
          </Link>
        </div>
        <div>
          <Link href="/dashboard/c" className="flex p-2 hover:bg-gray-200">
            c
          </Link>
        </div>
      </div>
    </div>
  )
}
