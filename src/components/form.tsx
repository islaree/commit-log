'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'

import { insertProducts } from '@/db/actions'

export function ProductCreateForm({ userId }: { userId: string }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    setValue('')
    insertProducts(userId, value)
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm">
          New
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <form action={handleSubmit}>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <Input
              value={value}
              placeholder="プロダクト名を入力してください..."
              className="text-md h-10 pr-16"
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="submit">追加</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
