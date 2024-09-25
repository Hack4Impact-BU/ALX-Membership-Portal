
import styles from "./style.module.css"

export default function ReusableHeader({header, translation}) {

    return (
        <div>
            <h1>{header}</h1>
            <h3>{translation}</h3>
        </div>
    )
}