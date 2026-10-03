import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationsAsRead } = useApp();
  const [activeTab, setActiveTab] = useState("all");
  const [unreadCount, setUnreadCount] = useState(5);
  const [readItems, setReadItems] = useState({});

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setReadItems({ n1: true, n2: true, n3: true, n4: true });
    if (markNotificationsAsRead) {
      markNotificationsAsRead();
    }
  };

  const notificationItems = [
    {
      id: "n1",
      category: "contribution",
      unread: !readItems["n1"],
      section: "today",
      time: "14 mins ago",
      tag: "CSE Distributed Systems",
      block: "Block #489211",
      icon: "task_alt",
      iconStyle: "bg-secondary-container/30 text-secondary",
      borderStyle: "bg-primary",
      title: (
        <>
          Your answer was accepted by <strong className="text-primary font-semibold">Priya Patel</strong> (CSE, IIT Bombay)
        </>
      ),
      quote: "“Raft consensus split-brain mitigation during uncommitted log replication” — Resolved deadlock using synchronized lease intervals.",
      metaText: "+15 CCS points logged to ledger",
      metaIcon: "verified",
      primaryBtn: "View Answer",
      primaryAction: () => navigate("/questions/q1"),
    },
    {
      id: "n2",
      category: "contribution",
      unread: !readItems["n2"],
      section: "today",
      time: "2 hours ago",
      tag: "Faculty Peer Commendation",
      tagStyle: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
      block: "Signature: Verified Ed25519",
      icon: "workspace_premium",
      iconStyle: "bg-tertiary-container/10 text-on-tertiary-container",
      borderStyle: "bg-primary",
      title: (
        <>
          <strong className="text-primary font-semibold">Prof. A. K. Sharma</strong> (Dept of CSE, IIT Delhi) officially endorsed your answer
        </>
      ),
      subtitle: (
        <>
          Query: <span className="font-medium text-on-surface">“ARMv8 atomic barrier semantics in zero-copy ring buffers”</span>
        </>
      ),
      metaBox: "Citation recorded in IIT Delhi Architecture Archive (Index #AR-409)",
      metaBadge: "+20 pts Faculty Multiplier",
      primaryBtn: "View Citation",
      primaryAction: () => navigate("/profile"),
    },
    {
      id: "n3",
      category: "contribution",
      unread: !readItems["n3"],
      section: "today",
      time: "4 hours ago",
      tag: "Consensus State Sync",
      block: "Anchor Node: NKN-DEL-02",
      icon: "trending_up",
      iconStyle: "bg-primary-container text-on-primary",
      borderStyle: "bg-secondary",
      title: (
        <>
          Your contribution score increased by <span className="text-secondary font-bold">+15</span>
        </>
      ),
      isGridBox: true,
      primaryBtn: "Open Contribution Center",
      primaryAction: () => navigate("/contribution"),
    },
    {
      id: "n4",
      category: "projects",
      unread: !readItems["n4"],
      section: "yesterday",
      time: "Yesterday at 17:42",
      tag: "Project Invitation",
      block: "Consortium Multi-Node",
      icon: "account_tree",
      iconStyle: "bg-primary-fixed text-primary",
      borderStyle: "bg-primary-container",
      title: (
        <>
          <strong className="text-primary font-semibold">Aditya K.</strong> invited you to the <strong className="text-on-surface font-semibold">FloodSense</strong> project
        </>
      ),
      subtitle: (
        <>
          IoT-Edge Hydrological Warning Network • Joint research node collaboration between <span className="font-semibold text-on-surface">IIT Roorkee</span> and <span className="font-semibold text-on-surface">NIT Trichy</span>.
        </>
      ),
      roleBox: "Proposed Role: Lead Firmware / RTOS Contributor",
      isActionRequired: true,
      primaryBtn: "Accept Invitation",
      primaryAction: () => navigate("/projects/prj-8842"),
    },
    {
      id: "n5",
      category: "collaboration",
      unread: false,
      section: "yesterday",
      time: "Yesterday at 11:15",
      tag: "Team Access",
      icon: "groups",
      iconStyle: "bg-surface-container text-on-surface-variant",
      title: "Your collaboration request was accepted",
      subtitle: (
        <>
          You joined the <strong className="text-on-surface font-semibold">ConsensusLab Educational Distributed Systems Lab</strong>. Primary maintainer: <span className="font-medium text-primary">Vikramaditya Rao</span> (IIIT Hyderabad).
        </>
      ),
      primaryBtn: "Go to Repository",
      primaryAction: () => navigate("/projects"),
    },
  ];

  const realNotifications = notifications && notifications.length > 0
    ? notifications.map((n) => ({
        id: n.id,
        category: n.type?.toLowerCase().includes("project") ? "projects" : "contribution",
        unread: !n.isRead && !n.read,
        section: "today",
        time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
        tag: n.type || "Consortium Alert",
        tagStyle: "bg-primary-fixed text-primary",
        icon: n.type?.includes("ACCEPTED") ? "task_alt" : n.type?.includes("PROJECT") ? "account_tree" : "notifications",
        iconStyle: "bg-primary-container text-on-primary",
        borderStyle: "bg-primary",
        title: n.title,
        subtitle: n.message,
        primaryBtn: "View Details",
        primaryAction: () => navigate(n.link || "/dashboard"),
      }))
    : [];

  const combinedItems = [...realNotifications, ...notificationItems];

  const filteredItems = combinedItems.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Sticky Context Header */}
      <div className="w-full bg-surface-container-lowest shadow-sm border-b border-surface-container-high">
        <div className="max-w-[1360px] mx-auto px-space-md lg:px-space-xl py-space-md">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant mb-space-xs tracking-wide">
            <span onClick={() => navigate("/dashboard")} className="hover:text-primary transition-colors cursor-pointer">Academic Network</span>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Activity & Inbox</span>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-primary font-semibold">Notifications</span>
          </nav>

          {/* Main Headline Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-sm">
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Notifications</h1>
                <span className={`px-2 py-0.5 rounded font-label-sm text-label-sm uppercase tracking-wider ${
                  unreadCount > 0 ? "bg-primary-container text-on-primary font-bold" : "bg-surface-container text-on-surface-variant"
                }`}>
                  {unreadCount} Unread
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
                Real-time ledger of academic validations, project invites, peer endorsements, and consortium alerts.
              </p>
            </div>
            {/* Global Action Controls */}
            <div className="flex items-center gap-space-xs flex-wrap">
              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded font-label-md text-label-md transition-colors shadow-sm ${
                  unreadCount === 0 ? "bg-surface-container text-outline cursor-default" : "bg-surface-container-low hover:bg-surface-container text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{unreadCount === 0 ? "check" : "done_all"}</span>
                <span>{unreadCount === 0 ? "All Read" : "Mark all as read"}</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-sm border border-surface-container-high">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Audit Feed Filter</span>
              </button>
            </div>
          </div>

          {/* Secondary Audit Metric Ticker */}
          <div className="mt-space-md pt-space-xs flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low px-space-md py-1.5 rounded border border-surface-container">
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Consensus Node: <strong className="text-on-surface font-semibold">IITD-NKN-08 (Active)</strong>
              </span>
              <span className="hidden sm:inline-block text-outline-variant">/</span>
              <span className="hidden sm:flex items-center gap-1">
                <span>Archival Block:</span>
                <span className="font-mono text-primary font-semibold">#0x7B9E2</span>
              </span>
            </div>
            <div className="flex items-center gap-space-sm">
              <span>142 events logged in Semester I (2024–25)</span>
              <span className="text-outline-variant">•</span>
              <span className="text-secondary font-semibold">Verified Cryptographic Timestamp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Workspace Content */}
      <div className="max-w-[1360px] w-full mx-auto px-space-md lg:px-space-xl py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left 8.5 Cols: Notification Feed */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-surface-container-low p-1 rounded border border-surface-container-high">
              {[
                { id: "all", label: "All Notifications", count: unreadCount },
                { id: "contribution", label: "Contributions", icon: "military_tech" },
                { id: "projects", label: "Projects & Sprints", icon: "folder_special" },
                { id: "collaboration", label: "Collaboration", icon: "handshake" },
                { id: "system", label: "Consortium Ledger", icon: "shield" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded font-label-md text-label-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {tab.icon && <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-primary-container text-on-primary text-[10px]">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Notification Stream Items */}
            <div className="flex flex-col gap-space-sm mt-1">
              <div className="flex items-center justify-between px-space-xs py-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Activity Stream</span>
                  {unreadCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">November 14, 2024</span>
              </div>

              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className={`relative bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow border border-surface-container-high group ${
                    item.unread ? "ring-1 ring-primary/20" : ""
                  }`}
                >
                  {item.unread && <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.borderStyle || "bg-primary"} rounded-l`}></div>}
                  <div className="flex items-start gap-space-md">
                    <div className={`w-9 h-9 shrink-0 rounded flex items-center justify-center ${item.iconStyle}`}>
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-label-md text-label-md px-1.5 py-0.5 rounded ${item.tagStyle || "bg-surface-container-high text-on-primary-fixed-variant"}`}>
                            {item.tag}
                          </span>
                          {item.block && <span className="font-label-sm text-label-sm text-on-surface-variant">{item.block}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">{item.time}</span>
                          {item.unread && <span className="w-2 h-2 rounded-full bg-primary" title="Unread"></span>}
                        </div>
                      </div>

                      <h2 className="font-title-sm text-title-sm text-on-surface leading-snug">
                        {item.title}
                      </h2>

                      {item.subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{item.subtitle}</p>}

                      {item.quote && (
                        <blockquote className="mt-1.5 p-2 rounded bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm border border-surface-container">
                          {item.quote}
                        </blockquote>
                      )}

                      {item.metaBox && (
                        <div className="mt-2 p-2 rounded bg-surface-container-low flex items-center justify-between border border-surface-container">
                          <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface">
                            <span className="material-symbols-outlined text-[16px] text-tertiary">history_edu</span>
                            <span>{item.metaBox}</span>
                          </div>
                          <span className="font-label-sm text-label-sm font-semibold text-secondary">{item.metaBadge}</span>
                        </div>
                      )}

                      {item.isGridBox && (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded bg-surface-container-low border border-surface-container">
                          <div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Total Term Score</div>
                            <div className="font-headline-sm text-headline-sm text-primary leading-none mt-0.5">757 <span className="text-body-sm font-normal text-on-surface-variant">pts</span></div>
                          </div>
                          <div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Percentile Stand</div>
                            <div className="font-headline-sm text-headline-sm text-secondary leading-none mt-0.5">Top 4% <span className="text-body-sm font-normal text-on-surface-variant">cohort</span></div>
                          </div>
                          <div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Verified Ledger Block</div>
                            <div className="font-mono text-body-sm text-on-surface leading-none mt-1">#489102-NKN</div>
                          </div>
                        </div>
                      )}

                      {item.roleBox && (
                        <div className="mt-2 p-2 rounded bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-surface-container">
                          <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface">
                            <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
                            <span>{item.roleBox}</span>
                          </div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Sprint Cycle: Nov 2024 – Jan 2025</span>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="mt-space-sm pt-2 flex flex-wrap items-center justify-between gap-space-sm border-t border-surface-container-low">
                        <div className="flex items-center gap-2 font-label-md text-label-md text-secondary">
                          {item.metaIcon && <span className="material-symbols-outlined text-[16px]">{item.metaIcon}</span>}
                          {item.metaText && <span className="font-semibold">{item.metaText}</span>}
                        </div>
                        <div className="flex items-center gap-space-xs">
                          {item.isActionRequired && (
                            <button onClick={item.primaryAction} className="px-3.5 py-1 rounded bg-secondary text-on-secondary hover:bg-secondary/90 font-label-md text-label-md transition-colors shadow-sm flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              <span>Accept Invitation</span>
                            </button>
                          )}
                          {!item.isActionRequired && item.primaryBtn && (
                            <button onClick={item.primaryAction} className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors border border-surface-container-high">
                              {item.primaryBtn}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="p-space-md text-center bg-surface-container-low rounded text-on-surface-variant font-body-sm text-body-sm mt-2 border border-surface-container">
              <span>Displaying recent ledger events for Fall 2024. For earlier terms, download the </span>
              <a className="text-primary font-semibold hover:underline" href="#csv" onClick={(e) => e.preventDefault()}>Archival Consortium Audit CSV (2021–2024)</a>.
            </div>
          </div>

          {/* Right 4 Cols: Contextual Panel */}
          <aside className="lg:col-span-4 flex flex-col gap-space-md">
            {/* Widget 1: Recent Activity Summary */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-low">
                <h3 className="font-headline-sm text-headline-sm text-primary">Term Metrics</h3>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container/40 text-secondary font-semibold">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-space-sm bg-surface-container-low rounded border border-surface-container">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Answers Resolved</span>
                  <span className="font-headline-md text-headline-md text-primary font-bold">14</span>
                  <span className="font-label-sm text-label-sm text-secondary block mt-0.5">+3 this week</span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded border border-surface-container">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Pending Invites</span>
                  <span className="font-headline-md text-headline-md text-tertiary font-bold">3</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mt-0.5">Action required</span>
                </div>
              </div>
              <div className="mt-space-sm p-space-sm bg-surface-container-low rounded flex items-center justify-between border border-surface-container">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Local Node Uptime</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold">98.4% Availability</span>
                </div>
                <span className="material-symbols-outlined text-[24px] text-secondary">network_check</span>
              </div>
              {/* Weekly Chart */}
              <div className="mt-space-md">
                <div className="flex items-center justify-between mb-1.5 font-label-sm text-label-sm text-on-surface-variant">
                  <span>Weekly Validation Activity</span>
                  <span className="font-semibold text-primary">28 validations</span>
                </div>
                <div className="flex items-end gap-1.5 h-16 pt-2">
                  <div className="flex-1 bg-surface-container rounded-t h-[30%]" title="Mon: 4"></div>
                  <div className="flex-1 bg-surface-container rounded-t h-[55%]" title="Tue: 7"></div>
                  <div className="flex-1 bg-surface-container rounded-t h-[40%]" title="Wed: 5"></div>
                  <div className="flex-1 bg-surface-container rounded-t h-[85%]" title="Thu: 11"></div>
                  <div className="flex-1 bg-primary rounded-t h-[100%]" title="Today: 15 (Peak)"></div>
                  <div className="flex-1 bg-surface-container rounded-t h-[15%]" title="Sat"></div>
                  <div className="flex-1 bg-surface-container rounded-t h-[10%]" title="Sun"></div>
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant font-mono mt-1">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span className="text-primary font-bold">F</span><span>S</span><span>S</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Cryptographic Provenance */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm border border-surface-container-high">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">Cryptographic Provenance</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Every notification regarding score increments, faculty endorsements, and project contributions is an audited cryptographic transaction anchored across the <strong>Indian Higher Education Consortium Node Network</strong>.
              </p>
              <div className="mt-3 p-2.5 rounded bg-surface-container-low font-mono text-[11px] text-on-surface-variant flex flex-col gap-1 border border-surface-container">
                <div className="flex justify-between">
                  <span>Authority:</span>
                  <span className="text-primary font-semibold">IIT Delhi Node #01</span>
                </div>
                <div className="flex justify-between">
                  <span>Consensus:</span>
                  <span>BFT-Raft-Auth (v2.4)</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Re-sync:</span>
                  <span>0.42s ago (Block 489211)</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
