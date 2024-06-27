'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { UUID } from 'crypto'

import { User } from '@supabase/supabase-js'
import { PlusIcon } from '@radix-ui/react-icons'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Pencil2Icon } from '@radix-ui/react-icons'

import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

type Product = {
  completed: boolean
  created_at: string
  id: UUID
  name: string
  user_id: UUID
  description: string
}

export const ProductEdit = ({ product, user }: { product: Product; user: User | null }) => {
  const [productName, setProductName] = useState(product.name)
  const [description, setDescription] = useState<string>(product.description ?? '')

  const db = createClient()

  const handleUpdate = async (id: UUID) => {
    await db
      .from('products')
      .upsert({
        id,
        name: productName,
        user_id: user?.id,
      })
      .eq('id', id)
  }

  const handleDelete = async (id: UUID) => {
    await db.from('products').delete().eq('id', id)
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsHorizontalIcon className="h-6 w-6 cursor-pointer rounded p-1 hover:bg-gray-300" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-x-2">
              <button onClick={() => setProductName(product.name)}>
                <Pencil2Icon className="h-4 w-4" />
                <span className="text-sm">名前を変更</span>
              </button>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-x-2 text-red-600"
            onClick={() => handleDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">削除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <div className="flex flex-col gap-y-4">
          <div>
            <Label>Name</Label>
            <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={() => handleUpdate(product.id)}>
              更新する
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
