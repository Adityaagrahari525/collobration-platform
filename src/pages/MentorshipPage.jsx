import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const MentorshipPage = () => {
  const navigate = useNavigate();
  const { mentors, requestConnection } = useApp();
  const [activeRoleTab, setActiveRoleTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestedMentors, setRequestedMentors] = useState({});

  const handleRequestMentorship = (mentorId) => {
    setRequestedMentors((prev) => ({ ...prev, [mentorId]: true }));
    if (requestConnection) {
      requestConnection(mentorId);
    }
  };

  return (
    <div className="w-full px-space-lg py-space-md">
      <div className="flex flex-col w-full">
        {/* Top Academic Credentials Bar & Header Section */}
        <div className="w-full mb-space-lg flex flex-col gap-space-sm">
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/60">
            <div className="flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                National Academic Consortium Network
              </span>
              <span className="text-outline">/</span>
              <span>Directory Index 2024.11</span>
              <span className="text-outline">/</span>
              <span className="text-secondary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                142 Connected Campuses Synchronized
              </span>
            </div>
            <div className="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant">
              <span>Verified Registry Hash: <code className="font-mono text-primary font-medium">0x89e2..b74a</code></span>
              <span className="px-2 py-0.5 rounded bg-secondary-fixed/40 text-on-secondary-fixed font-semibold uppercase tracking-wider">Zero Commercial Tutoring Guaranteed</span>
            </div>
          </div>
          {/* Editorial Header Title Block */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-space-xs">
            <div className="max-w-3xl">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight">
                Find a Mentor
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
                Connect with verified faculty, doctoral researchers, senior scholars, and industry fellows across 140+ consortium institutions for research guidance, thesis advising, and technical code audits.
              </p>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <button className="px-space-md py-2 bg-surface-container-lowest text-primary hover:bg-surface-container font-title-sm text-title-sm rounded-lg shadow-sm border border-outline-variant/60 flex items-center gap-1.5 transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                <span>Download Protocol PDF</span>
              </button>
              <button className="px-space-md py-2 bg-primary-container text-on-primary hover:bg-primary font-title-sm text-title-sm rounded-lg shadow-xs flex items-center gap-1.5 transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>Register as Mentor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Structured Filter Workspace */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 p-space-md mb-space-lg flex flex-col gap-space-md">
          {/* Primary Search Line */}
          <div className="flex flex-col lg:flex-row items-stretch gap-space-sm">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">manage_search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-surface rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline border border-outline-variant/60 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                placeholder="Search by research area, thesis domain, framework (e.g. Distributed Consensus, Verilog, Indic LLMs)..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-space-md py-2.5 bg-primary-container text-on-primary hover:bg-primary font-title-sm text-title-sm rounded-lg shadow-xs flex items-center gap-1.5 transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                <span>Apply Filters</span>
              </button>
              <button onClick={() => setSearchQuery("")} className="px-space-sm py-2.5 text-on-surface-variant hover:text-on-surface font-title-sm text-title-sm rounded-lg hover:bg-surface-container transition-colors" type="button">
                Reset
              </button>
            </div>
          </div>

          {/* Quick Domain Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-surface-container/80 text-body-sm">
            <span className="font-label-md text-label-md text-outline uppercase tracking-wider">Quick Domains:</span>
            {["Distributed Systems", "VLSI & RTL Design", "Machine Learning Theory", "Computational Genomics", "Cryptography & Formal Proofs", "Embedded TinyML"].map((domain, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(domain)}
                className="px-2.5 py-1 rounded bg-surface text-on-surface-variant hover:bg-surface-container hover:text-primary border border-outline-variant/40 font-body-sm text-body-sm transition-colors"
                type="button"
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Mentor Role Archetype Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-container/80">
            {[
              { id: "all", label: "All Mentors", count: "328" },
              { id: "faculty", label: "Faculty (Tenured & Adjunct)", count: "74" },
              { id: "senior", label: "Senior Student (Masters/Final Year)", count: "112" },
              { id: "researcher", label: "Researcher (Postdocs, Lab Fellows, JRF)", count: "89" },
              { id: "industry", label: "Industry Fellow (R&D Labs)", count: "53" },
            ].map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveRoleTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg font-title-sm text-title-sm cursor-pointer transition-colors ${
                  activeRoleTab === tab.id
                    ? "bg-primary-container text-on-primary shadow-xs font-semibold"
                    : "bg-surface text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/40"
                }`}
              >
                {tab.label} <span className={`ml-1 text-xs font-normal ${activeRoleTab === tab.id ? "opacity-80" : "text-outline"}`}>({tab.count})</span>
              </div>
            ))}
          </div>

          {/* Secondary Refinement Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-2 bg-surface-container-low/50 p-space-sm rounded-lg border border-surface-container">
            <div className="flex items-center gap-2">
              <label className="font-label-md text-label-md text-outline whitespace-nowrap">Sort By:</label>
              <select className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/50 rounded font-body-sm text-body-sm py-1.5 px-2 focus:ring-1 focus:ring-primary-container">
                <option>Highest Contribution Score (Scholarly Impact)</option>
                <option>Available Guidance Slots (Highest first)</option>
                <option>Acceptance Velocity (&lt; 24h response)</option>
                <option>Peer Review Count</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-label-md text-label-md text-outline whitespace-nowrap">Institution Node:</label>
              <select className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/50 rounded font-body-sm text-body-sm py-1.5 px-2 focus:ring-1 focus:ring-primary-container">
                <option>All Consortium Nodes (IITs, IISc, NITs, BITS)</option>
                <option>Indian Institutes of Technology (IITs)</option>
                <option>Indian Institute of Science (IISc)</option>
                <option>BITS Pilani System</option>
                <option>IIITs & National Institutes of Technology</option>
                <option>Central Research Laboratories</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-label-md text-label-md text-outline whitespace-nowrap">Guidance Mode:</label>
              <select className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/50 rounded font-body-sm text-body-sm py-1.5 px-2 focus:ring-1 focus:ring-primary-container">
                <option>All Modalities</option>
                <option>1:1 Sprint Mentorship (4-6 Weeks)</option>
                <option>Code / Systems PR Review & Profiling</option>
                <option>M.Tech / Ph.D. Thesis Co-advising</option>
                <option>Conference Paper Pre-submission Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Dual-Column Content Structure (Cards Grid + Structured Right Rail) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Mentor Cards Catalog (8 cols on large display) */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            {/* Catalog Metric Summary Bar */}
            <div className="flex items-center justify-between px-1 text-on-surface-variant font-label-md text-label-md">
              <span>Displaying <strong className="text-on-surface font-semibold">6 accredited mentors</strong> matching selected criteria</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span>All credential attestations refreshed at 06:00 IST</span>
              </div>
            </div>

            {/* CARD 1: Prof. K. Ramanathan */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 hover:border-outline/70 transition-all p-space-md flex flex-col gap-space-md relative overflow-hidden group">
              <div className="flex flex-wrap items-start justify-between gap-space-sm pb-space-sm border-b border-surface-container-high/60">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-title-md text-title-md font-bold tracking-tight shadow-xs">
                    KR
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">Prof. K. Ramanathan</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm font-semibold border border-secondary-fixed-dim/40">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        .ac.in Verified Faculty
                      </span>
                      <span className="text-outline text-xs">Node #9921</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      IIT Roorkee & Visiting PI at IIT Madras · Dept of Civil & Sensor Informatics
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
                  <div className="flex items-center gap-1 text-primary font-bold font-title-sm text-title-sm">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-container">workspace_premium</span>
                    <span>4,180 pts</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Top 0.5% Contributor</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Primary Core Domains</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">IoT Telemetry Protocols</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Low-power LoRaWAN</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Sensor Drift Calibration</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Hydrological Modeling</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Accepted Areas of Guidance</span>
                  <ul className="text-body-sm text-on-surface space-y-1 font-body-sm">
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>M.Tech & Ph.D. Thesis Research Proposal Structuring</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>IEEE / Elsevier Journal Pre-submission Reviews</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Field Deployment Hardware Testbed Debugging</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-surface-container-high/60 bg-surface-container-lowest">
                <div className="flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-tertiary-container bg-tertiary-fixed/40 px-2 py-0.5 rounded border border-tertiary-fixed-dim/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
                    Limited: 1 slot left for Nov-Dec sprint
                  </span>
                  <span className="hidden sm:inline">19 mentees published</span>
                  <span className="hidden md:inline">Avg response: 14 hours</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <button onClick={() => navigate("/people/p-ramanathan")} className="px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/60 font-title-sm text-title-sm transition-colors" type="button">
                    View Dossier
                  </button>
                  <button
                    onClick={() => handleRequestMentorship("kr-1")}
                    disabled={requestedMentors["kr-1"]}
                    className={`px-space-md py-1.5 rounded font-title-sm text-title-sm shadow-xs flex items-center gap-1 transition-colors ${
                      requestedMentors["kr-1"] ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary hover:bg-primary"
                    }`}
                    type="button"
                  >
                    <span>{requestedMentors["kr-1"] ? "Request Sent" : "Request Mentorship"}</span>
                    <span className="material-symbols-outlined text-[16px]">{requestedMentors["kr-1"] ? "check" : "arrow_forward"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: Dr. Ananya Chakraborty */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 hover:border-outline/70 transition-all p-space-md flex flex-col gap-space-md relative overflow-hidden group">
              <div className="flex flex-wrap items-start justify-between gap-space-sm pb-space-sm border-b border-surface-container-high/60">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-title-md text-title-md font-bold tracking-tight border border-outline-variant/50">
                    AC
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">Dr. Ananya Chakraborty</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm font-semibold border border-secondary-fixed-dim/40">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        Senior Postdoctoral Fellow
                      </span>
                      <span className="text-outline text-xs">Node #4188</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      IISc Bangalore · Department of Computational and Data Sciences (CDS)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
                  <div className="flex items-center gap-1 text-primary font-bold font-title-sm text-title-sm">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-container">workspace_premium</span>
                    <span>3,420 pts</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Top 2% Contributor</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Primary Core Domains</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Low-Resource Indic NLP</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Bilingual Tokenizers</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Instruction Tuning</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Annotation Rigor</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Accepted Areas of Guidance</span>
                  <ul className="text-body-sm text-on-surface space-y-1 font-body-sm">
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>NeurIPS / EMNLP / ACL Pre-submission Paper Audits</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Crowdsourced Indic Dataset Annotation Guidelines</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Postdoc Fellowship Applications (DAAD / SERB NPDF)</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-surface-container-high/60 bg-surface-container-lowest">
                <div className="flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-secondary bg-secondary-fixed/30 px-2 py-0.5 rounded border border-secondary-fixed/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    2 slots available for Nov-Dec sprint
                  </span>
                  <span className="hidden sm:inline">12 mentees placed in Tier-1 Labs</span>
                  <span className="hidden md:inline">Avg response: 18 hours</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <button onClick={() => navigate("/people/p-ananya")} className="px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/60 font-title-sm text-title-sm transition-colors" type="button">
                    View Dossier
                  </button>
                  <button
                    onClick={() => handleRequestMentorship("ac-2")}
                    disabled={requestedMentors["ac-2"]}
                    className={`px-space-md py-1.5 rounded font-title-sm text-title-sm shadow-xs flex items-center gap-1 transition-colors ${
                      requestedMentors["ac-2"] ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary hover:bg-primary"
                    }`}
                    type="button"
                  >
                    <span>{requestedMentors["ac-2"] ? "Request Sent" : "Request Mentorship"}</span>
                    <span className="material-symbols-outlined text-[16px]">{requestedMentors["ac-2"] ? "check" : "arrow_forward"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3: Devavrat Saxena */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 hover:border-outline/70 transition-all p-space-md flex flex-col gap-space-md relative overflow-hidden group">
              <div className="flex flex-wrap items-start justify-between gap-space-sm pb-space-sm border-b border-surface-container-high/60">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface font-title-md text-title-md font-bold tracking-tight flex items-center justify-center border border-outline-variant/60">
                    DS
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">Devavrat Saxena</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-fixed/60 text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold border border-primary-fixed-dim/60">
                        <span className="material-symbols-outlined text-[13px]">school</span>
                        Senior Doctoral Scholar (4th Yr Ph.D.)
                      </span>
                      <span className="text-outline text-xs">Node #1042</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      IIT Bombay · Department of Computer Science & Engineering
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
                  <div className="flex items-center gap-1 text-primary font-bold font-title-sm text-title-sm">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-container">workspace_premium</span>
                    <span>3,640 pts</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Top 1% Contributor</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Primary Core Domains</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Self-Supervised Vision</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Graph Neural Networks</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">PyTorch Multi-GPU DDP</span>
                    <span className="px-2 py-0.5 rounded bg-surface font-mono text-[11px] text-on-surface font-medium border border-outline-variant/60">Kernel Profiling</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Accepted Areas of Guidance</span>
                  <ul className="text-body-sm text-on-surface space-y-1 font-body-sm">
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>M.Tech Thesis Defense Dry-run & Proof Verification</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Distributed Training Optimization & Slurm Cluster Ops</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>CVPR / ICCV Workshop Submission Reviews</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-surface-container-high/60 bg-surface-container-lowest">
                <div className="flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-secondary bg-secondary-fixed/30 px-2 py-0.5 rounded border border-secondary-fixed/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    3 slots open · High acceptance rate
                  </span>
                  <span className="hidden sm:inline">26 PR reviews approved</span>
                  <span className="hidden md:inline">Avg response: 6 hours</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <button onClick={() => navigate("/people/p-devavrat")} className="px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/60 font-title-sm text-title-sm transition-colors" type="button">
                    View Dossier
                  </button>
                  <button
                    onClick={() => handleRequestMentorship("ds-3")}
                    disabled={requestedMentors["ds-3"]}
                    className={`px-space-md py-1.5 rounded font-title-sm text-title-sm shadow-xs flex items-center gap-1 transition-colors ${
                      requestedMentors["ds-3"] ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary hover:bg-primary"
                    }`}
                    type="button"
                  >
                    <span>{requestedMentors["ds-3"] ? "Request Sent" : "Request Mentorship"}</span>
                    <span className="material-symbols-outlined text-[16px]">{requestedMentors["ds-3"] ? "check" : "arrow_forward"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination Component */}
            <div className="flex items-center justify-between py-space-sm px-space-md bg-surface-container-lowest rounded-lg border border-outline-variant/50 text-body-sm shadow-sm">
              <span className="text-on-surface-variant">Showing 1 to 6 of 328 accredited researchers</span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 rounded bg-surface border border-outline-variant/50 text-outline cursor-not-allowed" type="button">Previous</button>
                <button className="px-3 py-1 rounded bg-primary-container text-on-primary font-semibold" type="button">1</button>
                <button className="px-3 py-1 rounded bg-surface border border-outline-variant/50 hover:bg-surface-container text-on-surface" type="button">2</button>
                <button className="px-3 py-1 rounded bg-surface border border-outline-variant/50 hover:bg-surface-container text-on-surface" type="button">3</button>
                <span className="px-1 text-outline">...</span>
                <button className="px-3 py-1 rounded bg-surface border border-outline-variant/50 hover:bg-surface-container text-on-surface" type="button">55</button>
                <button className="px-3 py-1 rounded bg-surface border border-outline-variant/50 hover:bg-surface-container text-on-surface" type="button">Next</button>
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Protocol & Active Tracker Sidebar (4 cols on large display) */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            {/* Panel 1: My Active Mentorships (Current Engagement) */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high/60">
                <div className="flex items-center gap-1.5 text-on-surface font-title-sm text-title-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary">sync_saved_locally</span>
                  <span>My Active Engagements</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm font-semibold">1 Active</span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-space-sm border border-surface-container flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm text-on-surface">Prof. K. Ramanathan</span>
                  <span className="font-label-sm text-label-sm text-outline">Sprint 3 of 6</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
                  Thesis Track: <em>"Low-power LoRaWAN Backscatter Evaluation"</em>
                </span>
                {/* Progress Bar Representation */}
                <div className="w-full bg-surface-container rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: "50%" }}></div>
                </div>
                <div className="flex items-center justify-between pt-1 font-label-sm text-label-sm text-outline">
                  <span className="flex items-center gap-1 text-on-surface">
                    <span className="material-symbols-outlined text-[14px] text-primary">event</span>
                    Next Sync: Thursday 10:30 AM
                  </span>
                  <a className="text-primary hover:underline font-semibold" href="#workspace" onClick={(e) => { e.preventDefault(); navigate("/messages"); }}>Open Workspace →</a>
                </div>
              </div>
            </div>

            {/* Panel 2: Mentorship Framework & Protocol */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center gap-1.5 text-on-surface font-title-sm text-title-sm pb-space-xs border-b border-surface-container-high/60">
                <span className="material-symbols-outlined text-[18px] text-primary">policy</span>
                <span>Mentorship Integrity Framework</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                CampusLink operates on verified non-monetary academic exchange. All guidance sessions produce verifiable digital attestations recognized by consortium institutions.
              </p>
              {/* Structured Sequential Steps */}
              <div className="flex flex-col gap-space-sm pt-1">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface">Submit Academic Inquiry</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Provide a 250-word proposal, Git commit hash, or draft abstract.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface">48h Academic Review</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">The designated scholar accepts, suggests scope changes, or redirects to an open lab seat.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface">Structured Sprint Reviews</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Structured bi-weekly feedback logged directly onto the consortium ledger.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface">Contribution Accrual</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Both parties receive authenticated peer credits toward faculty honors and thesis credit.</p>
                  </div>
                </div>
              </div>
              <div className="p-space-sm bg-surface-container-low rounded-lg border border-surface-container mt-2">
                <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span className="font-semibold">Institutional Compliance Seal</span>
                </div>
                <p className="font-label-sm text-label-sm text-outline mt-1 leading-snug">
                  Protected under the Indian National Higher Education Research Federation guidelines. Zero paid commercial advising allowed.
                </p>
              </div>
            </div>

            {/* Panel 3: Become a Consortium Mentor Callout */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center gap-1.5 text-on-surface font-title-sm text-title-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">volunteer_activism</span>
                <span>Register as a Research Mentor</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Open to registered university researchers, postdocs, and M.Tech/Ph.D. candidates seeking to build verified mentoring credentials.
              </p>
              <div className="space-y-1.5 font-label-md text-label-md text-on-surface-variant my-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                  <span>Requires authenticated <code>.ac.in</code> institutional email</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                  <span>Minimum 500 Contribution Points across repos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                  <span>At least 1 conference or pre-print DOI indexed</span>
                </div>
              </div>
              <button className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-primary border border-outline-variant/60 rounded-lg font-title-sm text-title-sm transition-colors flex items-center justify-center gap-1.5" type="button">
                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                <span>Submit Verification Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipPage;
