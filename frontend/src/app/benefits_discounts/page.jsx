
import ReusableHeader from "@/components/ReusableHeader/ReusableHeader"
import CardList from "./components/cardList/CardList"

export default function BenefitsDiscounts() {

    return (
        <>
        <div className="w-3/4 mt-32">
            <ReusableHeader header={"Product Offers"} translation={"* Ofertas de Productos"}></ReusableHeader>
        </div>
        <CardList />


        </>
    )
}

