'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CircleCheckBig, Loader2, Trash2 } from 'lucide-react'
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
  completed: boolean
  created_at: string
  id: UUID
  name: string
  user_id: UUID
}

export const Products = ({ user }: { user: User | null }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[] | null>()

  const db = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await db
        .from('products')
        .select()
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
      setProducts(data)
      setIsLoading(false)
    }
    getData()
  }, [db, user?.id])

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
              setProducts([...products!, payload.new as Product])
              break
            case 'UPDATE':
              setProducts(
                products!.map((product) => {
                  if (product.id == payload.new.id) return payload.new as Product
                  else return product
                }),
              )
              break
            case 'DELETE':
              setProducts(products!.filter((product) => product.id !== payload.old.id))
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
        <CreateProduct user={user} />
      </div>
      <div>
        {isLoading ? (
          <div className="px-2 py-1.5">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="mt-1 text-sm">Loading</span>
            </div>
          </div>
        ) : (
          products?.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded pr-1.5 hover:bg-gray-100"
            >
              <Link
                href={`/dashboard/${product.id}`}
                className="flex w-full items-center gap-x-2 py-1.5 pl-2 text-sm"
              >
                {product.completed && <CircleCheckBig className="h-4 w-4 text-emerald-600" />}
                {product.name}
              </Link>
              <ProductItem product={product} user={user} />
            </div>
          ))
        )}
      </div>
    </>
  )
}

function ProductItem({ product, user }: { product: Product; user: User | null }) {
  const [productName, setProductName] = useState(product.name)

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
          <DialogTrigger onClick={() => setProductName(product.name)} asChild>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-x-2">
              <Pencil2Icon className="h-4 w-4" />
              <span className="text-sm">名前を変更</span>
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
        <DialogHeader>
          <DialogTitle>名前を変更する</DialogTitle>
          <DialogDescription>
            <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
          </DialogDescription>
        </DialogHeader>
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

const CreateProduct = ({ user }: { user: User | null }) => {
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
    return () => {
      setValue('')
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger onClick={() => setValue('')}>
        <PlusIcon className="h-6 w-6 rounded p-1 hover:bg-gray-200" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規プロダクトを追加する</DialogTitle>
          <DialogDescription>
            <Input
              id="product-name"
              className="col-span-3"
              value={value}
              placeholder="プロダクト名"
              onChange={(e) => setValue(e.target.value)}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={handleInsert}>
              追加する
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
