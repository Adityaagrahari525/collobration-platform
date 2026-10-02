import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Sidebar />
      <Topbar />
      {/* Sidebar offset (250px) and Topbar offset (64px) */}
      <div className="pl-[250px] pt-16 min-h-screen bg-surface flex-1 w-full">
        <main className="w-full px-6 lg:px-10 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

