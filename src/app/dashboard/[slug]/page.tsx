import { Commits } from '@/components/commits'
import { Product } from '@/components/product'
import { createClient } from '@/utils/supabase/server'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const db = createClient()
  const { data } = await db.from('products').select().eq('id', params.slug).single()

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10">
        <Product data={data} />
      </div>
      <ServerMessages id={params.slug} />
    </div>
  )
}

async function ServerMessages({ id }: { id: string }) {
  const db = createClient()
  const { data } = await db
    .from('commits')
    .select()
    .eq('product_id', id)
    .order('created_at', { ascending: true })

  return <Commits data={data ?? []} productId={id} />
}
