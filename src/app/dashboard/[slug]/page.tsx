import { Messages } from '@/components/messages'
import { Product } from '@/components/product'
import { createClient } from '@/utils/supabase/server'
import { UUID } from 'crypto'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const db = createClient()
  const { data, error } = await db.from('products').select().eq('id', params.slug).single()
  if (error) {
    notFound()
  }

  return (
    <>
      <div className="mb-6 mt-4 px-4">
        <Product id={params.slug} />
      </div>
      <Messages />
    </>
  )
}
