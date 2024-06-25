'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Bookmark, MessageSquareShare } from 'lucide-react'
import { User } from '@supabase/supabase-js'

import { CreateProduct } from '@/components/product-create'
import { insert, initialize, DELETE, UPDATE } from '@/lib/features/products/products-slice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { createClient } from '@/utils/supabase/client'
import { ProductItem } from './product-item'

export const Products = ({ user }: { user: User | null }) => {
  const [isLoading, setIsLoading] = useState(true)

  const products = useAppSelector((state) => state.products)
  const dispatch = useAppDispatch()

  const db = createClient()

  const getData = useCallback(async () => {
    try {
      const { data, error, status } = await db
        .from('products')
        .select()
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        dispatch(initialize(data))
        setIsLoading(false)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [products])

  useEffect(() => {
    getData()
  }, [])

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
              dispatch(insert(payload.new))
              break
            case 'UPDATE':
              dispatch(UPDATE(payload.new))
              break
            case 'DELETE':
              dispatch(DELETE(payload.old.id))
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
      <div className="flex justify-end">
        <CreateProduct user={user} />
      </div>
      <div className="flex flex-col gap-y-4">
        {isLoading ? (
          <></>
        ) : (
          products?.map((product) => (
            <div key={product.id}>
              <ProductItem product={product} />
            </div>
          ))
        )}
      </div>
    </>
  )
}
