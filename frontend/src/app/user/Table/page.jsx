'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { Proza_Libre } from 'next/font/google';
import { useAdmin } from '@/middleware/useAdmin';
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [authToken, setAuthToken] = useState("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { isAdmin, isLoading } = useAdmin();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.post(`${apiBaseUrl}/auth0/token`);
        setAuthToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching Auth0 token:", error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (!authToken) return;

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/users?all=true`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("API Response:", response.data); 

        if (response.data.users) {  
          setUsers(response.data.users);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [authToken]);

  if (isLoading) {
    return <div className="text-white text-center p-6">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      console.log("User is not admin"),
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-white mt-2">You need administrator privileges to view this page.</p>
      </div>
    );
  }
  if (isAdmin) {
    console.log("Admin is logged in");
  }


  return (
    <div className='container mx-auto p-6 ${prozaLibre.className}'>
      <h2 className='text-5xl font-bold text-white mb-4'>Registered Users</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border-b">Email</th>
              <th className="py-3 px-6 text-left border-b">Username</th>
              <th className="py-3 px-6 text-left border-b">Phone Number</th>
              <th className="py-3 px-6 text-left border-b">Date Signed Up</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.username || "N/A"}</td>
                  <td className="py-3 px-6">{user.phone_number || "N/A"}</td>
                  <td className="py-3 px-6">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
