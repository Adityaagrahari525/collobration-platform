import React from "react";
import { NavLink } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  HelpCircle,
  FolderGit2,
  Users,
  MessageSquare,
  Bookmark,
  Trophy,
  BarChart3,
  Settings,
  BookOpen,
  BadgeCheck,
  MessagesSquare,
  Network
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Sidebar = () => {
  const { currentUser } = useApp();

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-3 py-2 rounded-lg transition-all font-body-md text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
      isActive
        ? "bg-primary-container text-on-primary font-semibold shadow-xs"
        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[250px] bg-surface-container-lowest flex flex-col z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container-low">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between bg-surface-container-lowest border-b border-surface-container-low shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shrink-0 shadow-xs">
            <GraduationCap className="w-5 h-5 text-on-primary" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[18px] font-bold text-primary tracking-tight leading-snug">CampusLink</span>
            <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider leading-tight">Academic Consortium</span>
          </div>
        </div>
        <BadgeCheck className="w-4 h-4 text-secondary shrink-0" title="Verified Academic Consortium Node" />
      </div>

      {/* Mesh Status */}
      <div className="px-4 py-2.5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-surface-container-high">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant tracking-wide font-medium uppercase truncate">
            NKN Mesh · Active
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {/* ACADEMIC DIRECTORY */}
        <div className="space-y-1">
          <div className="px-3 py-1">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Academic Directory
            </span>
          </div>
          <nav className="space-y-0.5">
            <NavLink to="/dashboard" className={getNavLinkClass}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </NavLink>
            <NavLink to="/questions" className={getNavLinkClass}>
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" />
                <span>Questions</span>
              </div>
            </NavLink>
            <NavLink to="/projects" className={getNavLinkClass}>
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4" />
                <span>Projects</span>
              </div>
            </NavLink>
            <NavLink to="/people" className={getNavLinkClass}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Peers &amp; Mentors</span>
              </div>
            </NavLink>
            <NavLink to="/communities" className={getNavLinkClass}>
              <div className="flex items-center gap-2.5">
                <MessagesSquare className="w-4 h-4" />
                <span>Communities</span>
              </div>
            </NavLink>
          </nav>
        </div>

        {/* MY WORKSPACE */}
        <div className="space-y-1">
          <div className="px-3 py-1">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              My Workspace
            </span>
          </div>
          <nav className="space-y-0.5">
            <NavLink
              to="/profile?tab=solutions"
              className={({ isActive }) =>
                `${getNavLinkClass({ isActive: false })} ${
                  window.location.pathname === "/profile" && window.location.search.includes("tab=solutions")
                    ? "bg-surface-container text-primary font-semibold border-l-2 border-primary"
                    : ""
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" />
                <span>My Q&amp;A</span>
              </div>
            </NavLink>
            <NavLink
              to="/profile?tab=saved"
              className={({ isActive }) =>
                `${getNavLinkClass({ isActive: false })} ${
                  window.location.pathname === "/profile" && window.location.search.includes("tab=saved")
                    ? "bg-surface-container text-primary font-semibold border-l-2 border-primary"
                    : ""
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4" />
                <span>Saved References</span>
              </div>
            </NavLink>
            <NavLink to="/mentorship" className={getNavLinkClass}>
              <div className="flex items-center gap-2.5">
                <Network className="w-4 h-4" />
                <span>Collaboration Teams</span>
              </div>
            </NavLink>
            <NavLink to="/messages" className={getNavLinkClass}>
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>}
                </>
              )}
            </NavLink>
            <NavLink to="/recognition" className={getNavLinkClass}>
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4" />
                <span>Recognition</span>
              </div>
            </NavLink>
            <NavLink to="/contribution" className={getNavLinkClass}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>My Contribution</span>
              </div>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 space-y-2 bg-surface-container-lowest border-t border-surface-container-low shrink-0">
        <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-primary">
              IIT Delhi Node
            </span>
            <BadgeCheck className="w-3.5 h-3.5 text-secondary" title="Authenticated via .ac.in" />
          </div>
          <p className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">
            Authenticated via .ac.in credentials
          </p>
        </div>

        <nav className="space-y-0.5">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-body-sm text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                isActive
                  ? "bg-primary-container text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Institutional Settings</span>
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors font-body-sm text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                isActive
                  ? "bg-primary-container text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            <span>Scholarly Guidelines</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};


