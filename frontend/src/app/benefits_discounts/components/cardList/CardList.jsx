'use client'

import { useState, useEffect } from "react"
import Card from "../card/card"
import { benefits } from "./data"
import DropDown from "@/components/DropDown/DropDown"

import { Montserrat } from "next/font/google"
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '700'], // Define weights if needed
  })



export default function CardList() {

    const [renderSaved, setRenderSaved] = useState(false)

    const handleSaved = () => {
        setRenderSaved(!renderSaved);
    }


    return (
        <div className="flex flex-col w-full">

            <div className="flex w-40 h-40 ml-20 rounded-md bg-slate-600 hover:cursor-pointer" onClick={handleSaved}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={renderSaved ? 'black' : 'none'} viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                <p>saved</p>
            </div>

            <div className="flex flew-row w-full">
                
    
                <div className="grid grid-cols-2 gap-6 w-[62%] p-20">
                    {
                        (renderSaved ? benefits.filter(offer => offer.saved) : benefits).map( (offer, index)  => {
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
        </div>
    )
}