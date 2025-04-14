import { Inter, Proza_Libre } from 'next/font/google'; // Correctly importing Inter and Proza_Libre
import Link from 'next/link';
const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function TitleCard({header, translation, link}) {

    return (
        <div className="flex flex-col justify-center p-4 w-2/6 h-40 text-[#F6F2E9] mx-15">
            <h1 className="text-[70px] font-custom">{header}</h1>
            <h3 className="text-[30px] italic font-custom">{translation}</h3>
            <Link href={link} className={`text-white hover:underline mt-4 ${prozaLibre.className}`}>See More</Link>
        </div>
    )
}