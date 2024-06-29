import { UUID } from 'crypto'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProducts(userId: string) {
  const db = createClient()
  const { data } = await db
    .from('products')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data
}

export async function getProduct(id: UUID) {
  const db = createClient()
  const { data } = await db.from('products').select().eq('id', id).single()
  return data
}
