'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { UUID } from 'crypto'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { revalidate } from '@/db/actions'
import { createClient } from '@/db/client'

type Product = {
  id: UUID
  name: string
  user_id: UUID
}

export const Products = ({ data }: { data: Product[] }) => {
  const db = createClient()

  const [products, setProducts] = useState(data)

  const handleDelete = async (id: string) => {
    await db.from('products').delete().eq('id', id)
    revalidate('/dashboard')
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
              setProducts([payload.new as Product, ...products])
              break
            case 'UPDATE':
              break
            case 'DELETE':
              setProducts(products.filter((p) => p.id != payload.old.id))
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
  }, [db, products])

  return (
    <>
      {products.map((product) => (
        <div key={product.id}>
          <div className="font-medium">
            <Link href={`/dashboard/${product.id}`}>{product.name}</Link>
          </div>
          <div>
            <button className="text-muted-foreground" onClick={() => handleDelete(product.id)}>
              delete
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
