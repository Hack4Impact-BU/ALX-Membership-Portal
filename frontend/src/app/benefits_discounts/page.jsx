
import ReusableHeader from "@/components/ReusableHeader/ReusableHeader"
import CardList from "./components/cardList/CardList"
import Hyperlinks from "@/components/Hyperlinks"

export default function BenefitsDiscounts() {

    return (
        <section className="w-full flex h-full flex-col items-center">
            <div className="w-11/12 mt-20">
                <ReusableHeader header={"Product Offers"} translation={"* Ofertas de Productos"} isAdmin={true} directTo={"/benefits_discounts/create"}/>
            </div>
            <CardList />
            <Hyperlinks />

        </section>
    )
}