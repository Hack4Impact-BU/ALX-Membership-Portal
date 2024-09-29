
import ReusableHeader from "@/components/ReusableHeader/ReusableHeader"
import Card from "./components/card/card"

export default function BenefitsDiscounts() {

    return (
        <>
        <div className="w-3/4 mt-32">
            <ReusableHeader header={"Product Offers"} translation={"* Ofertas de Productos"}></ReusableHeader>
        </div>

        <Card offer={"20% off whatever the heck  you want"}
              location={"Museum of Fine Arts"}
              date={"9/10 — 9/25"}/>
        </>
    )
}

