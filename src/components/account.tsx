'use client'

import Image from 'next/image'

import { User } from '@supabase/supabase-js'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Account = ({ user }: { user: User | null }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <div className="flex items-center rounded px-2 py-1 hover:bg-gray-100">
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-gray-400">
              <Image src={user?.user_metadata.avatar_url} alt="" width={40} height={40} />
            </div>
            <div className="ml-2 text-sm font-medium">{user?.user_metadata.name}さん</div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user?.user_metadata.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <form action="/auth/signout" method="post">
            <DropdownMenuItem className="w-full">
              <button className="w-full text-red-600">ログアウト</button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
