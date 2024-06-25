'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { UUID } from 'crypto'
import { Bookmark, MessageSquareShare } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'

type Product = {
  completed: boolean
  created_at: string
  id: UUID
  name: string
  user_id: UUID
  description: string
}

export const ProductItem = ({ product }: { product: Product }) => {
  const db = createClient()

  const [commits, setCommits] = useState(0)
  const [bookmark, setBookmark] = useState(0)

  const getCommitsData = useCallback(async () => {
    const { data, error } = await db.from('commits').select().eq('product_id', product.id)
    if (!error) {
      setCommits(data.length)
    }
  }, [commits])

  const getBookmarksData = useCallback(async () => {
    const { data, error } = await db
      .from('commits')
      .select()
      .eq('product_id', product.id)
      .eq('bookmark', true)
    if (!error) {
      setBookmark(data.length)
    }
  }, [commits])

  useEffect(() => {
    getCommitsData()
    getBookmarksData()
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
              <MessageSquareShare className="mr-1 h-3 w-3" />
              {commits}
            </div>
            <div className="flex items-center">
              <Bookmark className="mr-1 h-3 w-3" />
              {bookmark}
            </div>
            <div>Updated April 2023</div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
