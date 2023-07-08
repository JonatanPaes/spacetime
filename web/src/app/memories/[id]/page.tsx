import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { api } from '@/lib/api'

import Cookie from 'js-cookie'

import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import Link from 'next/link'
import { ChevronLeft, Trash } from 'lucide-react'

dayjs.locale(ptBr)

type MemoryProps = {
  id: string
  coverUrl: string
  content: string
  createdAt: string
}

type ResponseDataProps = {
  id: string | undefined
  token: string | undefined
}

async function getData({ id, token }: ResponseDataProps) {
  const response = await api.get(`/memories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export default async function MemoryDetails() {
  const { id } = useParams()
  const router = useRouter()
  const token = Cookie.get('token')

  const memory: MemoryProps = await getData({ id, token })

  async function deleteMemory() {
    await api.delete(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    router.push('/')
  }

  return (
    <div className="flex h-screen flex-col gap-[5vh] overflow-y-auto px-8 py-12">
      <div className="flex justify-between">
        <Link
          href="/"
          className="-ml-1 flex items-center gap-1 text-sm text-gray-200 transition-colors hover:text-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar à timeline
        </Link>

        <button
          className="flex items-center gap-1 rounded-full bg-red-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-600"
          onClick={deleteMemory}
        >
          <Trash size={20} />
          Excluir
        </button>
      </div>

      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
        {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
      </time>

      <div>
        <Image
          src={memory.coverUrl}
          alt="Memory cover image"
          width={592}
          height={280}
          className="aspect-video w-full rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="mb- text-lg leading-relaxed text-gray-100">
          {memory.content}
        </p>
      </div>
    </div>
  )
}
