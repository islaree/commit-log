'use server'

import { revalidatePath } from 'next/cache'
import { UUID } from 'crypto'
import { format } from 'date-fns'

import { createClient } from '@/utils/supabase/server'

export async function productsAction() {
  revalidatePath('/dashboard', 'page')
}

export async function revalidatePosts(id: UUID) {
  const url = '/dashboard/' + id
  revalidatePath(url)
}

export async function insertProducts(id: string, name: string) {
  const db = createClient()
  await db.from('products').insert({
    user_id: id,
    name: name,
  })

  revalidatePath('/dashboard')
}

export async function deleteProduct(id: string) {
  const db = createClient()
  await db.from('products').delete().eq('id', id)

  revalidatePath('/dashboard')
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
