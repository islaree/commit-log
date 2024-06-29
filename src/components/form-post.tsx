'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CornerDownLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { UUID } from 'crypto'

import { Input } from '@/components/ui/input'
import { createPost } from '@/db/actions'

export function Form({ id }: { id: UUID }) {
  const [value, setValue] = useState('')

  return (
    <form className="relative" action={() => createPost(id, value)}>
      <Input
        value={value}
        placeholder="post message here..."
        className="text-md h-10 pr-32"
        onChange={(e) => setValue(e.target.value)}
      />
      <Button size="sm" type="submit" variant="default" className="absolute right-1 top-1">
        追加
      </Button>
    </form>
  )
}
