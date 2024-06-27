'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cache, useEffect, useState } from 'react'

import { UUID } from 'crypto'
import { ChevronLeft, CornerDownLeft, Ellipsis, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/utils/supabase/client'
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
import { Label } from './ui/label'
import { DotsHorizontalIcon, Pencil2Icon } from '@radix-ui/react-icons'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

type Product = {
  completed: boolean
  created_at: string
  id: UUID
  name: string
  user_id: UUID
  description: string
}

const getData = cache(async (id: string) => {
  const db = createClient()
  const { data } = await db.from('products').select().eq('id', id).single()
  console.log('getData')
  return data
})

export const Product = ({ id }: { id: string }) => {
  const db = createClient()

  const [product, setProduct] = useState<Product | null>(null)
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [editing, setEditing] = useState(false)

  const router = useRouter()

  const handleUpdate = async () => {
    setEditing(false)
    await db
      .from('products')
      .upsert({
        ...product,
        name: value,
        description: description,
      })
      .eq('id', id)
  }

  const handleDelete = async () => {
    await db.from('products').delete().eq('id', id)
    router.push('/dashboard')
  }

  // 初期ロード時
  useEffect(() => {
    const setData = async () => {
      const data = await getData(id)
      setProduct(data)
      setValue(data!.name)
      setDescription(data?.description ?? '')
    }

    setData()
  }, [])

  // productを購読し更新を監視する
  useEffect(() => {
    const channel = db
      .channel('realtime products')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          setProduct(payload.new as Product)
        },
      )
      .subscribe()

    return () => {
      db.removeChannel(channel)
    }
  }, [setProduct])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm">戻る</span>
        </Link>
        <Drawer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <Ellipsis className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <DrawerTrigger asChild onClick={() => setEditing(!editing)}>
                  <DropdownMenuItem className="flex cursor-pointer items-center gap-x-2">
                    <Pencil2Icon className="h-4 w-4" />
                    <span className="text-sm">名前を変更</span>
                  </DropdownMenuItem>
                </DrawerTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-x-2 text-red-600"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm">削除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DrawerContent className="mx-auto max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <div className="flex flex-col gap-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={product?.name}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Description</Label>
                  <Textarea
                    id="message"
                    defaultValue={product?.description}
                    minLength={0}
                    maxLength={120}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button type="button" onClick={handleUpdate}>
                  更新
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">キャンセル</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div>
        <div className="mb-2 text-2xl font-bold">{product?.name}</div>
        <div className="text-sm">{product?.description}</div>
      </div>
    </>
  )
}
