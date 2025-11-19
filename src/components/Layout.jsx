import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <Header />
        <main className="">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
