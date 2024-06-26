'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { UUID } from 'crypto'
import { format } from 'date-fns'
import {
  Bookmark,
  CornerDownLeft,
  Loader2,
  MessageSquareShare,
  SquarePen,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/utils/supabase/client'

type Commit = {
  id: UUID
  product_id: UUID
  message: string
  created_at: string
  bookmark: boolean
}

export const Messages = () => {
  const db = createClient()

  const { slug } = useParams()

  const [value, setValue] = useState('')
  const [commits, setCommits] = useState<Commit[] | null>(null)
  const [bookmarks, setBookmarks] = useState<Commit[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setIsActive] = useState('a')

  const handleInsert = async () => {
    setValue('')
    if (value.length > 0) {
      await db.from('commits').insert({
        product_id: slug,
        message: value,
        created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
      })
    }
  }

  const getCommitsData = useCallback(async () => {
    const { data } = await db
      .from('commits')
      .select()
      .eq('product_id', slug)
      .order('created_at', { ascending: false })
    setCommits(data)
    setIsLoading(false)
  }, [commits])

  // 初期ロード時にデータを取得する
  useEffect(() => {
    getCommitsData()
  }, [])

  useEffect(() => {
    setBookmarks(commits?.filter((c) => c.bookmark && c))
  }, [commits])

  // データベースを購読し、イベントをリアルタイムにデータベースへ伝える
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
              setCommits([payload.new as Commit, ...commits!])
              break
            case 'UPDATE':
              setCommits(
                commits!.map((c) => {
                  if (c.id == payload.new.id) return payload.new as Commit
                  else return c
                }),
              )
              break
            case 'DELETE':
              setCommits(commits!.filter((commit) => commit.id !== payload.old.id))
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
  }, [db, commits, setCommits])

  return (
    <>
      <div className="mb-10 flex items-center gap-x-4 px-4">
        <div
          className={`flex cursor-pointer items-center gap-x-1 ${isActive == 'a' ? 'text-gray-900' : 'text-gray-400'}`}
          onClick={() => setIsActive('a')}
        >
          <MessageSquareShare className="h-4 w-4" />
          <span className="text-sm">{commits?.length}</span>
        </div>
        <div
          className={`flex cursor-pointer items-center gap-x-1 ${isActive == 'b' ? 'text-gray-900' : 'text-gray-400'}`}
          onClick={() => setIsActive('b')}
        >
          <Bookmark className="h-4 w-4" />
          <span className="text-sm">{bookmarks?.length}</span>
        </div>
      </div>

      <div className="relative flex flex-col lg:col-span-2">
        <div className="flex-1 overflow-auto">
          <div className="relative mx-auto flex max-w-2xl flex-col gap-y-4 px-4 py-4">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isActive == 'a' ? (
              commits?.map((message) => <Commit key={message.id} data={message} />)
            ) : isActive == 'b' ? (
              commits?.map(
                (message) => message.bookmark && <Commit key={message.id} data={message} />,
              )
            ) : (
              'no data'
            )}
          </div>
        </div>
      </div>

      <div className="h-[20vh] border-t border-gray-100 p-4">
        <form
          className="relative mx-auto max-w-2xl overflow-hidden rounded-lg border bg-gray-100 focus-within:ring-1 focus-within:ring-ring"
          x-chunk="dashboard-03-chunk-1"
        >
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="メッセージを入力してください"
            value={value}
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            minLength={0}
            maxLength={120}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex items-center p-3 pt-0">
            <Button type="button" onClick={handleInsert} size="sm" className="ml-auto gap-1.5">
              送信
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

function Commit({ data }: { data: Commit }) {
  const db = createClient()

  const handleDelete = async (id: UUID) => {
    await db.from('commits').delete().eq('id', id)
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
      <div className="flex items-center justify-center rounded-full bg-gray-200 p-2">
        <MessageSquareShare className="h-4 w-4 text-gray-500" />
      </div>
      <div className="mt-1.5 w-full">
        <div className="whitespace-pre-wrap text-sm">{data.message}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-x-0.5">
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded text-xs font-medium text-gray-900 hover:bg-gray-200"
              onClick={() => {}}
            >
              <SquarePen className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded text-xs font-medium text-gray-900 hover:bg-gray-200"
              onClick={() => handleDelete(data.id)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded text-xs font-medium text-gray-900 hover:bg-gray-200"
              onClick={() => {
                handleBookmark(data.id)
              }}
            >
              <Bookmark className={`h-4 w-4 ${data.bookmark && 'fill-gray-900'}`} />
            </button>
          </div>
          <span className="text-xs font-medium text-gray-400">
            {format(data.created_at, 'yyyy-MM-dd HH:mm')}
          </span>
        </div>
      </div>
    </div>
  )
}
