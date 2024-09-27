/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Optional: Configure environment variables
    // env: {
    //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    //   // Add other environment variables as needed
    // },
  
    // If you are using images, configure the allowed domains
    images: {
      domains: ['your-backend-domain.com', 'other-allowed-domains.com'],
    },
  
    // Optional: Define redirects if needed
    async redirects() {
      return [
        {
          source: '/old-route',
          destination: '/new-route',
          permanent: true,
        },
        // Add more redirects as needed
      ];
    },
  };
  
export default nextConfig;
