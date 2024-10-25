import Image from 'next/image'
import { Metadata } from 'next'
import Table from '@/components/Table'
import { Suspense } from 'react'
import { AbsenceType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Home',
}

const URL = 'https://front-end-kata.brighthr.workers.dev/api/absences'

const getData = async () => {
  const absences = await fetch(URL)
  const data = await absences.json()
  return data
}

export default async function Home() {
  const absences: AbsenceType[] = await getData()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Table data={absences} />
      </main>
    </div>
  )
}
