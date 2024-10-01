
import Card from "../card/card"
import { benefits } from "./data"
import DropDown from "@/components/DropDown/DropDown"

import { Montserrat } from "next/font/google"
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '700'], // Define weights if needed
  })

export default function CardList() {


    return (
        <div className="flex flew-row border border-blue-500 w-full">
            <div className="grid border border-red-500 grid-cols-2 gap-6 w-[62%] p-20">
                {
                    benefits.map( (offer, index)  => {
                        return <Card key={index} {...offer}></Card>
                    })
                }
            </div>
            <div className="flex flex-col flex-grow h-72 border border-purple-600">
                <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>Business Type</p>

                <div className="w-72"><DropDown /></div>


                <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>Distance</p>

            </div>
        </div>
    )
}