import { createClient } from '@/db/server'

export async function getPosts(id: string) {
  const db = createClient()
  const { data } = await db
    .from('commits')
    .select()
    .eq('product_id', id)
    .order('created_at', { ascending: false })
  return data
}
