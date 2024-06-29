import { createClient } from '@/utils/supabase/server'

export async function getUser() {
  const db = createClient()
  const {
    data: { user },
  } = await db.auth.getUser()
  return user
}
