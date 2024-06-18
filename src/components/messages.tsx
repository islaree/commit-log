"use client"

import { useEffect, useState } from "react"

import { UUID } from "crypto"
import { format } from "date-fns"
import { CornerDownLeft, Loader2 } from "lucide-react"

import { 
    Alert, 
    AlertDescription,
    AlertTitle 
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"

import { createClient } from "@/utils/supabase/client"


type Message = {
    id: string
    product_id: string
    text: string
    created_at: string
}

type Commit = {
    id: UUID
    product_id: UUID
    message: string
    created_at: string
}

export const Messages = ({productId}: {productId: string}) => {
    const db = createClient()

    const [value, setValue] = useState("")
    const [commits, setCommits] = useState<Commit[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const handleInsert = async () => {
        setValue("")
        if(value.length > 0){
            await db.from("commits").insert({
                product_id: productId,
                message: value,
                created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX")
            })
        }
    }
    
    // 初期ロード時にデータを取得する
    useEffect(() => {
        const getData = async () => {
            const { data } = await db.from("commits")
            .select()
            .eq("product_id", productId)
            .order('created_at',
                { ascending: true }
            );
            setCommits(data)
            setIsLoading(false)
        }

        getData()
    }, [])

    // データベースを購読し、イベントをリアルタイムにデータベースへ伝える
    useEffect(() => {
        const channel = db.channel("realtime commits").on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "commits"
        },
        async (payload) => {
            switch(payload.eventType) {
                case "INSERT":
                    setCommits([...commits!, payload.new as Commit])
                    break;
                case "DELETE": 
                    setCommits(commits!.filter(commit => commit.id !== payload.old.id))
                    break;
                default: return
            }
        }).subscribe()

        return () => {
            db.removeChannel(channel)
        }

    }, [db, commits, setCommits])

    return (
        <>
            <TooltipProvider>
                <div className="relative flex h-[80vh] flex-col lg:col-span-2 pt-[60px] bg-[#fafafa]">
                    <div className="flex-1 overflow-auto">
                        <div className="relative flex flex-col gap-y-2 px-4 py-16 max-w-2xl mx-auto">
                            {isLoading ? (
                                <div className="absolute h-full flex flex-col justify-center items-center top-[50%] left-[50%] translate-[-50%, -50%]">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span className="mt-1 text-sm">Loading</span>
                                </div>
                            ) : (
                                commits?.map(message => (   
                                    <Commit key={message.id} data={message} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="h-[20vh] p-4 border-t border-gray-100">
                    <form
                        className="relative max-w-2xl mx-auto overflow-hidden rounded-lg border bg-gray-100 focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1"
                    >
                        <Label htmlFor="message" className="sr-only">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="メッセージを入力してください"
                            value={value}
                            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                            onChange={e => setValue(e.target.value)}
                        />
                        <div className="flex items-center p-3 pt-0">
                            <Button type="button" onClick={handleInsert} size="sm" className="ml-auto gap-1.5">
                                送信
                                <CornerDownLeft className="size-3.5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </TooltipProvider>
        </>
    )
}

function Commit({data}: {data: Commit}) {
    const db = createClient()

    const handleDelete = async (id: UUID) => {
        await db.from("commits").delete().eq("id", id)
    }

    return (
        <div>
            <Alert className="bg-gray-200 border-none">
                <AlertTitle className="text-md">{data.message}</AlertTitle>
                <AlertDescription className="text-gray-400"></AlertDescription>
            </Alert>
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">{format(data.created_at, 'yyyy-MM-dd HH:mm')}</span>
                <Button 
                    type="button" 
                    variant="link" 
                    className="text-xs text-gray-400 font-medium"
                    onClick={() => handleDelete(data.id)}
                >
                    削除
                </Button>
            </div>
        </div>
    )
}