'use client'

import { useState } from 'react'

import { deleteProduct, insertProducts } from '@/db/actions'
import { Input } from './ui/input'
import { Button } from './ui/button'

export function CreateProduct({ id }: { id: string }) {
  const [value, setValue] = useState('')

  return (
    <form
      className="relative"
      onSubmit={() => setValue('')}
      action={() => insertProducts(id, value)}
    >
      <Input
        value={value}
        placeholder="new product name here..."
        className="h-10 pr-32"
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" size="sm" className="absolute right-1 top-1">
        submit
      </Button>
    </form>
  )
}

export function DeleteProduct({ id }: { id: string }) {
  return (
    <form action={() => deleteProduct(id)}>
      <button type="submit" className="text-muted-foreground">
        delete
      </button>
    </form>
  )
}
