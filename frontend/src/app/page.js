'use client'
import Link from 'next/link'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col gap-4 items-center p-24">
      <Link href="/user/login">Click here to login</Link>
    </main>
  );
}
