
'use client';
import Link from 'next/link'
import UpcomingEvents from './components/events'
import ProductOffers from './components/offers'
import JobBoard from './components/board'
import GetInvolved from './components/involved'
import Hyperlinks from '@/components/Hyperlinks';

export default function Home() {
    return (
        <div className="w-11/12">
            <UpcomingEvents />
            <ProductOffers />
            <JobBoard />
            <GetInvolved />
            <Hyperlinks />
        </div>
    )
}

