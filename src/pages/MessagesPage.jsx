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
  },
  {
    id: "5bd56243-ac60-4b69-8412-5ad8e20862fe",
    name: "Ananya Iyer",
    avatar: "AI",
    role: "M.Tech AI Candidate · CV & Edge",
    institution: "IIT Bombay · Node #02",
    email: "ananya.iyer@iitb.ac.in",
  },
  {
    id: "6f1ed189-5e0d-467b-b683-841d3acad116",
    name: "Prof. Rajesh Sharma",
    avatar: "PS",
    role: ".ac.in Verified Faculty PI · CSE",
    institution: "IIT Delhi · Faculty Node",
    isFaculty: true,
    email: "prof.sharma@cse.iitd.ac.in",
  },
  {
    id: "4a567a2c-87c1-42ba-a16f-b131e99b9b06",
    name: "Rohan Verma",
    avatar: "RV",
    role: "Distributed Systems Researcher",
    institution: "IIIT Hyderabad · Node #07",
    email: "rohan.verma@iiit.ac.in",
  },
];

const INITIAL_ARCHIVE_MESSAGES = [
  {
    id: "m1",
    sender: "Dr. K. Ramanathan",
    avatar: "KR",
    role: ".ac.in Verified Faculty PI · Hydrology Dept",
    institution: "IIT Madras",
    time: "09:15 AM",
    signature: "0x3E1B...87A49",
    isFaculty: true,
    content: "Good morning team. During the overnight monsoonal simulation run at the Roorkee test flume, the ultrasonic depth readings showed high-frequency jitter during rapid crest surges (>12cm/min rise rate). We need to filter this before transmitting over LoRa to preserve battery life and payload efficiency.",
    hasQuestionRef: true,
  },
  {
    id: "m2",
    sender: "Aditya Sharma",
    isSelf: true,
    avatar: "AS",
    role: "Lead Edge Architect",
    institution: "IIT Delhi · Node #04 · 4th Year B.Tech",
    time: "09:32 AM",
    signature: "Signed via Hardware Token",
    content: "I've adapted the lightweight 1D Kalman filter implementation in Rust (crates/floodsense-dsp) to dynamically adjust measurement noise covariance R based on the surge velocity derivative. It drops redundant transmissions when rate-of-change is below threshold ε = 0.02:",
    codeSnippet: true,
  },
  {
    id: "m3",
    sender: "Devavrat Saxena",
    avatar: "DS",
    role: "Ph.D. Candidate · Distributed Systems Lab",
    institution: "IIT Delhi",
    time: "09:48 AM",
    signature: "Node Verified",
    content: "Benchmarked Aditya's PR on the physical hardware test rig (ESP32-S3 + SX1262 LoRa module). Average active CPU awake time dropped from 48ms to 11ms per sample interval, extending simulated battery longevity from 42 days to 118 days on a standard 2500mAh LiFePO4 cell.",
    milestoneRef: true,
  },
  {
    id: "m4",
    sender: "Dr. K. Ramanathan",
    avatar: "KR",
    role: "Faculty PI",
    institution: "IIT Madras",
    time: "10:04 AM",
    signature: "0x3E1B...87A49",
    isFaculty: true,
    content: "Excellent work. I have formally signed off on this specification in the consortium provenance ledger. Please merge into main and tag release v0.3.2-alpha so the Roorkee field deployment team can flash the physical test nodes.",
  }
];

export const MessagesPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [inputText, setInputText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState("9c50287f-40c5-45cc-864f-a6056e8cfb49");
  const [activePeer, setActivePeer] = useState(SCHOLAR_PEERS[1]); // default to Ananya
  const [chatMessages, setChatMessages] = useState(INITIAL_ARCHIVE_MESSAGES);
  const [livePulse, setLivePulse] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const pollTimerRef = useRef(null);

  // Synchronize conversation messages from backend / Supabase
  const loadMessages = useCallback(async (convId) => {
    if (!convId) return;
    try {
      const res = await apiService.getMessages(convId);
      if (res && res.success && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          const mapped = res.data.map((m) => {
            const isMe = m.senderId === currentUser?.id || m.isSelf;
            const initials = m.senderName
              ? m.senderName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
              : "SC";
            return {
              id: m.id,
              sender: isMe ? (currentUser?.name || m.senderName) : m.senderName,
              avatar: initials,
              role: isMe ? "Authenticated Scholar" : "Consortium Peer",
              institution: isMe ? (currentUser?.institution || "IIT Delhi") : "Partner Node",
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              signature: "PostgreSQL Persisted · Key Signed",
              isSelf: isMe,
              content: m.text,
            };
          });
          // Merge archive with live database messages
          setChatMessages([...INITIAL_ARCHIVE_MESSAGES, ...mapped]);
        }
      }
    } catch {
      // In offline or fallback mode, keep current messages
    }
  }, [currentUser]);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    try {
      const res = await apiService.getConversations();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setConversations(res.data);
        if (!activeConversationId && res.data[0]) {
          setActiveConversationId(res.data[0].id);
        }
      }
    } catch {
      // Fallback
    }
  }, [activeConversationId]);

  // Initial mount & real-time 2-second polling for multi-device sync
  useEffect(() => {
    loadConversations();
    loadMessages(activeConversationId);

    // Poll every 2 seconds so Device 2 immediately receives Device 1's messages
    pollTimerRef.current = setInterval(() => {
      loadMessages(activeConversationId);
      setLivePulse((prev) => !prev);
    }, 2000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [activeConversationId, loadConversations, loadMessages]);

  const handleSelectPeer = (peer) => {
    setActivePeer(peer);
    // Find if a conversation already exists with this peer
    const match = conversations.find((c) => c.otherUser?.id === peer.id);
    if (match) {
      setActiveConversationId(match.id);
      loadMessages(match.id);
    }
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

    // Immediate optimistic local message rendering
    const optimisticMsg = {
      id: `m-opt-${Date.now()}`,
      sender: currentUser?.name || "You",
      isSelf: true,
      avatar: myInitials,
      role: "Lead Node Architect",
      institution: currentUser?.institution || "IIT Delhi · Node #04",
      time: timeStr,
      signature: "Key Signed (Consensus Verified)",
      content: textToSend,
    };
    setChatMessages((prev) => [...prev, optimisticMsg]);

    try {
      // Determine recipient ID if conversation doesn't exist
      let receiverId = activePeer?.id;
      if (!receiverId) {
        receiverId = currentUser?.email?.includes("ananya")
          ? "acf4e250-fa86-427e-87c3-375879e2598b" // send to Rahul
          : "5bd56243-ac60-4b69-8412-5ad8e20862fe"; // send to Ananya
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
        // Immediately refresh database sync
        loadMessages(res.data.conversationId || activeConversationId);
      }
    } catch (err) {
      console.error("Message send failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Academic Context Ribbon */}
      <div className="bg-surface-container-lowest border-b border-surface-container px-space-lg py-2.5 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-secondary/10 text-secondary font-label-md text-label-md uppercase tracking-wider font-semibold">
            <span className={`w-2 h-2 rounded-full transition-opacity duration-500 ${livePulse ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-green-600"}`}></span>
            Live Multi-Device Mesh Active
          </span>
          <span className="text-outline-variant">•</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Current Node: <strong className="text-on-surface font-title-sm">{currentUser?.name || "Rahul Sharma"}</strong> ({currentUser?.institution || "IIT Delhi"} · Role: {currentUser?.role || "STUDENT"})
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">sync</span>
            <span>Real-time Polling:</span>
            <code className="font-mono bg-surface-container-high px-1.5 py-0.5 rounded text-primary text-xs">2.0s Interval · PostgreSQL</code>
          </div>
          <span className="text-outline-variant">|</span>
          <div className="flex items-center gap-1 text-primary text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px]">devices</span>
            <span>2 Devices Connected</span>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Collaboration Workspace (Height calculated to fit app shell) */}
      <div className="flex w-full h-[calc(100vh-6.25rem)] overflow-hidden bg-surface">
        {/* LEFT PANEL: Conversations & Channel Directory */}
        <aside className="w-80 lg:w-[340px] flex-shrink-0 flex flex-col bg-surface-container-lowest border-r border-surface-container select-none">
          {/* Directory Header */}
          <div className="p-space-md border-b border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Discourse & Threads</h1>
                <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-primary-container text-on-primary font-mono leading-none">2 NEW</span>
              </div>
              <button className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary flex items-center justify-center transition-colors" title="Compose New Thread or Inquiry">
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
            {/* Search & Filter bar */}
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-outline absolute left-2.5 text-[18px]">search</span>
              <input className="w-full bg-surface-container-low pl-8 pr-8 py-1.5 rounded font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors" placeholder="Search conversations, scholars, PRJs..." type="text"/>
              <button className="absolute right-2 text-outline hover:text-on-surface" title="Advanced Filters">
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </button>
            </div>
          </div>

          {/* Scrollable Channel / Thread Directory */}
          <div className="flex-1 overflow-y-auto divide-y divide-surface-container-low">
            {/* SECTION A: Active Projects */}
            <div className="py-2">
              <div className="px-space-md py-1.5 flex items-center justify-between text-outline">
                <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">folder_managed</span>
                  <span>Project Workspaces (2 unread)</span>
                </div>
                <span className="font-mono text-label-sm">3</span>
              </div>
              <nav className="flex flex-col mt-0.5">
                {/* Active Selected Thread */}
                <a className="relative flex flex-col gap-1 px-space-md py-3 bg-surface-container border-l-4 border-primary-container hover:bg-surface-container transition-colors text-left" href="#thread">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-label-sm text-secondary font-semibold bg-secondary/10 px-1 py-0.2 rounded">PRJ-8842</span>
                      <span className="font-title-sm text-title-sm text-on-surface truncate font-semibold">FloodSense: IoT Telemetry</span>
                    </div>
                    <span className="font-body-sm text-[11px] text-outline flex-shrink-0 font-mono">14m</span>
                  </div>
                  <div className="font-label-sm text-label-sm text-outline-variant font-mono">#sprint-1-telemetry</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                    <strong className="text-on-surface font-medium">Dr. K. Ramanathan:</strong> Merged PR #24 LoRaWAN calibration payload schema...
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-secondary-container text-on-secondary-container">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 5 Active
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold bg-primary text-on-primary rounded-full">2</span>
                  </div>
                </a>
                {/* Other Projects */}
                <a className="flex flex-col gap-1 px-space-md py-3 hover:bg-surface-container-low transition-colors text-left" href="#proj2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-label-sm text-outline bg-surface-container px-1 py-0.2 rounded">PRJ-3104</span>
                      <span className="font-title-sm text-title-sm text-on-surface truncate">ConsensusLab: KV-Store</span>
                    </div>
                    <span className="font-body-sm text-[11px] text-outline flex-shrink-0 font-mono">2h</span>
                  </div>
                  <div className="font-label-sm text-label-sm text-outline font-mono">#cs302-reproducibility</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    <span className="font-medium">Devavrat:</span> TLA+ specification validated against 32-node crash partition test...
                  </p>
                </a>
              </nav>
            </div>

            {/* SECTION B: Research Groups */}
            <div className="py-2">
              <div className="px-space-md py-1.5 flex items-center justify-between text-outline">
                <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">diversity_3</span>
                  <span>Research Working Groups</span>
                </div>
                <span className="font-mono text-label-sm">2</span>
              </div>
              <nav className="flex flex-col mt-0.5">
                <a className="flex flex-col gap-1 px-space-md py-2.5 hover:bg-surface-container-low transition-colors text-left" href="#sig">
                  <div className="flex items-center justify-between">
                    <span className="font-title-sm text-title-sm text-on-surface truncate">Byzantine Fault Tolerance SIG</span>
                    <span className="font-body-sm text-[11px] text-outline font-mono">4h</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Draft working paper submitted to SERB review board for validation.
                  </p>
                </a>
              </nav>
            </div>

            {/* SECTION C: Mentorship Sessions */}
            <div className="py-2">
              <div className="px-space-md py-1.5 flex items-center justify-between text-outline">
                <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">school</span>
                  <span>Mentorship Sessions</span>
                </div>
              </div>
              <nav className="flex flex-col mt-0.5">
                <a className="flex flex-col gap-1 px-space-md py-2.5 hover:bg-surface-container-low transition-colors text-left" href="#mentor">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-title-sm text-title-sm text-on-surface truncate">Prof. R. Ramanathan</span>
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                    </div>
                    <span className="font-body-sm text-[11px] text-outline font-mono">3h</span>
                  </div>
                  <div className="font-label-sm text-[11px] text-secondary font-medium">IIT Madras • Advisory PI</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    "Reviewed your formal proof draft. See annotated feedback PDF."
                  </p>
                </a>
              </nav>
            </div>

            {/* SECTION D: Direct Messages (Live Peer Network) */}
            <div className="py-2">
              <div className="px-space-md py-1.5 flex items-center justify-between text-outline">
                <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">chat</span>
                  <span>Scholarly Direct Messages</span>
                </div>
                <span className="font-mono text-[10px] text-green-600 font-bold">ONLINE</span>
              </div>
              <nav className="flex flex-col mt-0.5">
                {SCHOLAR_PEERS.map((peer) => {
                  const isSelected = activePeer?.id === peer.id;
                  const isSelf = currentUser?.id === peer.id || currentUser?.email === peer.email;
                  return (
                    <button
                      key={peer.id}
                      onClick={() => handleSelectPeer(peer)}
                      className={`w-full flex items-center gap-2.5 px-space-md py-2.5 transition-colors text-left border-l-2 ${
                        isSelected
                          ? "bg-surface-container border-primary font-semibold"
                          : "hover:bg-surface-container-low border-transparent"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-title-sm text-[11px] font-bold ${
                          peer.isFaculty
                            ? "bg-secondary text-on-secondary"
                            : isSelected
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high text-on-surface"
                        }`}>
                          {peer.avatar}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 ring-2 ring-surface-container-lowest"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-title-sm text-title-sm text-on-surface truncate">
                            {peer.name} {isSelf && <span className="text-primary text-[10px]">(You)</span>}
                          </span>
                          <span className="font-body-sm text-[10px] text-outline font-mono">Live</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate text-[11px]">
                          {peer.role} · {peer.institution.split("·")[0]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Left Panel Bottom Quick Node Sync Status */}
          <div className="p-3 bg-surface-container-low border-t border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary">cloud_done</span>
              <span className="font-label-sm text-label-sm text-on-surface">P2P Provenance Ledger Synced</span>
            </div>
            <span className="font-mono text-[10px] text-outline">Block #482,109</span>
          </div>
        </aside>

        {/* RIGHT PANEL: Active Collaboration Workspace */}
        <main className="flex-1 flex flex-col min-w-0 bg-surface">
          {/* Workspace Contextual Header */}
          <header className="bg-surface-container-lowest border-b border-surface-container px-space-lg py-3 flex flex-col gap-2.5 shadow-sm">
            {/* Breadcrumbs & Meta Controls */}
            <div className="flex items-center justify-between">
              <nav className="flex items-center gap-1.5 font-label-md text-label-md text-outline">
                <span onClick={() => navigate("/dashboard")} className="hover:text-on-surface cursor-pointer transition-colors">Academic Network</span>
                <span>/</span>
                <span onClick={() => navigate("/projects")} className="hover:text-on-surface cursor-pointer transition-colors">Projects</span>
                <span>/</span>
                <span onClick={() => navigate("/projects/prj-8842")} className="text-primary-container font-medium hover:underline flex items-center gap-1 cursor-pointer">
                  <span>FloodSense (PRJ-8842)</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </span>
                <span>/</span>
                <span className="text-on-surface font-semibold font-mono">#sprint-1-telemetry</span>
              </nav>
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high font-label-md text-label-md text-on-surface flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <span>Find in Thread</span>
                  <kbd className="font-mono text-[10px] bg-surface-container-lowest px-1 rounded text-outline">Ctrl+F</kbd>
                </button>
                <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high font-label-md text-label-md text-on-surface flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-secondary">push_pin</span>
                  <span>Artifacts (4)</span>
                </button>
                <button onClick={() => navigate("/projects/prj-8842")} className="px-3 py-1 rounded bg-primary-container text-on-primary font-title-sm text-title-sm hover:opacity-95 transition-opacity flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">speed</span>
                  <span>Sprint Overview</span>
                </button>
              </div>
            </div>
            {/* Project Title, Scope, & Verified Participating Nodes */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">FloodSense — Sensor Telemetry & Dynamic Calibration</h2>
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold uppercase tracking-wider">
                    Sprint Active · 65% Target
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="font-mono font-medium text-primary">Consortium Nodes:</span>
                  <span className="px-2 py-0.2 rounded bg-surface-container-high font-mono text-[11px] text-on-surface font-semibold">IIT Roorkee (Hydrology Node)</span>
                  <span className="px-2 py-0.2 rounded bg-surface-container-high font-mono text-[11px] text-on-surface font-semibold">IIT Delhi (Edge Computing Lab)</span>
                  <span className="px-2 py-0.2 rounded bg-surface-container-high font-mono text-[11px] text-on-surface font-semibold">NIT Trichy (Wireless Sensor Hub)</span>
                </div>
              </div>
              {/* Roster Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-title-sm text-[11px] ring-2 ring-surface-container-lowest" title="Dr. K. Ramanathan (PI)">KR</div>
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-title-sm text-[11px] ring-2 ring-surface-container-lowest" title="Devavrat Saxena (Ph.D.)">DS</div>
                  <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-title-sm text-[11px] ring-2 ring-surface-container-lowest font-bold" title="Aditya Sharma (You)">AS</div>
                  <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-title-sm text-[11px] ring-2 ring-surface-container-lowest" title="Ananya Sen">AS</div>
                  <div className="w-7 h-7 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center font-title-sm text-[11px] ring-2 ring-surface-container-lowest" title="Kabir Sen">KS</div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">5 Verified Scholars</span>
              </div>
            </div>
          </header>

          {/* Scrollable Message Stream */}
          <div className="flex-1 overflow-y-auto px-space-xl py-space-lg flex flex-col gap-6">
            {/* Date / Consensus Stamp Divider */}
            <div className="flex items-center justify-center my-1">
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-surface-container text-on-surface-variant font-label-md text-label-md shadow-sm border border-surface-container-high">
                <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                <span className="font-medium">Today — November 14, 2024</span>
                <span className="text-outline-variant">•</span>
                <span className="font-mono text-[11px]">Consortium Node Consensus Validated (Block #482,044)</span>
              </div>
            </div>

            {/* Render Chat Messages */}
            {chatMessages.map((msg) => (
              <article key={msg.id} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center font-headline-sm text-headline-sm font-semibold shadow-sm ${
                  msg.isSelf ? "bg-primary text-on-primary" : "bg-primary-container text-on-primary"
                }`}>
                  {msg.avatar}
                </div>
                <div className={`flex-1 min-w-0 bg-surface-container-lowest rounded p-space-md border shadow-[0_1px_6px_rgba(0,0,0,0.03)] flex flex-col gap-3 ${
                  msg.isSelf ? "border-primary/20" : "border-surface-container"
                }`}>
                  {/* Message Attribution Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-surface-container-low">
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                        {msg.sender} {msg.isSelf && <span className="text-primary font-normal">(You)</span>}
                      </span>
                      {msg.isFaculty && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          {msg.role}
                        </span>
                      )}
                      {!msg.isFaculty && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                          {msg.role}
                        </span>
                      )}
                      <span className="font-label-sm text-label-sm text-outline">{msg.institution}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-outline">
                      <span>{msg.time}</span>
                      <span>•</span>
                      <span className="text-on-surface-variant">{msg.signature}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </p>

                  {/* Optional Q&A Ref Card */}
                  {msg.hasQuestionRef && (
                    <div className="rounded bg-surface-container-low/70 border border-primary/20 p-space-md flex flex-col gap-2 hover:bg-surface-container-low transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">quiz</span>
                          <span className="font-mono text-label-sm text-primary font-semibold uppercase">[Consortium Q&A Reference #88219]</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary/15 px-2 py-0.5 rounded">
                          Endorsed by 2 Faculty Chairs
                        </span>
                      </div>
                      <h4 onClick={() => navigate("/questions/q1")} className="font-title-md text-title-md text-on-surface font-semibold hover:text-primary transition-colors cursor-pointer">
                        Optimal Kalman filtering parameters for high-turbidity ultrasonic water level sensors under intermittent battery power
                      </h4>
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-on-surface-variant font-body-sm text-body-sm">
                        <div className="flex items-center gap-3">
                          <span>Filed under: <strong className="text-on-surface">AI / IoT / GIS</strong></span>
                          <span>•</span>
                          <span>4 Verified Answers</span>
                          <span>•</span>
                          <span className="text-secondary font-mono font-semibold">+15 Campus Cred (CCS)</span>
                        </div>
                        <button onClick={() => navigate("/questions/q1")} className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1">
                          <span>Open Q&A Thread in Split View</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional Code Snippet Card */}
                  {msg.codeSnippet && (
                    <div className="rounded bg-inverse-surface text-inverse-on-surface overflow-hidden text-left shadow-sm">
                      <div className="px-space-md py-2 bg-inverse-surface/90 border-b border-outline/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-secondary-fixed">code</span>
                          <span className="font-mono text-[12px] font-semibold text-inverse-on-surface">sensor_dsp.rs — Line 142 to 158</span>
                          <span className="font-mono text-[11px] bg-primary-container px-1.5 py-0.2 rounded text-on-primary">branch: feature/adaptive-kalman</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="font-label-sm text-label-sm text-outline-variant hover:text-inverse-on-surface flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                            <span>Copy Rust</span>
                          </button>
                        </div>
                      </div>
                      <pre className="p-space-md font-mono text-[12.5px] leading-relaxed overflow-x-auto text-surface-container-high"><code>{`pub fn filter_crest_surge(&mut self, raw_depth_cm: f32, dt_sec: f32) -> Option<FilteredSample> {
    let velocity = (raw_depth_cm - self.prev_depth) / dt_sec;
    self.update_covariance_matrix(velocity);

    // Prune transmission if steady state variance < threshold
    if self.is_quiescent(velocity) && self.heartbeat_counter < MAX_SKIP {
        return None;
    }
    Some(self.step(raw_depth_cm))
}`}</code></pre>
                    </div>
                  )}

                  {/* Optional Milestone Ref Card */}
                  {msg.milestoneRef && (
                    <div className="rounded bg-secondary/5 border border-secondary/20 p-space-md flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-secondary">flag</span>
                          <span className="font-mono text-label-sm text-secondary font-semibold uppercase">[Milestone #3 Verification · FloodSense]</span>
                        </div>
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold">
                          <span className="material-symbols-outlined text-[14px]">task_alt</span>
                          100% Completed
                        </span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                        LoRa SX1262 SPI Driver & Power Profiling v0.3 merge
                      </h4>
                      <div className="flex items-center justify-between flex-wrap gap-2 text-on-surface-variant font-body-sm text-body-sm pt-1">
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span>Verified by 3 Peer Approvals</span>
                          <span>•</span>
                          <span className="text-secondary font-bold">+20 Campus Cred (CCS) Awarded</span>
                        </div>
                        <button onClick={() => navigate("/projects/prj-8842")} className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1">
                          <span>View Milestone in Project Workspace</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* BOTTOM COMPOSER: Academic Message Composer */}
          <footer className="bg-surface-container-lowest border-t border-surface-container p-space-md flex flex-col gap-2 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">attach_file</span>
                  <span>Attach Paper / Dataset</span>
                </button>
                <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">folder</span>
                  <span>Link PRJ</span>
                </button>
                <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">quiz</span>
                  <span>Link Q&A Thread</span>
                </button>
                <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors font-serif italic">
                  <span>$f(x)$ LaTeX</span>
                </button>
                <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                  <span>Code Block</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-label-sm text-label-sm text-outline font-mono">Markdown & MathJax Enabled</span>
              </div>
            </div>

            {/* Input Box */}
            <div className="relative w-full">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full bg-surface-container-low/60 rounded p-space-md font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all resize-none border border-surface-container-high"
                placeholder="Write a message to #sprint-1-telemetry... Mention @scholar, reference /PRJ, or cite /doi..."
                rows={3}
              />
            </div>

            {/* Bottom Controls & Submit */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 text-outline">
                  <button className="w-7 h-7 rounded hover:bg-surface-container hover:text-on-surface flex items-center justify-center font-bold text-sm">B</button>
                  <button className="w-7 h-7 rounded hover:bg-surface-container hover:text-on-surface flex items-center justify-center italic text-sm font-serif">I</button>
                  <button className="w-7 h-7 rounded hover:bg-surface-container hover:text-on-surface flex items-center justify-center font-mono text-xs">&lt;/&gt;</button>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-outline">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>Draft auto-saved · Authenticated as Aditya Sharma (IIT Delhi #04)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant cursor-pointer select-none">
                  <input defaultChecked className="w-4 h-4 rounded text-primary-container focus:ring-primary-container" type="checkbox"/>
                  <span>Cryptographically Sign Record</span>
                </label>
                <button
                  onClick={handleSend}
                  className="px-5 py-2 rounded bg-primary-container hover:bg-primary text-on-primary font-title-sm text-title-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
                  type="button"
                >
                  <span>Transmit Message</span>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;
