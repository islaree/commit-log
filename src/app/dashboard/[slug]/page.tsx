import { Messages } from '@/components/messages'
import { ProductHeader } from '@/components/product-header'

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <div className="relative h-screen">
      <ProductHeader id={params.slug} />
      <Messages productId={params.slug} />
    </div>
  )
}
