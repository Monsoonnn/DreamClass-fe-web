import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/forgot-password';

  return (
    <div className="w-full h-screen overflow-hidden">
      {isLoginPage ? (
        <Outlet />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />

          <div className="flex-1 flex flex-col overflow-hidden bg-blue-50">
            <header className="sticky top-0 z-20 bg-white shadow">
              <Header />
            </header>

            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>

            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}
