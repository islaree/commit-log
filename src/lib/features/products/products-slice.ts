import { createClient } from '@/utils/supabase/server'
import { createSlice } from '@reduxjs/toolkit'
import { UUID } from 'crypto'

type Product = {
  id: UUID
  user_id: UUID
  name: string
  description: string
  created_at: string
  completed: boolean
}

const initialState: Product[] | null = []

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    initialize: (state, action) => {
      return action.payload
    },
    insert: (state, action) => {
      return [...state, action.payload]
    },
    DELETE: (state, action) => {
      return state.filter((p) => p.id !== action.payload)
    },
    UPDATE(state, action) {
      return state.map((product) => {
        if (product.id == action.payload.id) return action.payload
        else return product
      })
    },
  },
})

export const { DELETE, initialize, UPDATE, insert } = productsSlice.actions
export default productsSlice.reducer
