"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function LayoutContent({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isAuthPage = pathname === "/" || pathname === "/login";

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar isOpen={sidebarOpen} />

      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        }`}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}