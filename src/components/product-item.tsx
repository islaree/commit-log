'use client'

import Link from 'next/link'
import { cache, useEffect, useState } from 'react'
import { UUID } from 'crypto'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import { PencilLine } from 'lucide-react'

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
  const { data } = await db.from('commits').select().eq('product_id', id)
  return data?.length
})

export const ProductItem = ({ product }: { product: Product }) => {
  const [commits, setCommits] = useState<number>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const setData = async () => {
      const data = await getData(product.id)
      setCommits(data)
      setLoading(true)
    }

    setData()
  }, [])

  return (
    <Card>
      <Link href={`/dashboard/${product.id}`}>
        <CardHeader>
          <div className="space-y-1">
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              {loading ? (
                <div className="flex items-center gap-x-2">
                  <PencilLine className="h-4 w-4" />
                  {commits}
                </div>
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
