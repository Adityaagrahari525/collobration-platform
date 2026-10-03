import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useApp } from "../context/AppContext";

export const AppLayout = () => {
  const location = useLocation();
  const { connectionToast, setConnectionToast } = useApp();
  const isMessagesPage = location.pathname.startsWith("/messages");

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Sidebar />
      <Topbar />

      {/* Global Connection / System Toast */}
      {connectionToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl border border-outline-variant/30 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-secondary text-[20px]">
            verified_user
          </span>
          <span className="font-body-md text-sm font-medium">{connectionToast}</span>
          <button
            onClick={() => setConnectionToast(null)}
            className="text-inverse-on-surface/70 hover:text-inverse-on-surface ml-2 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar offset (250px) and Topbar offset (64px) */}
      <div className="pl-[250px] pt-16 min-h-screen bg-surface flex-1 w-full">
        {isMessagesPage ? (
          <main className="w-full h-[calc(100vh-4rem)] overflow-hidden">
            <Outlet />
          </main>
        ) : (
          <main className="w-full px-6 lg:px-10 py-6">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  );
};

