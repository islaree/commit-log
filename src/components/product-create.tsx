'use client'

import { useEffect, useState } from 'react'

import { User } from '@supabase/supabase-js'
import { PlusIcon } from '@radix-ui/react-icons'

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
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

export const CreateProduct = ({ user }: { user: User | null }) => {
  const [value, setValue] = useState('')
  const [textarea, setTextarea] = useState('')
  const [isActive, setIsActive] = useState(false)

  const db = createClient()

  const handleInsert = async () => {
    setValue('')
    setTextarea('')
    if (value.length > 0) {
      await db.from('products').insert({
        user_id: user?.id,
        name: value,
        description: textarea,
      })
    }
  }

  useEffect(() => {
    return () => {
      setValue('')
      setTextarea('')
    }
  }, [isActive])

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => setIsActive(!isActive)}>
        <Button type="button" size="sm">
          新規作成
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規プロダクトを追加する</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <div>
            <Label>Name</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={textarea} onChange={(e) => setTextarea(e.target.value)} />
          </div>
        </div>
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
