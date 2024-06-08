'use client'

import { useState } from 'react'

export default function Page({ params }: { params: { slug: string } }) {
  const [value, setValue] = useState('')

  return (
    <div className="mx-auto flex h-screen max-w-[800px] flex-col justify-between overflow-scroll py-10">
      <div>
        <div className="mb-10">
          <h1 className="mb-6 text-4xl font-extrabold">{params.slug}</h1>
          <p className="text-lg text-gray-800">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem totam fugit odio, cum
            deleniti provident laboriosam similique nostrum magni perferendis, soluta maiores
            cumque. Amet voluptatum obcaecati recusandae, quod sint voluptatibus!
          </p>
        </div>
        <div className="flex flex-col gap-y-8 overflow-scroll">
          <div className="rounded bg-gray-100 p-6">
            <div className="mb-2 text-sm text-gray-500">2024-10-19 19:56</div>
            <div className="text-sm text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium repellendus
              consequatur voluptatibus quis. Obcaecati praesentium exercitationem unde aliquid alias
              aspernatur nam sapiente, consectetur, quibusdam quam aliquam porro aut! Adipisci.
            </div>
          </div>
          <div className="rounded bg-gray-100 p-6">
            <div className="mb-2 text-sm text-gray-500">2024-10-19 19:56</div>
            <div className="text-sm text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium repellendus
              consequatur voluptatibus quis. Obcaecati praesentium exercitationem unde aliquid alias
              aspernatur nam sapiente, consectetur, quibusdam quam aliquam porro aut! Adipisci.
            </div>
          </div>
          <div className="rounded bg-gray-100 p-6">
            <div className="mb-2 text-sm text-gray-500">2024-10-19 19:56</div>
            <div className="text-sm text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium repellendus
              consequatur voluptatibus quis. Obcaecati praesentium exercitationem unde aliquid alias
              aspernatur nam sapiente, consectetur, quibusdam quam aliquam porro aut! Adipisci.
            </div>
          </div>
          <div className="rounded bg-gray-100 p-6">
            <div className="mb-2 text-sm text-gray-500">2024-10-19 19:56</div>
            <div className="text-sm text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium repellendus
              consequatur voluptatibus quis. Obcaecati praesentium exercitationem unde aliquid alias
              aspernatur nam sapiente, consectetur, quibusdam quam aliquam porro aut! Adipisci.
            </div>
          </div>
          <div className="rounded bg-gray-100 p-6">
            <div className="mb-2 text-sm text-gray-500">2024-10-19 19:56</div>
            <div className="text-sm text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium repellendus
              consequatur voluptatibus quis. Obcaecati praesentium exercitationem unde aliquid alias
              aspernatur nam sapiente, consectetur, quibusdam quam aliquam porro aut! Adipisci.
            </div>
          </div>
          <div className="rounded bg-gray-100 p-6">
            <div className="mb-2 text-sm text-gray-500">2024-10-19 19:56</div>
            <div className="text-sm text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem accusantium repellendus
              consequatur voluptatibus quis. Obcaecati praesentium exercitationem unde aliquid alias
              aspernatur nam sapiente, consectetur, quibusdam quam aliquam porro aut! Adipisci.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <textarea
            value={value}
            className="w-full rounded border border-gray-200 bg-gray-50 p-4"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button className="rounded bg-black p-2 text-sm text-white">submit</button>
      </div>
    </div>
  )
}
