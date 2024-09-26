import Link from 'next/link'
import ProductOffers from './components/offers'
import GetInvolved from './components/involved'
import JobBoard from '../job_postings/page'
import UpcomingEvents from './components/events'

export default function Home() {
    return (
        <div>
            <UpcomingEvents />
            <ProductOffers />
            <JobBoard />
            <GetInvolved />
        </div>
    )
}

