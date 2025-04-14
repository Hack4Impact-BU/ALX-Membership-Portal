'use client';
import { useState, useEffect } from 'react';
import { useAdmin } from '@/middleware/useAdmin';
import Admin from './admin';
import Member from './member';
// import { useAuth } from '@/context/AuthContext'; // Your auth context

export default function JobPostingsPage() {
  // const { user, isAdmin } = useAuth();
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <Admin /> : <Member />;

}