import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <>
      <h1>this is login page!</h1>
      <Button asChild>
        <Link href="/dashboard">login</Link>
      </Button>
    </>
  )
}
