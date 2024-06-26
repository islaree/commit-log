import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <div>404 | Not Found</div>
      <Link href="/dashboard">back to dashboard</Link>
    </div>
  )
}
