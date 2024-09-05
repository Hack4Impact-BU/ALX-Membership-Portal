'use client'

import { useQuery } from '@tanstack/react-query'
import apiRouter from '@/api/router'
import Link from 'next/link'

export default function Home() {

  const { data } = useQuery({ 
    queryKey: ['getUsers'],
    queryFn: apiRouter.users.getUsers,
  })

  return (
    <main className="flex min-h-screen flex-col gap-4 items-center p-24">
      <Link href="/login">Click here to login</Link>
    </main>
  );
}
