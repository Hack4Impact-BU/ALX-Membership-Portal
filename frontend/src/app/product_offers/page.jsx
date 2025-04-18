'use client'

import ReusableHeader from "@/components/ReusableHeader/ReusableHeader"
import CardList from "./components/cardList/CardList"
import Hyperlinks from "@/components/Hyperlinks"
import { useAdmin } from "@/middleware/useAdmin";


export default function BenefitsDiscounts() {

    const { isAdmin, isLoading } = useAdmin();


    console.log(isAdmin);

    return (
        <section className="w-full flex h-full flex-col items-center">
            <div className="w-11/12 mt-20 mb-[-5rem]">
                <ReusableHeader header={"Product Offers"} translation={"* Ofertas de Productos"} isAdmin={isAdmin} directTo={"/benefits_discounts/create"}/>
            </div>
            <CardList isAdmin={isAdmin} />
            <div className="w-10/12"><Hyperlinks /></div>

        </section>
    )
}