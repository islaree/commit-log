import Link from 'next/link'

export const Navigation = () => {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400"></div>
        <div>user_nameさん</div>
      </div>
      <button>logout</button>
      <div className="px-2 py-4">
        <div className="mb-4">
          <Link href="/dashboard" className="flex p-2 hover:bg-gray-200">
            home
          </Link>
        </div>
        <div className="mb-2 text-sm text-gray-600">Projects</div>
        <div>
          <Link href="/dashboard/a" className="flex p-2 hover:bg-gray-200">
            a
          </Link>
        </div>
        <div>
          <Link href="/dashboard/b" className="flex p-2 hover:bg-gray-200">
            b
          </Link>
        </div>
        <div>
          <Link href="/dashboard/c" className="flex p-2 hover:bg-gray-200">
            c
          </Link>
        </div>
      </div>
    </div>
  )
}
