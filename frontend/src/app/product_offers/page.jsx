
import ReusableHeader from "@/components/ReusableHeader/ReusableHeader"
import CardList from "./components/cardList/CardList"
import Hyperlinks from "@/components/Hyperlinks"

export default function BenefitsDiscounts() {

    return (
        <section className="w-full flex h-full flex-col items-center">
            <div className="w-11/12 mt-20 mb-[-5rem]">
                <ReusableHeader header={"Product Offers"} translation={"* Ofertas de Productos"} isAdmin={true} directTo={"/product_offers/create"}/>
            </div>
            <CardList />
            <div className="w-10/12"><Hyperlinks /></div>

        </section>
    )
}