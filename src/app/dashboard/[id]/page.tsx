import Link from 'next/link'
import { Suspense } from 'react'

import { UUID } from 'crypto'
import { ChevronLeft, Ellipsis } from 'lucide-react'

import { Form } from '@/components/form-post'
import { getPosts } from '@/db/posts'
import { getProduct } from '@/db/products'

export default function ProductPage({ params: { id } }: { params: { id: UUID } }) {
  return (
    <>
      <ProductHeader id={id} />
      <div className="px-4">
        <Form id={id} />
      </div>
      <Suspense>
        <ServerPosts id={id} />
      </Suspense>
    </>
  )
}

async function ServerPosts({ id }: { id: UUID }) {
  const posts = await getPosts(id)

  return (
    <>
      {posts?.map((post) => (
        <div key={post.id} className="text-sm">
          <span className="text-muted-foreground">{post.created_at}</span>
          {post.message}
        </div>
      ))}
    </>
  )
}

async function ProductHeader({ id }: { id: UUID }) {
  const product = await getProduct(id)

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <Link href="/dashboard">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <Ellipsis />
        </div>
      </div>
      <div className="my-4 px-4 text-lg font-semibold">{product.name}</div>
    </>
  )
}
