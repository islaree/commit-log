import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { revalidatePath } from 'next/cache'

export async function getPosts(id: string) {
  const db = createClient()
  const { data } = await db
    .from('commits')
    .select()
    .eq('product_id', id)
    .order('created_at', { ascending: false })
  return data
}

export async function createPost(id: string, message: string) {
  const db = createClient()
  await db.from('commits').insert({
    product_id: id,
    message: message,
    created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
  })

  revalidatePath(`/dashboard/${id}`)
}
