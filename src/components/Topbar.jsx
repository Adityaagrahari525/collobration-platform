import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const Topbar = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    notifications,
    markNotificationRead,
    logout,
    questions,
    projects,
    users,
    communities,
  } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [textSize, setTextSize] = useState(() => localStorage.getItem("campuslink_text_size") || "comfortable");

  useEffect(() => {
    document.body.classList.remove("font-comfortable", "font-large");
    if (textSize === "comfortable") {
      document.body.classList.add("font-comfortable");
    } else if (textSize === "large") {
      document.body.classList.add("font-large");
    }
    localStorage.setItem("campuslink_text_size", textSize);
  }, [textSize]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter search results
  const filteredQuestions = searchTerm
    ? questions.filter(
        (q) =>
          q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const filteredProjects = searchTerm
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.skillsRequired.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const filteredUsers = searchTerm
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const filteredCommunities = searchTerm
    ? communities.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const hasResults =
    filteredQuestions.length > 0 ||
    filteredProjects.length > 0 ||
    filteredUsers.length > 0 ||
    filteredCommunities.length > 0;

  return (
    <header className="fixed top-0 left-[250px] right-0 h-16 bg-surface-container-lowest z-40 px-space-lg flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-low">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl pr-space-md relative">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            className="w-full h-10 pl-10 pr-20 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container/20 transition-all"
            placeholder="Search questions, projects, people or skills..."
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
          />
          <div className="absolute right-2.5 flex items-center">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-label-sm font-label-sm text-on-surface-variant bg-surface-container-lowest rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] font-mono">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchOpen && searchTerm && (
          <div className="absolute top-12 left-0 right-0 max-h-[480px] overflow-y-auto bg-surface-container-lowest border border-surface-container-high rounded-xl shadow-xl z-50 p-space-sm space-y-space-md">
            {!hasResults ? (
              <div className="p-4 text-center text-on-surface-variant font-body-sm">
                No matching questions, projects, scholars, or communities found.
              </div>
            ) : (
              <>
                {/* Questions */}
                {filteredQuestions.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-label-sm font-semibold uppercase text-primary font-mono">
                      Questions ({filteredQuestions.length})
                    </div>
                    {filteredQuestions.slice(0, 3).map((q) => (
                      <div
                        key={q.id}
                        onClick={() => {
                          navigate(`/questions/${q.id}`);
                          setSearchOpen(false);
                          setSearchTerm("");
                        }}
                        className="p-2 hover:bg-surface-container-low rounded-lg cursor-pointer flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">quiz</span>
                        <div className="truncate text-body-sm text-on-surface font-medium">{q.title}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {filteredProjects.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-label-sm font-semibold uppercase text-secondary font-mono">
                      Projects ({filteredProjects.length})
                    </div>
                    {filteredProjects.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          navigate(`/projects/${p.id}`);
                          setSearchOpen(false);
                          setSearchTerm("");
                        }}
                        className="p-2 hover:bg-surface-container-low rounded-lg cursor-pointer flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px] text-secondary">menu_book</span>
                        <div className="truncate text-body-sm text-on-surface font-medium">{p.title}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* People */}
                {filteredUsers.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-label-sm font-semibold uppercase text-on-surface-variant font-mono">
                      Scholars & Faculty ({filteredUsers.length})
                    </div>
                    {filteredUsers.slice(0, 3).map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          navigate(`/people/${u.id}`);
                          setSearchOpen(false);
                          setSearchTerm("");
                        }}
                        className="p-2 hover:bg-surface-container-low rounded-lg cursor-pointer flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                        <div className="truncate text-body-sm text-on-surface font-medium">
                          {u.name} <span className="text-outline">({u.institution})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md">
        {/* Readability & Text Size Toggle Controls */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-surface-container-low rounded-lg border border-surface-container">
          <button
            title="Standard Text Size"
            onClick={() => setTextSize("standard")}
            className={`px-2 py-1 rounded font-title-sm text-[12px] font-semibold transition-colors ${
              textSize === "standard"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            A
          </button>
          <button
            title="Comfortable Readable Text (Recommended)"
            onClick={() => setTextSize("comfortable")}
            className={`px-2 py-1 rounded font-title-sm text-[13px] font-semibold transition-colors ${
              textSize === "comfortable"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            A+
          </button>
          <button
            title="Large Text Mode"
            onClick={() => setTextSize("large")}
            className={`px-2 py-1 rounded font-title-sm text-[14px] font-bold transition-colors ${
              textSize === "large"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            A++
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-space-sm py-1 rounded bg-secondary-container/30 text-on-secondary-container font-label-sm text-label-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>IIT-D Node · Operational</span>
        </div>

        <div className="h-5 w-px bg-surface-container-high hidden md:block"></div>

        {/* Notifications & Messages */}
        <div className="flex items-center gap-space-xs relative">
          {/* Notification Button */}
          <button
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error rounded-full font-label-sm text-[10px] leading-none flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Modal Dropdown */}
          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 sm:w-96 bg-surface-container-lowest border border-surface-container-high rounded-xl shadow-2xl z-50 p-space-sm">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high mb-2">
                <span className="font-title-sm text-title-sm text-primary font-semibold">Notifications</span>
                <span className="text-label-sm text-secondary font-mono font-medium">{unreadCount} unread</span>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-outline text-body-sm">No notifications yet.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                        n.read ? "bg-surface-container-lowest opacity-75" : "bg-surface-container-low"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-title-sm text-body-sm font-semibold text-on-surface">{n.title}</span>
                        <span className="text-label-sm text-outline text-[11px]">{n.timestamp}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-surface-container-high mt-2 text-center">
                <button
                  onClick={() => {
                    navigate("/notifications");
                    setShowNotifications(false);
                  }}
                  className="text-label-sm text-primary hover:underline font-semibold"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}

          {/* Messages Quick Button */}
          <button
            aria-label="Messages"
            onClick={() => navigate("/messages")}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">chat_bubble</span>
          </button>
        </div>

        <div className="h-5 w-px bg-surface-container-high"></div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-space-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold overflow-hidden ring-2 ring-primary-container/20">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute top-12 right-0 w-64 bg-surface-container-lowest border border-surface-container-high rounded-xl shadow-2xl z-50 p-space-sm space-y-2">
              <div className="p-2 bg-surface-container-low rounded-lg">
                <div className="font-title-sm text-title-sm text-on-surface font-semibold">{currentUser?.name}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">{currentUser?.institution}</div>
                <div className="font-label-sm text-label-sm text-secondary font-mono mt-1">
                  Score: {currentUser?.contributionScore || 1420} pts
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container-high text-body-sm font-medium text-on-surface flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container-high text-body-sm font-medium text-on-surface flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </button>
                <div className="h-px bg-surface-container-high"></div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-error-container text-error text-body-sm font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
