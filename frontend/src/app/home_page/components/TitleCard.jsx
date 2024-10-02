
export default function TitleCard({header, translation, link}) {

    return (
        <div className="flex flex-col justify-center p-4 w-2/6 h-40 text-[#F6F2E9] mx-15">
            <h1 className="text-[70px] font-custom">{header}</h1>
            <h3 className="text-[30px] italic font-custom">{translation}</h3>
            <a href="#" className="text-white hover:underline mt-4">See More</a>
        </div>
    )
}