
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
        <div className="flex flew-row w-full">
            <div className="grid grid-cols-2 gap-6 w-[62%] p-20">
                {
                    benefits.map( (offer, index)  => {
                        return <Card key={index} {...offer}></Card>
                    })
                }
            </div>
            <div className="flex gap-2 flex-col flex-grow h-72 pt-20">
                <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>Business Type</p>

                <div className="w-72"><DropDown font={montserrat} dropTitle={"Select Type"} id={"dropdown1"}/></div>


                <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>Distance</p>

                <div className="w-72"><DropDown font={montserrat} dropTitle={"Select Distance"} id={"dropdown2"}/></div>
            </div>
        </div>
    )
}