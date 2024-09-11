import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Sidebar() {
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientX < 50) {
                setShowSidebar(true);
            } else {
                setShowSidebar(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div>
            {showSidebar && (
                <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-md">
                    <div className="p-4">x``
                        <h2 className="text-2xl font-semibold">Sidebar</h2>
                        <ul className="mt-4">
                            <li className="py-2">
                                <Link href="/">
                                    <p className="hover:underline cursor-pointer">Home</p>
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href="/events/event_listings">
                                    <p className="hover:underline cursor-pointer">Events</p>
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href="/job-board">
                                    <p className="hover:underline cursor-pointer">Job Board</p>
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href="/account">
                                    <p className="hover:underline cursor-pointer">Account</p>
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href="/benefits">
                                    <p className="hover:underline cursor-pointer">Benefits</p>
                                </Link>
                            </li>
                            <li className="py-2">
                                <Link href="/discounts">
                                    <p className="hover:underline cursor-pointer">Discounts</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}