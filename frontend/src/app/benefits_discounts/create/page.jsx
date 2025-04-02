'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for potential redirect
import { Proza_Libre } from 'next/font/google';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Styled Button from event_listings page
const CustomButton = styled(Button)({
  backgroundColor: '#44E489',
  borderRadius: '20px',
  padding: '8px 24px',
  minWidth: '60px',
  height: '40px',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#3acc7a',
    boxShadow: 'none',
    transform: 'scale(1.05)',
  },
  '& .MuiButton-label, & p': {
    color: 'black',
    fontWeight: '600',
  },
});

// InputField component from event_listings page
const InputField = ({ label, id, required, ...props }) => (
  <div className="mb-4 w-full">
    <label htmlFor={id} className={`block text-[#214933] ${prozaLibre.className} font-semibold mb-1`}>
        {label}{required && '*'}
    </label>
    <input
      id={id}
      {...props}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white"
    />
  </div>
);

// TextAreaField component from event_listings page
const TextAreaField = ({ label, id, required, ...props }) => (
  <div className="mb-4 w-full">
    <label htmlFor={id} className={`block text-[#214933] ${prozaLibre.className} font-semibold mb-1`}>
        {label}{required && '*'}
    </label>
    <textarea
      id={id}
      {...props}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white"
      rows="3"
    />
  </div>
);

// FileInputField component from event_listings page
const FileInputField = ({ label, id, ...props }) => (
  <div className="mb-4 w-full">
    <label htmlFor={id} className={`block text-[#214933] ${prozaLibre.className} font-semibold mb-1`}>{label}</label>
    <input
      id={id}
      type="file"
      {...props}
      className="w-full text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e0f2e8] file:text-[#214933] hover:file:bg-[#c1e0cf]"
    />
  </div>
);


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
    const [picPreview, setPicPreview] = useState(null); // For offer image preview
    const router = useRouter(); // Get the router instance

    const handleChange = (e) => {
        setOffer({
            ...offer,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setOffer({
            ...offer,
            pic: file,
        });
         // Generate preview
        if (file) {
            setPicPreview(URL.createObjectURL(file));
        } else {
            setPicPreview(null);
        }
    };

      // Define the API base URL from environment variables
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const formData = new FormData();

        // Append fields matching the backend expectations (product_offer[key])
        formData.append('product_offer[offerTitle]', offer.offerTitle);
        formData.append('product_offer[businessType]', offer.businessType);
        formData.append('product_offer[startDate]', offer.startDate);
        formData.append('product_offer[place]', offer.place);
        formData.append('product_offer[offerDesc]', offer.offerDesc);
        formData.append('product_offer[instruct]', offer.instruct);

        // Optional fields
        if (offer.endDate) {
            formData.append('product_offer[endDate]', offer.endDate);
        }
        if (offer.pic) {
            formData.append('product_offer[pic]', offer.pic);
        }

        // Basic validation
        if (!offer.offerTitle || !offer.businessType || !offer.startDate || !offer.place || !offer.offerDesc || !offer.instruct) {
            setError("Please fill in all required fields.");
            return;
        }


        try {
            const response = await fetch(`${apiBaseUrl}/product_offers`, {
                method: 'POST',
                body: formData,
                 // No 'Content-Type' header needed for FormData; browser sets it with boundary
                 // Add Authorization header if needed:
                 // headers: { 'Authorization': `Bearer ${your_token}` }
            });

            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
                 throw new Error(errorData.message || 'Failed to create offer');
            }

            const result = await response.json();
            setMessage('Offer created successfully!');
            setError(null);
            // Reset form
            setOffer({
                businessType: '', endDate: '', instruct: '', offerDesc: '',
                offerTitle: '', pic: null, place: '', startDate: ''
            });
            setPicPreview(null);

            // Optional: Redirect after delay
            // setTimeout(() => {
            //    router.push('/benefits_discounts'); // Adjust redirect path if needed
            // }, 1500);

        } catch (err) {
            console.error('Error creating offer:', err);
            setError(`Error creating offer: ${err.message}`);
        }
    };

    // Structure adapted from event_listings create page
    return (
        <div className="flex flex-col w-full min-h-screen p-14 bg-[#your_background_color]"> {/* Adjust background color if needed */}
            <h1 className={`text-4xl font-bold text-[#F6F2E9] mb-8 text-center ${prozaLibre.className}`}>Create New Offer</h1>

            {message && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-lg">
                {message}
                </div>
            )}
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col w-full">
                {/* Top Section: Image and Key Details */}
                <div className="flex flex-col md:flex-row gap-8 w-full mb-8">
                    {/* Left Side: Offer Image Upload */}
                    <div className="flex flex-col justify-start items-center basis-full md:basis-1/2 h-auto min-h-[300px] bg-[#F6F2E9] rounded-xl p-6">
                        <h2 className={`text-2xl text-[#214933] font-semibold mb-4 ${prozaLibre.className}`}>Offer Image</h2>
                        <FileInputField
                            label="Upload Offer Image (Optional)"
                            id="pic"
                            name="pic"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        {picPreview && (
                        <div className="mt-4 w-full max-h-64 overflow-hidden rounded-lg border border-gray-300">
                            <img src={picPreview} alt="Offer Preview" className="object-contain w-full h-full" />
                        </div>
                        )}
                        {!picPreview && (
                            <div className="mt-4 w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300">
                                <span className="text-gray-500">Image Preview</span>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Dates, Place, Business Type */}
                    <div className="flex flex-col justify-start items-start basis-full md:basis-1/2 h-auto bg-[#F6F2E9] rounded-xl p-6">
                        <h2 className={`text-2xl text-[#214933] font-semibold mb-4 ${prozaLibre.className}`}>Key Details</h2>
                        <InputField
                            label="Start Date"
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={offer.startDate}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="End Date"
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={offer.endDate}
                            onChange={handleChange}
                            // Not required in original form
                        />
                        <InputField
                            label="Place / Location"
                            type="text"
                            id="place"
                            name="place"
                            value={offer.place}
                            onChange={handleChange}
                            placeholder="e.g., Online, Store Address"
                            required
                        />
                         <InputField
                            label="Business Type"
                            type="text"
                            id="businessType"
                            name="businessType"
                            value={offer.businessType}
                            onChange={handleChange}
                            placeholder="e.g., Restaurant, Retail, Service"
                            required
                        />
                    </div>
                </div>

                {/* Bottom Section: Offer Info */}
                <div className='flex flex-col w-full h-auto bg-[#F6F2E9] rounded-xl p-6'>
                    <h2 className={`text-2xl text-[#214933] font-semibold mb-4 ${prozaLibre.className}`}>Offer Information</h2>

                    <InputField
                        label="Offer Title"
                        type="text"
                        id="offerTitle"
                        name="offerTitle"
                        value={offer.offerTitle}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white text-3xl mb-4" // Larger text for title
                    />

                    <TextAreaField
                        label="Offer Description"
                        id="offerDesc"
                        name="offerDesc"
                        value={offer.offerDesc}
                        onChange={handleChange}
                        required
                    />

                    <TextAreaField
                        label="Instructions / How to Redeem"
                        id="instruct"
                        name="instruct"
                        value={offer.instruct}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Show membership card, Use code ONLINE10"
                    />

                    <div className="mt-8 flex justify-center">
                        <CustomButton type="submit" variant="contained">
                            <p>Create Offer</p>
                        </CustomButton>
                    </div>
                </div>
            </form>
        </div>
    );
}