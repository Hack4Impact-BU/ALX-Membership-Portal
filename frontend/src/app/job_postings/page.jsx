'use client';
import { useState, useEffect } from 'react';
import JobBoardAdmin from './JobBoardAdmin';
import JobBoardMember from './JobBoardMember';
// import { useAuth } from '@/context/AuthContext'; // Your auth context

export default function JobPostingsPage() {
  // const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Any authentication checks
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* {<JobBoardAdmin />} */}
      {<JobBoardMember />}
    </>
  );
}