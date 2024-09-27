import Link from 'next/link'

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

