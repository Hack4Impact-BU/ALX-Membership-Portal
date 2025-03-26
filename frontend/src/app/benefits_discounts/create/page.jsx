'use client';
import React, { useState } from 'react';

export default function CreateOffer() {
    const [offer, setOffer] = useState({
        businessType: '',
        endDate: '',
        instruct: '',
        offerDesc: '',
        offerTitle: '',
        pic: null,
        place: '',
        startDate: ''
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setOffer({
            ...offer,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setOffer({
            ...offer,
            pic: e.target.files[0],
        });
    };

      // Define the API base URL from environment variables
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        
        // Add all text fields to the form data
        Object.keys(offer).forEach(key => {
            if (key !== 'pic' && offer[key]) {
                formData.append(`product_offer[${key}]`, offer[key]);
            }
        });
        
        // Only append file if it exists
        if (offer.pic) {
            formData.append('product_offer[pic]', offer.pic);
        }

        try {
            const response = await fetch(`${apiBaseUrl}/product_offers`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create offer');
            }

            const result = await response.json();
            setMessage('Offer created successfully!');
            setError(null);
        } catch (error) {
            console.error('Error creating offer:', error);
            setError('Failed to create offer. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Create an Offer</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                {/* Offer Title */}
                <div className="mb-4">
                    <label htmlFor="offerTitle" className="block text-gray-700 font-bold mb-2">Offer Title</label>
                    <input
                        type="text"
                        name="offerTitle"
                        id="offerTitle"
                        value={offer.offerTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>

                {/* Business Type */}
                <div className="mb-4">
                    <label htmlFor="businessType" className="block text-gray-700 font-bold mb-2">Business Type</label>
                    <input
                        type="text"
                        name="businessType"
                        id="businessType"
                        value={offer.businessType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>

                {/* Start Date */}
                <div className="mb-4">
                    <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={offer.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>

                {/* End Date */}
                <div className="mb-4">
                    <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={offer.endDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Place */}
                <div className="mb-4">
                    <label htmlFor="place" className="block text-gray-700 font-bold mb-2">Place</label>
                    <input
                        type="text"
                        name="place"
                        id="place"
                        value={offer.place}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>

                {/* Offer Description */}
                <div className="mb-4">
                    <label htmlFor="offerDesc" className="block text-gray-700 font-bold mb-2">Offer Description</label>
                    <textarea
                        name="offerDesc"
                        id="offerDesc"
                        value={offer.offerDesc}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>

                {/* Instructions */}
                <div className="mb-4">
                    <label htmlFor="instruct" className="block text-gray-700 font-bold mb-2">Instructions</label>
                    <textarea
                        name="instruct"
                        id="instruct"
                        value={offer.instruct}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>

                {/* Offer Image */}
                <div className="mb-4">
                    <label htmlFor="pic" className="block font-medium text-gray-700">
                        Image (Optional)
                    </label>
                    <input
                        type="file"
                        id="pic"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 p-2 border rounded-md w-full"
                    />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">Create Offer</button>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}