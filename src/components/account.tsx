'use client'

import Image from 'next/image'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@supabase/supabase-js'

export const Account = ({ user }: { user: User | null }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <div className="flex items-center px-2 py-1 hover:bg-gray-200">
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-gray-400">
              <Image src={user?.user_metadata.avatar_url} alt="" width={40} height={40} />
            </div>
            <div className="ml-2 text-sm font-medium">{user?.user_metadata.name}さん</div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user?.user_metadata.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="w-full">
            <form action="/auth/signout" method="post">
              <button className="w-full text-red-500">ログアウト</button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
