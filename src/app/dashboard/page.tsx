import { Suspense } from 'react'

import { Account } from '@/components/account'
import { getProducts } from '@/db/products'
import { getUser } from '@/db/user'
import { Products } from '@/components/products'
import { ProductCreateForm } from '@/components/form'
import { Input } from '@/components/ui/input'

export default async function Dashboard() {
  const user = await getUser()

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Suspense>
          <Account user={user} />
        </Suspense>
      </div>
      <div className="mt-6 flex flex-col gap-y-4">
        <ProductCreateForm userId={user?.id ?? ''} />
        <Suspense>
          <ProductsWrapper userId={user?.id ?? ''} />
        </Suspense>
      </div>
    </div>
  )
}

async function ProductsWrapper({ userId }: { userId: string }) {
  const products = await getProducts(userId)

  return <Products data={products ?? []} />
}
