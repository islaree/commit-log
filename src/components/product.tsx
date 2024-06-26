'use client'

import { useEffect, useState } from 'react'

import { createClient } from '@/utils/supabase/client'
import { UUID } from 'crypto'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { redirect, useRouter } from 'next/navigation'
import { ChevronLeft, Router } from 'lucide-react'
import Link from 'next/link'

type Product = {
  completed: boolean
  created_at: string
  id: UUID
  name: string
  user_id: UUID
  description: string
}

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

  const getData = async () => {
    const { data, error } = await db.from('products').select().eq('id', id).single()
    if (!error) {
      setProduct(data)
      setValue(data.name)
      setDescription(data.description ?? '')
    }
  }

  useEffect(() => {
    getData()
  }, [])

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
  }, [db, product, setProduct])

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>...</div>
      </div>
      <div>
        {editing ? (
          <>
            <div className="flex gap-x-2">
              <Input value={value} onChange={(e) => setValue(e.target.value)} />
              <Button onClick={handleUpdate}>save</Button>
            </div>
            <div className="flex gap-x-2">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              <Button onClick={handleUpdate}>save</Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 text-2xl font-bold">{value}</div>
            <div className="text-sm">{description}</div>
          </>
        )}
      </div>
      <div className="flex items-center gap-x-4">
        <Button variant="link" onClick={() => setEditing(!editing)}>
          edit
        </Button>
        <Button variant="link" onClick={handleDelete}>
          delete
        </Button>
      </div>
    </>
  )
}
