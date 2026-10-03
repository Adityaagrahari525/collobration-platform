import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/apiService";

const SCHOLAR_PEERS = [
  {
    id: "acf4e250-fa86-427e-87c3-375879e2598b",
    name: "Rahul Sharma",
    avatar: "RS",
    role: "Lead Edge Architect",
    institution: "IIT Delhi · Node #04",
    email: "rahul.sharma@iitd.ac.in",
    isOnline: true,
  },
  {
    id: "5bd56243-ac60-4b69-8412-5ad8e20862fe",
    name: "Ananya Iyer",
    avatar: "AI",
    role: "M.Tech AI Candidate · CV & Edge",
    institution: "IIT Bombay · Node #02",
    email: "ananya.iyer@iitb.ac.in",
    isOnline: true,
  },
  {
    id: "6f1ed189-5e0d-467b-b683-841d3acad116",
    name: "Prof. Rajesh Sharma",
    avatar: "PS",
    role: ".ac.in Verified Faculty PI · CSE",
    institution: "IIT Delhi · Faculty Node",
    isFaculty: true,
    email: "prof.sharma@cse.iitd.ac.in",
    isOnline: false,
  },
  {
    id: "4a567a2c-87c1-42ba-a16f-b131e99b9b06",
    name: "Rohan Verma",
    avatar: "RV",
    role: "Distributed Systems Researcher",
    institution: "IIIT Hyderabad · Node #07",
    email: "rohan.verma@iiit.ac.in",
    isOnline: true,
  },
];

const INITIAL_ARCHIVE_MESSAGES = [
  {
    id: "m1",
    sender: "Dr. K. Ramanathan",
    avatar: "KR",
    role: "Faculty PI · Hydrology",
    institution: "IIT Madras",
    time: "09:15 AM",
    isFaculty: true,
    content:
      "Good morning team. During the overnight monsoonal simulation run at the Roorkee test flume, the ultrasonic depth readings showed high-frequency jitter during rapid crest surges (>12cm/min rise rate). We need to filter this before transmitting over LoRa to preserve battery life.",
  },
  {
    id: "m2",
    sender: "Aditya Sharma",
    isSelf: true,
    avatar: "AS",
    role: "Lead Edge Architect",
    institution: "IIT Delhi · Node #04",
    time: "09:32 AM",
    content:
      "I've adapted the lightweight 1D Kalman filter in Rust (crates/floodsense-dsp) to dynamically adjust measurement noise covariance R based on surge velocity derivative. It drops redundant transmissions when rate-of-change is below threshold ε = 0.02.",
    codeSnippet: `// 1D Kalman Filter noise covariance tuning
fn update_gain(rate_of_change: f32) -> f32 {
    let r_noise = if rate_of_change > 0.02 { 0.05 } else { 0.85 };
    1.0 / (1.0 + r_noise)
}`,
  },
  {
    id: "m3",
    sender: "Devavrat Saxena",
    avatar: "DS",
    role: "Ph.D. Candidate · Systems",
    institution: "IIT Delhi",
    time: "09:48 AM",
    content:
      "Benchmarked Aditya's PR on the physical test rig (ESP32-S3 + SX1262 LoRa module). Average active CPU awake time dropped from 48ms to 11ms per sample interval, extending simulated battery longevity from 42 days to 118 days on a 2500mAh cell.",
    milestoneRef: "Milestone #3 Verification · FloodSense SX1262 LoRa Telemetry Driver (Merged)",
  },
  {
    id: "m4",
    sender: "Dr. K. Ramanathan",
    avatar: "KR",
    role: "Faculty PI",
    institution: "IIT Madras",
    time: "10:04 AM",
    isFaculty: true,
    content:
      "Excellent work. I have formally signed off on this specification in the consortium provenance ledger. Please merge into main and tag release v0.3.2-alpha so the Roorkee field deployment team can flash the physical test nodes.",
  },
];

export const MessagesPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'direct' | 'projects'
  const [activeChannelType, setActiveChannelType] = useState("project"); // 'project' | 'peer'
  const [activePeer, setActivePeer] = useState(SCHOLAR_PEERS[1]); // Ananya Iyer
  const [activeConversationId, setActiveConversationId] = useState("9c50287f-40c5-45cc-864f-a6056e8cfb49");
  const [conversations, setConversations] = useState([]);
  const [chatMessages, setChatMessages] = useState(INITIAL_ARCHIVE_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSigned, setIsSigned] = useState(true);

  const messagesEndRef = useRef(null);
  const pollTimerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Synchronize conversation messages from backend API
  const loadMessages = useCallback(async (convId) => {
    if (!convId) return;
    try {
      const res = await apiService.getMessages(convId);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((m) => {
          const isMe = m.senderId === currentUser?.id || m.isSelf;
          const initials = m.senderName
            ? m.senderName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
            : "SC";
          return {
            id: m.id,
            sender: isMe ? (currentUser?.name || "You") : m.senderName,
            avatar: initials,
            role: isMe ? "Lead Architect" : "Consortium Scholar",
            institution: isMe ? (currentUser?.institution || "IIT Delhi") : "Partner Node",
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isSelf: isMe,
            content: m.text,
          };
        });
        setChatMessages([...INITIAL_ARCHIVE_MESSAGES, ...mapped]);
      }
    } catch {
      // Keep local chat
    }
  }, [currentUser]);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    try {
      const res = await apiService.getConversations();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setConversations(res.data);
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    loadConversations();
    loadMessages(activeConversationId);

    pollTimerRef.current = setInterval(() => {
      loadMessages(activeConversationId);
    }, 2500);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [activeConversationId, loadConversations, loadMessages]);

  const handleSelectPeer = (peer) => {
    setActiveChannelType("peer");
    setActivePeer(peer);
    const match = conversations.find((c) => c.otherUser?.id === peer.id);
    if (match) {
      setActiveConversationId(match.id);
      loadMessages(match.id);
    }
  };

  const handleSelectProject = (projectId, channelName) => {
    setActiveChannelType("project");
    setActiveConversationId("9c50287f-40c5-45cc-864f-a6056e8cfb49");
    loadMessages("9c50287f-40c5-45cc-864f-a6056e8cfb49");
  };

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const textToSend = inputText.trim();
    setInputText("");
    setIsSending(true);

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const myInitials = currentUser?.name
      ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "ME";

    // Immediate optimistic rendering
    const optimisticMsg = {
      id: `m-opt-${Date.now()}`,
      sender: currentUser?.name || "You",
      isSelf: true,
      avatar: myInitials,
      role: "Lead Node Architect",
      institution: currentUser?.institution || "IIT Delhi · Node #04",
      time: timeStr,
      content: textToSend,
    };
    setChatMessages((prev) => [...prev, optimisticMsg]);

    try {
      let receiverId = activePeer?.id;
      if (!receiverId) {
        receiverId = "5bd56243-ac60-4b69-8412-5ad8e20862fe"; // Ananya Iyer
      }

      const res = await apiService.sendMessage({
        conversationId: activeConversationId || undefined,
        receiverId: activeConversationId ? undefined : receiverId,
        text: textToSend,
      });

      if (res && res.success && res.data) {
        if (res.data.conversationId && res.data.conversationId !== activeConversationId) {
          setActiveConversationId(res.data.conversationId);
        }
        loadMessages(res.data.conversationId || activeConversationId);
      }
    } catch (err) {
      console.error("Message send failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-surface">
      {/* Top Academic Context Header */}
      <header className="shrink-0 h-14 bg-surface-container-lowest border-b border-surface-container-high px-4 lg:px-6 flex items-center justify-between shadow-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-title-sm text-sm font-bold text-primary">Academic Network Mesh</span>
          </div>
          <span className="text-outline/40">|</span>
          <span className="font-body-sm text-xs text-on-surface-variant hidden sm:inline">
            Node: <strong className="text-on-surface font-semibold">{currentUser?.institution || "IIT Delhi"}</strong> ({currentUser?.name || "Aditya Sharma"})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-lg text-xs font-mono text-on-surface-variant border border-surface-container-high">
            <span className="material-symbols-outlined text-[15px] text-secondary">sync</span>
            <span>Real-time Sync Active</span>
          </div>
          <button
            onClick={() => navigate("/projects")}
            className="text-xs font-title-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>All Workspaces</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </header>

      {/* Main Dual-Pane Collaboration Workspace */}
      <div className="flex-1 flex w-full overflow-hidden">
        {/* LEFT PANE: Conversation & Directory Sidebar */}
        <aside className="w-80 lg:w-88 shrink-0 flex flex-col bg-surface-container-lowest border-r border-surface-container-high overflow-hidden select-none">
          {/* Search & Tabs */}
          <div className="p-3 border-b border-surface-container-high space-y-2.5">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholars, teams, channels..."
                className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
              />
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-surface-container-high text-xs font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-1 rounded text-center transition-all ${
                  activeTab === "all" ? "bg-surface-container-lowest text-primary font-bold shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex-1 py-1 rounded text-center transition-all ${
                  activeTab === "projects" ? "bg-surface-container-lowest text-primary font-bold shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("direct")}
                className={`flex-1 py-1 rounded text-center transition-all ${
                  activeTab === "direct" ? "bg-surface-container-lowest text-primary font-bold shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Direct
              </button>
            </div>
          </div>

          {/* Conversation List (Scrollable) */}
          <div className="flex-1 overflow-y-auto divide-y divide-surface-container-low">
            {/* PROJECT CHANNELS */}
            {(activeTab === "all" || activeTab === "projects") && (
              <div className="py-2">
                <div className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-outline flex items-center justify-between">
                  <span>Project Workspaces</span>
                  <span className="px-1.5 py-0.2 bg-primary/10 text-primary rounded text-[10px]">2 Active</span>
                </div>

                <button
                  onClick={() => handleSelectProject("prj-8842", "FloodSense")}
                  className={`w-full text-left p-3 transition-colors flex items-start gap-3 ${
                    activeChannelType === "project" ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-surface-container-low"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    FS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-title-sm text-sm font-semibold text-on-surface truncate">
                        FloodSense: IoT Telemetry
                      </h4>
                      <span className="font-mono text-[11px] text-outline">14m</span>
                    </div>
                    <div className="text-[11px] font-mono text-secondary font-medium">#sprint-1-telemetry</div>
                    <p className="font-body-sm text-xs text-on-surface-variant truncate mt-0.5">
                      Dr. K. Ramanathan: Merged PR #24 LoRaWAN calibration payload...
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectProject("prj-3104", "ConsensusLab")}
                  className="w-full text-left p-3 hover:bg-surface-container-low transition-colors flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs shrink-0">
                    CL
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-title-sm text-sm font-semibold text-on-surface truncate">
                        ConsensusLab: KV-Store
                      </h4>
                      <span className="font-mono text-[11px] text-outline">2h</span>
                    </div>
                    <div className="text-[11px] font-mono text-outline font-medium">#cs302-reproducibility</div>
                    <p className="font-body-sm text-xs text-on-surface-variant truncate mt-0.5">
                      Devavrat: TLA+ specification validated against 3 cluster partitions.
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* DIRECT MESSAGES */}
            {(activeTab === "all" || activeTab === "direct") && (
              <div className="py-2">
                <div className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-outline flex items-center justify-between">
                  <span>Scholars & Faculty</span>
                  <span className="text-[10px] text-emerald-600 font-bold">ONLINE</span>
                </div>

                {SCHOLAR_PEERS.map((peer) => {
                  const isSelected = activeChannelType === "peer" && activePeer?.id === peer.id;
                  return (
                    <button
                      key={peer.id}
                      onClick={() => handleSelectPeer(peer)}
                      className={`w-full text-left px-3 py-2.5 transition-colors flex items-center gap-3 ${
                        isSelected ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-title-sm text-xs font-bold ${
                          peer.isFaculty
                            ? "bg-secondary text-on-secondary"
                            : "bg-primary-container text-on-primary"
                        }`}>
                          {peer.avatar}
                        </div>
                        {peer.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-title-sm text-sm font-semibold text-on-surface truncate">
                            {peer.name}
                          </h4>
                          {peer.isFaculty && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-secondary/10 text-secondary rounded font-semibold font-mono">
                              Faculty
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant truncate">
                          {peer.role} · {peer.institution.split("·")[0]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Status Footer */}
          <div className="p-3 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between text-xs font-mono text-outline">
            <span className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>Encrypted P2P NKN</span>
            </span>
            <span>Block #482,109</span>
          </div>
        </aside>

        {/* RIGHT PANE: Chat Stream & Message Composer */}
        <main className="flex-1 flex flex-col min-w-0 bg-surface overflow-hidden">
          {/* Active Conversation Header */}
          <header className="shrink-0 h-16 bg-surface-container-lowest border-b border-surface-container-high px-4 lg:px-6 flex items-center justify-between shadow-xs">
            {activeChannelType === "project" ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  FS
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-title-md text-base text-on-surface font-bold truncate">
                      FloodSense — Sensor Telemetry &amp; Dynamic Calibration
                    </h2>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary-container text-on-secondary-container font-mono">
                      Sprint Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                    <span>#sprint-1-telemetry</span>
                    <span>•</span>
                    <span>IIT Roorkee, IIT Delhi, NIT Trichy</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {activePeer?.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-title-md text-base text-on-surface font-bold truncate">
                      {activePeer?.name}
                    </h2>
                    <span className="inline-flex items-center gap-0.5 text-secondary">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">
                    {activePeer?.role} · {activePeer?.institution}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {activeChannelType === "project" ? (
                <button
                  onClick={() => navigate("/projects/prj-8842")}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-title-sm text-xs font-semibold flex items-center gap-1.5 transition-colors border border-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[16px]">folder_open</span>
                  <span className="hidden sm:inline">Workspace</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/people/${activePeer?.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-title-sm text-xs font-semibold flex items-center gap-1.5 transition-colors border border-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span className="hidden sm:inline">View Profile</span>
                </button>
              )}
            </div>
          </header>

          {/* Chat Stream (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-5 space-y-4">
            {/* Timestamp Divider */}
            <div className="flex items-center justify-center my-2">
              <div className="px-3 py-1 bg-surface-container rounded-full text-xs font-mono text-on-surface-variant border border-surface-container-high shadow-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                <span>November 14, 2024 · Consensus Block #482,044</span>
              </div>
            </div>

            {/* Message Cards */}
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${msg.isSelf ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                    msg.isSelf
                      ? "bg-primary text-on-primary"
                      : msg.isFaculty
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-highest text-primary"
                  }`}
                >
                  {msg.avatar}
                </div>

                <div
                  className={`rounded-2xl p-4 shadow-xs border text-sm space-y-2 ${
                    msg.isSelf
                      ? "bg-primary/5 border-primary/20 text-on-surface rounded-tr-xs"
                      : "bg-surface-container-lowest border-surface-container-high text-on-surface rounded-tl-xs"
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-on-surface">{msg.sender}</span>
                    {msg.isFaculty && (
                      <span className="px-1.5 py-0.2 bg-secondary/10 text-secondary font-mono rounded font-semibold text-[10px]">
                        Faculty PI
                      </span>
                    )}
                    <span className="text-outline text-[11px] font-mono">{msg.time}</span>
                  </div>

                  {/* Message Content */}
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Optional Code Snippet */}
                  {msg.codeSnippet && (
                    <div className="mt-2 bg-[#0f172a] text-[#f8fafc] rounded-xl p-3 font-mono text-xs overflow-x-auto border border-slate-800">
                      <pre>{msg.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Optional Milestone Box */}
                  {msg.milestoneRef && (
                    <div className="mt-2 p-2.5 rounded-lg bg-secondary/10 border border-secondary/20 text-xs font-mono text-secondary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span className="font-medium">{msg.milestoneRef}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer (Bottom Bar) */}
          <footer className="shrink-0 bg-surface-container-lowest border-t border-surface-container-high p-3 lg:p-4 shadow-lg space-y-2.5">
            {/* Quick Attachment Shortcuts */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
              <button
                type="button"
                onClick={() => setInputText((prev) => `${prev} [Attachment: Paper DOI] `)}
                className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center gap-1 transition-colors border border-surface-container-high whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[14px]">attach_file</span>
                <span>Attach Paper</span>
              </button>
              <button
                type="button"
                onClick={() => setInputText((prev) => `${prev} /PRJ-8842 `)}
                className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center gap-1 transition-colors border border-surface-container-high whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[14px]">link</span>
                <span>Link PRJ</span>
              </button>
              <button
                type="button"
                onClick={() => setInputText((prev) => `${prev} \`\`\`rust\n// code\n\`\`\` `)}
                className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center gap-1 transition-colors border border-surface-container-high whitespace-nowrap font-mono"
              >
                <span>&lt;/&gt; Code</span>
              </button>
              <button
                type="button"
                onClick={() => setInputText((prev) => `${prev} $$\\sum_{i=1}^n x_i$$ `)}
                className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center gap-1 transition-colors border border-surface-container-high whitespace-nowrap font-serif italic"
              >
                <span>LaTeX</span>
              </button>
            </div>

            {/* Input Box */}
            <div className="relative flex items-end gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder={
                  activeChannelType === "project"
                    ? "Write a message to #sprint-1-telemetry... (Press Enter to send)"
                    : `Send a direct scholarly message to ${activePeer?.name}...`
                }
                className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all resize-none border border-surface-container-high"
              />

              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isSending}
                className="h-10 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-title-sm text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer active:scale-95"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>

            {/* Composer Footer Options */}
            <div className="flex items-center justify-between text-xs text-outline pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-on-surface transition-colors select-none">
                <input
                  type="checkbox"
                  checked={isSigned}
                  onChange={(e) => setIsSigned(e.target.checked)}
                  className="rounded text-primary accent-primary"
                />
                <span>Cryptographically Sign Record (NKN Hardware Token)</span>
              </label>

              <span className="hidden sm:inline font-mono text-[11px]">
                Shift + Enter for new line
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;
