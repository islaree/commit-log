'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { UUID } from 'crypto'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { productsAction } from '@/db/actions'
import { createClient } from '@/utils/supabase/client'
import { insertProducts } from '@/db/actions'

type Product = {
  id: UUID
  name: string
  user_id: UUID
}

export const Productss = ({ data, userId }: { data: Product[]; userId: string }) => {
  const db = createClient()
  const [products, setProducts] = useState(data)
  const [name, setName] = useState('')

  const handleInsert = async () => {
    setName('')

    await db.from('products').insert({
      user_id: userId,
      name: name,
    })

    productsAction()
  }

  const handleDelete = async (id: string) => {
    await db.from('products').delete().eq('id', id)
    productsAction()
  }

  // useEffect(() => {
  //   const channel = db
  //     .channel('realtime products')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'products',
  //       },
  //       (payload) => {
  //         switch (payload.eventType) {
  //           case 'INSERT':
  //             setProducts([...products, payload.new as Product])
  //             break
  //           case 'UPDATE':
  //             break
  //           case 'DELETE':
  //             setProducts(products.filter((p) => p.id != payload.old.id))
  //             break
  //           default:
  //             return
  //         }
  //       },
  //     )
  //     .subscribe()

  //   return () => {
  //     db.removeChannel(channel)
  //   }
  // }, [db, products])

  return (
    <>
      <div>
        <form className="relative" action={async () => insertProducts(userId, name)}>
          <Input
            value={name}
            placeholder="product name here..."
            className="text-md h-10 pr-32"
            onChange={(e) => setName(e.target.value)}
          />
          <Button size="sm" type="submit" variant="default" className="absolute right-1 top-1">
            追加
          </Button>
        </form>
      </div>
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
