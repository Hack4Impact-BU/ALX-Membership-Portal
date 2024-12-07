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
    const [renderSaved, setRenderSaved] = useState(false);
    const [cards, setCards] = useState([]);
    const [selectedBusinessType, setSelectedBusinessType] = useState(null);
    const [selectedDistance, setSelectedDistance] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/discounts"); // Replace with your endpoint
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setCards(data); // Update state with fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const filteredCards = cards.filter(card => {
        return (!selectedBusinessType || card.type === selectedBusinessType) &&
               (!selectedDistance || card.distance <= selectedDistance);
    });

    const handleSaved = () => {
        setRenderSaved(!renderSaved);
    };

    const toggleCardSaved = async (index, id, currentSaved) => {
        try {
            // Send PUT or PATCH request to update `is_saved` on the backend
            const response = await fetch(`http://localhost:3001/discounts/${id}`, {
                method: "PUT", // or PATCH
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_saved: !currentSaved }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update saved status");
            }
    
            // Update the local state if the backend update was successful
            const updatedCards = [...cards];
            updatedCards[index].is_saved = !updatedCards[index].is_saved;
            setCards(updatedCards);
        } catch (error) {
            console.error("Error updating saved status:", error);
        }
    };


    const businessType = ["Museums", "Cafes", "Gym", "Fashion"];
    const distance = [5, 10, 15, 20, 25, 30];

    return (
        <div className="flex flex-col justify-center min-h-screen bg-[#214933] text-white">
            {/* Main Content */}
            <div className="flex flex-row gap-10">
                {/* Cards Grid */}
                <div className="grid grid-cols-2 gap-6 p-10 w-[52rem]">
                    {(renderSaved ? filteredCards.filter(offer => offer.is_saved) : filteredCards).map((offer, index) => (
                        <Card key={index} {...offer} index={index} toggleCardSaved={toggleCardSaved}></Card>
                    ))}
                </div>

                {/* Filters Section */}
                <div className="flex flex-col gap-6 p-6">
                    {/* Business Type Filter */}
                    <div>
                        <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>Business Type</p>
                        <div className="w-72">
                            <DropDown
                                font={montserrat}
                                dropTitle={"Select Type"}
                                dropDown={businessType}
                                id={"dropdown1"}
                                selectedValue={selectedBusinessType}
                                setSelectedValue={setSelectedBusinessType}
                            />
                        </div>
                    </div>

                    {/* Distance Filter */}
                    <div>
                        <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>Distance</p>
                        <div className="w-72">
                            <DropDown
                                font={montserrat}
                                dropTitle={"Select Distance"}
                                dropDown={distance}
                                id={"dropdown2"}
                                selectedValue={selectedDistance}
                                setSelectedValue={setSelectedDistance}
                            />
                        </div>
                    </div>

                    {/* Saved Button */}
                    <div className="flex flex-row w-[130px] h-[60px] mt-4 rounded-md gap-4 bg-[#F6F2E9] hover:cursor-pointer justify-center items-center" onClick={handleSaved}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={renderSaved ? '#214933' : 'none'} viewBox="0 0 24 24" stroke-width="2" stroke="#214933" className="size-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                        <p className={`text-[#214933] text-base ${montserrat.className}`}>Saved</p>
                    </div>
                </div>
            </div>
        </div>
    );
}