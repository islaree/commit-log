import Link from 'next/link'
import { Suspense } from 'react'

import { Account } from '@/components/account'
import { DeleteProduct, CreateProduct } from '@/components/form-products'
import { getProducts } from '@/db/products'
import { getUser } from '@/db/user'

export default async function Dashboard() {
  const user = await getUser()

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Suspense>
          <Account user={user} />
        </Suspense>
      </div>
      <CreateProduct id={user?.id ?? ''} />
      <div className="mt-6 flex flex-col gap-y-4">
        <Suspense>
          <Products userId={user?.id ?? ''} />
        </Suspense>
      </div>
    </div>
  )
}

async function Products({ userId }: { userId: string }) {
  const products = await getProducts(userId)

  return (
    <>
      {products?.map((product) => (
        <div key={product.id}>
          <div className="font-medium">
            <Link href={`/dashboard/${product.id}`}>{product.name}</Link>
          </div>
          <DeleteProduct id={product.id} />
        </div>
      ))}
    </>
  )
}
