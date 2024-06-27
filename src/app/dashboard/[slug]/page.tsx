import { Messages } from '@/components/messages'
import { Product } from '@/components/product'

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="mb-6 mt-4 px-4">
        <Product id={params.slug} />
      </div>
      <Messages />
    </>
  )
}
