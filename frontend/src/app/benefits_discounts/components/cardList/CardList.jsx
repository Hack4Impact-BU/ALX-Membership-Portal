
import Card from "../card/card"
import { benefits } from "./data"

export default function CardList() {


    return (
        <div className="grid grid-cols-2 gap-6 w-[62%] p-20">
            {
                benefits.map( (offer, index)  => {
                    return <Card key={index} {...offer}></Card>
                })
            }
        </div>
    )
}