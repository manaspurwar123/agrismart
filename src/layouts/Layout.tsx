import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col selection:bg-green-700 selection:text-white">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
