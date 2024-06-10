'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UUID } from 'crypto'

import { User } from '@supabase/supabase-js'
import { PlusIcon } from '@radix-ui/react-icons'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { TrashIcon } from '@radix-ui/react-icons'

import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Product = {
  id: UUID
  user_id: UUID
  name: string
}

export const Products = ({ data, user }: { data: Product[]; user: User | null }) => {
  const [products, setProducts] = useState(data)
  const [value, setValue] = useState('')

  const db = createClient()

  const handleInsert = async () => {
    setValue('')
    if (value.length > 0) {
      await db.from('products').insert({
        user_id: user?.id,
        name: value,
      })
    }
  }

  useEffect(() => {
    const channel = db
      .channel('realtime products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setProducts([...products, payload.new as Product])
              break
            case 'UPDATE':
              setProducts(
                products.map((p) => {
                  if (p.id == payload.new.id)
                    return { id: p.id, name: payload.new.name, user_id: payload.new.user_id }
                  else return p
                }),
              )
              break
            case 'DELETE':
              setProducts(products.filter((product) => product.id !== payload.old.id))
              break
            default:
              return
          }
        },
      )
      .subscribe()

    return () => {
      db.removeChannel(channel)
    }
  }, [db, products, setProducts])

  return (
    <>
      <div className="mb-2 flex items-center justify-between border-b border-gray-300 pb-1 pl-2 pr-1.5">
        <div className="text-xs font-semibold text-gray-600">あなたのプロダクト</div>
        <Dialog>
          <DialogTrigger>
            <PlusIcon className="h-6 w-6 rounded p-1 hover:bg-gray-200" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add products</DialogTitle>
              <DialogDescription>
                <Input
                  id="product-name"
                  className="col-span-3"
                  value={value}
                  placeholder="product name"
                  onChange={(e) => setValue(e.target.value)}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={handleInsert}>
                  submit
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded pr-1.5 hover:bg-gray-200"
          >
            <Link href={`/dashboard/${product.id}`} className="w-full py-1.5 pl-2 text-sm">
              {product.name}
            </Link>
            <ProductItem data={product} user={user} />
          </div>
        ))}
      </div>
    </>
  )
}

function ProductItem({ data, user }: { data: Product; user: User | null }) {
  const [productName, setProductName] = useState(data.name)

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
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <DotsHorizontalIcon className="h-6 w-6 cursor-pointer rounded p-1 hover:bg-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger asChild>
              <DropdownMenuItem className="flex items-center gap-x-2">
                <Pencil2Icon className="h-4 w-4" />
                <span className="text-sm">名前を変更</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => handleDelete(data.id)}
            >
              <TrashIcon className="h-4 w-4" />
              <span className="text-sm">削除</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={() => handleUpdate(data.id)}>
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
