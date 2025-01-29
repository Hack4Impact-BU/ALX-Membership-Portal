export default function ReusableHeader({ header, translation, isAdmin }) {
    return (
        <div className="flex flex-row items-center justify-between p-20 w-full h-40 text-[#F6F2E9] bg-[#214933]">
            {/* Header text */}
            <div className="flex flex-col">
                <h1 className="text-[70px] font-custom">{header}</h1>
                <h3 className="text-[30px] italic font-custom">{translation}</h3>
            </div>
            
            {/* Button only shown if isAdmin is true */}
            {isAdmin && (
                <button
                    className="bg-[#43e48a] text-[#214933] px-6 py-2 rounded-lg font-semibold hover:bg-[#38c779] transition"
                >
                    Admin Action
                </button>
            )}
        </div>
    );
}
