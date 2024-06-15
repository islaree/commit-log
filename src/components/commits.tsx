'use client'

import { useEffect, useState } from 'react'

import { UUID } from 'crypto'
import { format } from 'date-fns'
import { Terminal, CornerDownLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createClient } from '@/utils/supabase/client'

type Message = {
  id: UUID
  product_id: UUID
  message: string
  created_at: string
}

export const Messages = ({ data, productId }: { data: Message[]; productId: string }) => {
  const [commits, setCommits] = useState(data)
  const [value, setValue] = useState('')

  const db = createClient()

  const handleInsert = async () => {
    setValue('')
    if (value.length > 0) {
      await db.from('commits').insert({
        product_id: productId,
        message: value,
        created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
      })
    }
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
              setCommits([...commits, payload.new as Message])
              break
            case 'DELETE':
              console.log(payload)
              setCommits(commits.filter((commit) => commit.id !== payload.old.id))
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
      <TooltipProvider>
        <div className="relative flex h-full max-h-screen min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
          <Badge variant="outline" className="absolute right-3 top-3">
            Commit
          </Badge>
          <div className="my-10 flex-1">
            <div className="mx-4 flex flex-col gap-y-2">
              {commits?.map((message: any) => <Commit key={message.id} data={message} />)}
            </div>
          </div>
          <form
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            x-chunk="dashboard-03-chunk-1"
            onSubmit={handleInsert}
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={value}
              className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="flex items-center p-3 pt-0">
              <Button type="submit" size="sm" className="ml-auto gap-1.5">
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </TooltipProvider>
    </>
  )
}

function Commit({ data }: { data: Message }) {
  const db = createClient()

  const handleDelete = async (id: UUID) => {
    await db.from('commits').delete().eq('id', id)
  }

  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{data.message}</AlertTitle>
      <AlertDescription className="text-gray-400">
        {format(data.created_at, 'yyyy-MM-dd HH:mm')}
      </AlertDescription>
      <form onSubmit={() => handleDelete(data.id)}>
        <Button variant="link" onClick={() => handleDelete(data.id)}>
          削除する
        </Button>
      </form>
    </Alert>
  )
}
