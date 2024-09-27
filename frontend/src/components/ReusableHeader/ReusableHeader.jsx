

export default function ReusableHeader({header, translation}) {

    return (
        <div className="flex flex-col justify-center p-20 w-full h-40 border border-dashed border-white text-[#F6F2E9]">
            <h1 className="text-[70px] font-custom">{header}</h1>
            <h3 className="text-[30px] font-custom">{translation}</h3>
        </div>
    )
}