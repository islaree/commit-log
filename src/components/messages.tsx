'use client'

import { useEffect, useState } from 'react'

import { UUID } from 'crypto'
import { format } from 'date-fns'
import { Bookmark, MessageSquareShare, Trash2 } from 'lucide-react'

import { createClient } from '@/utils/supabase/client'
import { revalidate, revalidatePosts } from '@/db/actions'
import { useParams } from 'next/navigation'
import { Input } from './ui/input'
import { Button } from './ui/button'

type Post = {
  id: UUID
  product_id: UUID
  message: string
  created_at: string
  bookmark: boolean
}

export const Messages = ({ data }: { data: Post[] }) => {
  const db = createClient()

  const [posts, setPosts] = useState(data)
  const [isActive, setIsActive] = useState('a')
  const [value, setValue] = useState('')

  const { id } = useParams()

  const handleInsert = async () => {
    await db.from('commits').insert({
      product_id: id,
      message: value,
      created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    })

    setValue('')
    revalidate(`/dashboard/${id}`)
  }

  useEffect(() => {
    const channel = db
      .channel('realtime commits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commits',
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setPosts([payload.new as Post, ...posts])
              break
            case 'UPDATE':
              setPosts(
                posts.map((p) => {
                  if (p.id == payload.new.id) return payload.new as Post
                  else return p
                }),
              )
              break
            case 'DELETE':
              setPosts(posts.filter((p) => p.id !== payload.old.id))
              break
            default:
              return
          }
        },
      )
      .subscribe()

    return () => {
      db.removeChannel(channel)
    }
  }, [db, posts, setPosts])

  return (
    <>
      <form className="relative" action={handleInsert}>
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
      <div className="flex items-center justify-between border-b border-gray-100 px-4 pb-4">
        <div className="flex items-center gap-x-4">
          <div
            className={`flex cursor-pointer items-center gap-x-1 ${isActive == 'a' ? 'text-gray-900' : 'text-gray-400'}`}
            onClick={() => setIsActive('a')}
          >
            <MessageSquareShare className="h-4 w-4" />
            <span className="text-sm"></span>
          </div>
          <div
            className={`flex cursor-pointer items-center gap-x-1 ${isActive == 'b' ? 'text-gray-900' : 'text-gray-400'}`}
            onClick={() => setIsActive('b')}
          >
            <Bookmark className="h-4 w-4" />
            <span className="text-sm">{}</span>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col lg:col-span-2">
        <div className="flex-1 overflow-auto">
          <div className="relative mx-auto flex max-w-2xl flex-col gap-y-4 px-4 py-4">
            {isActive == 'a'
              ? posts?.map((post) => <Commit key={post.id} data={post} />)
              : isActive == 'b'
                ? posts?.map((post) => post.bookmark && <Commit key={post.id} data={post} />)
                : ''}
          </div>
        </div>
      </div>
    </>
  )
}

function Commit({ data }: { data: Post }) {
  const db = createClient()

  const { id } = useParams()

  const handleDelete = async (postId: UUID) => {
    await db.from('commits').delete().eq('id', postId)
    revalidatePosts(id as UUID)
  }

  const handleBookmark = async (id: UUID) => {
    await db
      .from('commits')
      .upsert({
        ...data,
        bookmark: !data.bookmark,
      })
      .eq('id', id)
  }

  return (
    <div className="flex items-start gap-x-4">
      <div className="mt-1.5 space-y-2">
        <div className="space-x-2 align-middle text-sm">
          <div className="inline text-muted-foreground">
            {format(data.created_at, 'yyyy-MM-dd HH:mm')}:
          </div>
          <div className="inline whitespace-normal">{data.message}</div>
        </div>
        <div className="flex items-center gap-x-2 text-muted-foreground">
          <button
            type="button"
            onClick={() => {
              handleBookmark(data.id)
            }}
          >
            <Bookmark className={`h-4 w-4 ${data.bookmark && 'fill-yellow-500 text-yellow-500'}`} />
          </button>
          <button type="button" onClick={() => handleDelete(data.id)}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
