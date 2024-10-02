import Link from 'next/link'
import UpcomingEvents from './components/events'
import ProductOffers from './components/offers'
import JobBoard from './components/board'
import GetInvolved from './components/involved'

export default function Home() {
    return (
        <div className="w-10/12">
            <UpcomingEvents />
            <ProductOffers />
            <JobBoard />
            <GetInvolved />
        </div>
    )
}

