"use client"

import { CircleCheckBig, CircleOff } from "lucide-react"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

export const ProductHeader = ({id}: {id: string}) => {
    const db = createClient()

    const [product, setProduct] = useState<any>(null)

    const handleComplete = async () => {
        await db.from("products").upsert({
            ...product,
            completed: !product.completed
        }).eq("id", id)
    }

    useEffect(() => {
        const getData = async () => {
            const { data } = await db.from("products")
            .select()
            .eq("id", id)
            .single()
            setProduct(data)
        }

        getData()
    }, [db])

    useEffect(() => {
        const channel = db.channel("realtime product").on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "products"
        },
        (payload) => {
            switch(payload.eventType) {
                case "UPDATE":
                    setProduct(payload.new)
                    break;
                default: return
            }
        }).subscribe()

        return () => {
            db.removeChannel(channel)
        }

    }, [db, product, setProduct])

    return (
        <div className="absolute top-0 left-0 h-16 w-full flex justify-between items-center z-10 bg-white px-4 border-b border-gray-100">
            <div className="font-bold">{product?.name}</div>
            <Button variant="ghost" onClick={handleComplete}>
                {product?.completed ? (
                    <div className="text-gray-400 flex items-center gap-x-2">
                        <CircleOff className="w-4 h-4" />
                        <span className="font-semibold">未完了にする</span>
                    </div>
                ) : (
                    <div className="text-emerald-500 flex items-center gap-x-2">
                        <CircleCheckBig className="w-4 h-4" />
                        <span className="font-semibold">完了にする</span>
                    </div>
                )}
            </Button>
        </div>
    )
}