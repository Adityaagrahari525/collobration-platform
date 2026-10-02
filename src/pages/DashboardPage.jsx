import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, questions, voteQuestion } = useApp();
  const [activeTab, setActiveTab] = useState("pulse");

  return (
    <div className="w-full max-w-[1400px] mx-auto px-space-md lg:px-space-lg py-space-md flex flex-col space-y-space-md bg-surface">
      {/* Top Welcome & Institutional Verification Banner */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-lg">
        <div className="space-y-1">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif">
            Good evening, {currentUser?.name?.split(" ")[0] || "Aditya"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-space-xs">
            <span>Here’s what’s happening across your academic network.</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-mono text-label-sm text-secondary font-medium">NKN Cluster: North-DL-02 Syncing</span>
          </p>
        </div>

        {/* Verified Institutional Credentials Strip */}
        <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs bg-surface-container-lowest rounded-lg shadow-sm border border-surface-container-high">
          <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary font-serif font-bold text-title-md">
            IIT
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">{currentUser?.name || "Aditya Sharma"}</span>
              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-secondary-container/40 text-on-secondary-container rounded font-label-sm text-[10px] uppercase font-mono font-medium">
                <span className="material-symbols-outlined text-[13px] text-secondary">verified</span>
                .ac.in Verified
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {currentUser?.degree || "B.Tech CSE '25"}, {currentUser?.institution || "IIT Delhi"} · Student Researcher{" "}
              <span className="font-mono text-outline">#{currentUser?.verificationCode || "IN-9042"}</span>
            </span>
          </div>
          <div className="h-6 w-px bg-surface-container-high hidden sm:block"></div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-secondary font-mono">EDUROAM_FED</span>
            <span className="font-label-sm text-[9px] text-outline uppercase font-mono">Tier-1 Node</span>
          </div>
        </div>
      </section>

      {/* High-Density Scholarly Metric Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm mb-space-lg">
        {/* Metric 1 */}
        <div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-lowest/90 transition-all border border-surface-container-high">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Contribution Score</span>
            <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight font-serif">
              {currentUser?.contributionScore?.toLocaleString() || "1,420"}
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-mono flex items-center font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>+48 this wk
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Top 4% in Distributed Systems</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-lowest/90 transition-all border border-surface-container-high">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Answers Given</span>
            <span className="material-symbols-outlined text-[18px] text-primary">quiz</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight font-serif">
              {currentUser?.answersCount || 34}
            </span>
            <span className="font-label-sm text-label-sm text-outline-variant font-mono">lifetime</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            <span className="font-medium text-on-surface">18 peer-validated</span> · 4 faculty citations
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-lowest/90 transition-all border border-surface-container-high">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Acceptance Rate</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight font-serif">82.3%</span>
            <span className="font-label-sm text-label-sm text-secondary font-mono">{currentUser?.acceptedAnswersCount || 28} accepted</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">Recognized across 6 partner colleges</div>
        </div>

        {/* Metric 4 */}
        <div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-lowest/90 transition-all border border-surface-container-high">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Research Projects</span>
            <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
          </div>
          <div className="my-space-xs flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight font-serif">5</span>
            <span className="font-label-sm text-label-sm text-primary font-mono font-medium">Consortium Node</span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            <span className="font-medium text-on-surface">2 active sprints</span> · 3 archived repos
          </div>
        </div>
      </section>

      {/* Strict 70% Feed and 30% Recommendation Canvas Grid (Gap: 24px = space-lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg items-start">
        {/* LEFT COLUMN: 70% Main Feed (7 / 10 columns) */}
        <div className="lg:col-span-7 space-y-space-md">
          {/* Feed Filter Tab Bar */}
          <div className="bg-surface-container-lowest p-space-xs rounded-lg shadow-sm flex items-center justify-between text-label-sm border border-surface-container-high">
            <div className="flex items-center gap-1 font-title-sm text-title-sm">
              <button
                onClick={() => setActiveTab("pulse")}
                className={`px-space-sm py-1.5 rounded font-medium flex items-center gap-1 transition shadow-sm ${
                  activeTab === "pulse" ? "bg-primary text-on-primary font-semibold" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">dynamic_feed</span>
                Network Pulse
              </button>
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`px-space-sm py-1.5 rounded font-medium transition ${
                  activeTab === "inquiries" ? "bg-primary text-on-primary font-semibold" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                Verified Inquiries
              </button>
              <button
                onClick={() => setActiveTab("sprints")}
                className={`px-space-sm py-1.5 rounded font-medium transition ${
                  activeTab === "sprints" ? "bg-primary text-on-primary font-semibold" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                Active Sprints
              </button>
              <button
                onClick={() => setActiveTab("archival")}
                className={`px-space-sm py-1.5 rounded font-medium transition ${
                  activeTab === "archival" ? "bg-primary text-on-primary font-semibold" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                Archival Resources
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-2 pr-2 text-on-surface-variant">
              <span className="font-mono text-label-sm">ORDER: RECENCY</span>
            </div>
          </div>

          {/* ITEM 1: Question Card (Raft Consensus) */}
          <article className="p-space-lg bg-surface-container-lowest rounded-lg shadow-sm space-y-space-sm transition-all hover:shadow-md border border-surface-container-high">
            {/* Card Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-space-xs text-label-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-1.5 py-0.5 bg-surface-container-high text-primary font-mono font-semibold rounded text-[11px]">
                  [IIT Bombay · CSE]
                </span>
                <span className="text-on-surface-variant font-mono">Posted 2h ago</span>
                <span className="text-outline-variant">·</span>
                <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-medium">
                  Distributed Systems
                </span>
                <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-medium">
                  BFT Consensus
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary-container/30 text-on-secondary-container rounded font-mono text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                ACTIVE DISCUSSION
              </span>
            </div>
            {/* Question Body */}
            <div className="space-y-1.5">
              <h2
                onClick={() => navigate("/questions/q1")}
                className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition font-serif cursor-pointer"
              >
                How to handle cascading split-brain in Raft consensus with asymmetric network partitions?
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                We are simulating a 7-node cross-campus testbed between IITD and IITB nodes. When 2 nodes experience unilateral packet loss, leader election triggers a livelock state where candidate terms increment monotonically without reaching quorum...
              </p>
            </div>
            {/* Metric and Action Bar */}
            <div className="pt-space-xs flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-md text-body-sm text-on-surface-variant font-mono">
                <button
                  onClick={() => voteQuestion("q1")}
                  className="flex items-center gap-1 px-2 py-1 bg-surface-container-low hover:bg-surface-container rounded text-primary font-semibold transition"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  <span>24 Upvotes</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                  <span className="text-on-surface font-medium">6 answers</span>
                  <span className="text-secondary">(1 faculty-verified by Prof. R. Raman)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1 text-on-surface-variant hover:text-primary text-label-sm font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bookmark_border</span>
                  Follow
                </button>
                <button
                  onClick={() => navigate("/questions/q1")}
                  className="px-3.5 py-1.5 bg-primary text-on-primary rounded text-label-sm font-medium hover:bg-primary-container transition flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">rate_review</span>
                  Answer Question
                </button>
              </div>
            </div>
          </article>

          {/* ITEM 2: Project Card (CampusNet-Mesh) */}
          <article className="p-space-lg bg-surface-container-lowest rounded-lg shadow-sm space-y-space-sm transition-all hover:shadow-md border border-surface-container-high">
            {/* Project Tag Header */}
            <div className="flex flex-wrap items-center justify-between gap-space-xs text-label-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded font-label-sm font-semibold tracking-wide uppercase">
                  Open Collaboration Sprint
                </span>
                <span className="text-on-surface-variant font-medium">Cross-College Initiative (IIT Delhi × BITS Pilani)</span>
              </div>
              <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed rounded font-mono text-[11px] font-semibold">
                2 open research roles
              </span>
            </div>
            {/* Project Detail */}
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h2
                  onClick={() => navigate("/projects/proj-826")}
                  className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition font-serif cursor-pointer"
                >
                  CampusNet-Mesh: Decentralized Peer-to-Peer Academic Dataset Distribution
                </h2>
                <span className="font-mono text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded">v0.4.2-alpha</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Building an encrypted P2P protocol for sharing multi-gigabyte genomics and LLM checkpoint data across Indian university local LANs without congesting NKN backbones. Includes local NAT traversal and zero-knowledge verification hashes.
              </p>
            </div>
            {/* Tech Stack Pill Ribbon */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-label-sm text-outline-variant font-mono uppercase mr-1">Stack:</span>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface font-mono text-label-sm rounded font-medium">Rust</span>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface font-mono text-label-sm rounded font-medium">libp2p</span>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface font-mono text-label-sm rounded font-medium">WebRTC</span>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface font-mono text-label-sm rounded font-medium">React</span>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface font-mono text-label-sm rounded font-medium">TypeScript</span>
            </div>
            {/* Contributors & Recruitment Requirements Box */}
            <div className="p-space-sm bg-surface-container-low rounded-lg space-y-space-xs">
              <div className="flex flex-wrap items-center justify-between text-body-sm text-on-surface-variant gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-title-sm text-title-sm text-on-surface font-medium">4 active contributors:</span>
                  <div className="flex items-center -space-x-1.5 font-mono text-[10px]">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold ring-2 ring-surface-container-lowest" title="IIT Delhi">
                      D
                    </span>
                    <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold ring-2 ring-surface-container-lowest" title="BITS Pilani">
                      B
                    </span>
                    <span className="w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold ring-2 ring-surface-container-lowest" title="IIT Roorkee">
                      R
                    </span>
                    <span className="w-6 h-6 rounded-full bg-surface-dim text-on-surface flex items-center justify-center font-bold ring-2 ring-surface-container-lowest" title="IIIT-H">
                      H
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm">
                  <span className="text-on-surface-variant">Seeking:</span>
                  <span className="px-1.5 py-0.5 bg-surface-container-lowest text-primary rounded font-mono">Systems Engineer (libp2p)</span>
                  <span className="px-1.5 py-0.5 bg-surface-container-lowest text-primary rounded font-mono">Frontend Dev (React/Tailwind)</span>
                </div>
              </div>
            </div>
            {/* Project Actions */}
            <div className="pt-space-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-on-surface-variant text-body-sm font-mono">
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>Permit DOI: 10.48550/arXiv.2403.cnmesh</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/projects/proj-826")}
                  className="px-3.5 py-1.5 bg-surface-container-low text-on-surface rounded text-label-sm font-medium hover:bg-surface-container transition flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">folder_open</span>
                  View Research Repo
                </button>
                <button
                  onClick={() => navigate("/projects/proj-826")}
                  className="px-3.5 py-1.5 bg-primary text-on-primary rounded text-label-sm font-medium hover:bg-primary-container transition flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">group_add</span>
                  Request to Join Team
                </button>
              </div>
            </div>
          </article>

          {/* ITEM 3: Question Card (Robotics Sensor Fusion) */}
          <article className="p-space-lg bg-surface-container-lowest rounded-lg shadow-sm space-y-space-sm transition-all hover:shadow-md border border-surface-container-high">
            <div className="flex flex-wrap items-center justify-between gap-space-xs text-label-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-1.5 py-0.5 bg-surface-container-high text-primary font-mono font-semibold rounded text-[11px]">
                  [IISc Bangalore · AI/Robotics Lab]
                </span>
                <span className="text-on-surface-variant font-mono">Posted 5h ago</span>
                <span className="text-outline-variant">·</span>
                <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-medium">
                  Computer Vision
                </span>
                <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-medium">
                  Sensor Fusion
                </span>
              </div>
              <span className="font-mono text-label-sm text-outline">Dataset Link Attached</span>
            </div>
            <div className="space-y-1.5">
              <h2
                onClick={() => navigate("/questions/q-robotics")}
                className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition font-serif cursor-pointer"
              >
                Calibrating dual LiDAR-Stereo camera extrinsic matrix drift under thermal variation in field robotics?
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                We observe a 1.4-degree rotational drift after 45 minutes of autonomous rover testing under ambient Indian summer temperatures (38°C+). Has anyone implemented online continuous Kalman re-calibration without dedicated ground truth targets?
              </p>
            </div>
            <div className="pt-space-xs flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-md text-body-sm text-on-surface-variant font-mono">
                <button
                  onClick={() => voteQuestion("q-robotics")}
                  className="flex items-center gap-1 px-2 py-1 bg-surface-container-low hover:bg-surface-container rounded text-primary font-semibold transition"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  <span>41 Upvotes</span>
                </button>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">comment</span>
                  <span>9 answers</span>
                  <span className="text-secondary font-medium ml-1">· Raw .bag dataset verified</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3.5 py-1.5 bg-surface-container-low text-on-surface rounded text-label-sm font-medium hover:bg-surface-container transition flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  ROSbag (420 MB)
                </button>
                <button
                  onClick={() => navigate("/questions/q-robotics")}
                  className="px-3.5 py-1.5 bg-primary text-on-primary rounded text-label-sm font-medium hover:bg-primary-container transition flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  View Solutions
                </button>
              </div>
            </div>
          </article>

          {/* ITEM 4: Resource Card (Shakti RISC-V SoC) */}
          <article className="p-space-lg bg-surface-container-lowest rounded-lg shadow-sm space-y-space-sm transition-all hover:shadow-md border border-surface-container-high">
            {/* Resource Tag Header */}
            <div className="flex flex-wrap items-center justify-between gap-space-xs text-label-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-surface-container text-on-surface font-semibold rounded">
                  Verified Resource Publication
                </span>
                <span className="text-on-surface-variant font-medium">IIT Madras Computer Architecture Group</span>
              </div>
              <span className="text-outline-variant font-mono">Updated yesterday · Commit #b9021e</span>
            </div>
            <div className="space-y-1.5">
              <h2 className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition font-serif cursor-pointer">
                Shakti Processor RISC-V SoC: Open Lab Manual, FPGA Bitstreams &amp; Verilog Testbenches
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Complete standardized lab curriculum for 6th-semester computer engineering students. Includes Dockerized synthesis tools, Vivado 2023.2 project constraints for Artix-7/Basys-3, and 14 validated problem sets on pipelined hazard mitigation.
              </p>
            </div>
            {/* Academic Resource Topics */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant rounded text-label-sm font-medium">RISC-V</span>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant rounded text-label-sm font-medium">Hardware Synthesis</span>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant rounded text-label-sm font-medium">Verilog</span>
              <span className="px-2 py-0.5 bg-surface-container-low text-on-surface-variant rounded text-label-sm font-medium">Open Educational Resources</span>
              <span className="px-2 py-0.5 bg-secondary-container/40 text-on-secondary-container rounded text-label-sm font-mono font-medium">CC BY-NC-SA 4.0</span>
            </div>
            {/* Access Footprint & Download Actions */}
            <div className="pt-space-xs flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-1.5 text-body-sm text-on-surface-variant font-mono">
                <span className="material-symbols-outlined text-[16px] text-secondary">hub</span>
                <span className="text-on-surface font-semibold">640 scholars</span>
                <span>accessing across 18 Indian consortium colleges</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-surface-container-low text-on-surface rounded text-label-sm font-medium hover:bg-surface-container transition flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">fork_right</span>
                  Fork on Git
                </button>
                <button className="px-3.5 py-1.5 bg-primary text-on-primary rounded text-label-sm font-medium hover:bg-primary-container transition flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  Download Manual (PDF · 12MB)
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* RIGHT COLUMN: 30% Recommendations & Consortium Trending (3 / 10 columns) */}
        <div className="lg:col-span-3 space-y-space-md">
          {/* WIDGET 1: Recommended Scholars & Faculty */}
          <div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm space-y-space-md border border-surface-container-high">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">person_search</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">Academic Connections</h3>
              </div>
              <span className="font-label-sm text-label-sm text-outline font-mono">Auto-Matched</span>
            </div>
            <div className="space-y-space-sm divide-y divide-surface-container-low">
              {/* Person 1: Faculty Mentor */}
              <div className="pt-space-xs first:pt-0 space-y-1.5">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="inline-block px-1.5 py-0.2 bg-tertiary-fixed text-on-tertiary-fixed rounded text-[9px] font-mono uppercase font-semibold">
                      Faculty mentor in Networks
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <h4 className="font-title-sm text-title-sm text-on-surface font-bold">Dr. Arvind Sundaram</h4>
                      <span className="material-symbols-outlined text-[14px] text-secondary" title="Verified Faculty">
                        verified
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Associate Professor, IIT Madras</p>
                    <p className="font-body-sm text-body-sm text-outline font-mono text-[11px]">Research: Formal Methods &amp; Consensus</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="px-1.5 py-0.5 bg-secondary-container/30 text-on-secondary-container rounded font-label-sm text-[10px] font-semibold">
                    Faculty Mentor
                  </span>
                  <button
                    onClick={() => navigate("/people/usr-2")}
                    className="px-2.5 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-label-sm text-label-sm font-medium transition"
                  >
                    Connect
                  </button>
                </div>
              </div>

              {/* Person 2: Peer Collaborator */}
              <div className="pt-space-sm space-y-1.5">
                <div>
                  <span className="inline-block px-1.5 py-0.2 bg-secondary-container/40 text-on-secondary-container rounded text-[9px] font-mono uppercase font-semibold">
                    Needs frontend contributor
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <h4 className="font-title-sm text-title-sm text-on-surface font-bold">Neha Deshmukh</h4>
                    <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">M.Tech AI/ML, IIIT Hyderabad</p>
                  <p className="font-body-sm text-body-sm text-outline font-mono text-[11px]">Shared: PyTorch, Sensor Fusion</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-label-sm text-outline font-mono">Mutual repos: 2</span>
                  <button
                    onClick={() => navigate("/messages")}
                    className="px-2.5 py-1 bg-primary text-on-primary hover:bg-primary-container rounded font-label-sm text-label-sm font-medium transition shadow-sm"
                  >
                    Collaborate
                  </button>
                </div>
              </div>

              {/* Person 3: Senior Peer */}
              <div className="pt-space-sm space-y-1.5">
                <div>
                  <span className="inline-block px-1.5 py-0.2 bg-surface-container-high text-primary rounded text-[9px] font-mono uppercase font-semibold">
                    Fellow researcher in Distributed Systems
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <h4 className="font-title-sm text-title-sm text-on-surface font-bold">Kabir Sen</h4>
                    <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">4th Year, BITS Pilani (Goa Campus)</p>
                  <p className="font-body-sm text-body-sm text-outline font-mono text-[11px]">Focus: P2P Network Protocols</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-label-sm text-outline font-mono">Active on CampusNet</span>
                  <button
                    onClick={() => navigate("/people/usr-3")}
                    className="px-2.5 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-label-sm text-label-sm font-medium transition"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 2: Recommended Sprints & Lab Projects */}
          <div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm space-y-space-md border border-surface-container-high">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">hub</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">Recommended Sprints</h3>
              </div>
              <span className="font-mono text-label-sm text-secondary font-semibold">OPEN CALLS</span>
            </div>
            <div className="space-y-space-sm">
              {/* Project Recommendation 1 */}
              <div className="p-space-xs bg-surface-container-low rounded-lg space-y-1 border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.2 bg-secondary-container text-on-secondary-container rounded text-[9px] font-mono uppercase font-semibold">
                    Popular in AI/ML
                  </span>
                  <span className="font-mono text-[10px] text-outline">IIT Bombay Lab</span>
                </div>
                <h4 className="font-title-sm text-title-sm text-on-surface font-semibold leading-snug">
                  OpenIndic-Speech: Low-resource Indian Language ASR Model
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  IIT Bombay Speech Lab · Seeking PyTorch pipeline and React Web UI for annotators.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="font-label-sm text-[11px] text-primary font-mono font-medium">Sprint closes in 4d</span>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/projects");
                    }}
                    className="text-primary font-label-sm text-label-sm font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                    href="#"
                  >
                    Apply <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>
              </div>

              {/* Project Recommendation 2 */}
              <div className="p-space-xs bg-surface-container-low rounded-lg space-y-1 border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.2 bg-surface-container-high text-primary rounded text-[9px] font-mono uppercase font-semibold">
                    Matched because you know React
                  </span>
                  <span className="font-mono text-[10px] text-outline">Inter-Campus</span>
                </div>
                <h4 className="font-title-sm text-title-sm text-on-surface font-semibold leading-snug">
                  BioSignal-Edge: Real-time ECG Analysis on Microcontroller
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  AIIMS Delhi × IIT Roorkee · Building low-power edge telemetry dashboard.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="font-label-sm text-[11px] text-outline font-mono">1 slot remaining</span>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/projects");
                    }}
                    className="text-primary font-label-sm text-label-sm font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                    href="#"
                  >
                    Apply <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 3: Trending Topics across Indian Consortium */}
          <div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm space-y-space-sm border border-surface-container-high">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">trending_up</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">Consortium Trends</h3>
              </div>
              <span className="font-mono text-label-sm text-outline">NKN Mesh</span>
            </div>
            <ul className="space-y-2.5 font-body-sm text-body-sm">
              <li
                onClick={() => navigate("/questions")}
                className="flex items-center justify-between hover:bg-surface-container-low p-1 rounded transition cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-mono font-semibold text-primary">#RaftConsensus</span>
                  <span className="text-outline text-label-sm">High verification activity</span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                  142 questions
                </span>
              </li>
              <li
                onClick={() => navigate("/questions")}
                className="flex items-center justify-between hover:bg-surface-container-low p-1 rounded transition cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-mono font-semibold text-primary">#RISCV_Shakti</span>
                  <span className="text-outline text-label-sm">Open silicon synthesis</span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                  89 discussions
                </span>
              </li>
              <li
                onClick={() => navigate("/questions")}
                className="flex items-center justify-between hover:bg-surface-container-low p-1 rounded transition cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-mono font-semibold text-primary">#SmartIndiaHackathon_Prep</span>
                  <span className="text-outline text-label-sm">National competition track</span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                  230 teams
                </span>
              </li>
              <li
                onClick={() => navigate("/questions")}
                className="flex items-center justify-between hover:bg-surface-container-low p-1 rounded transition cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-mono font-semibold text-primary">#LLM_FineTuning_Indic</span>
                  <span className="text-outline text-label-sm">Bhashini &amp; Param Ganga sync</span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                  178 notebooks
                </span>
              </li>
            </ul>
            <div className="pt-space-xs text-center border-t border-surface-container-high">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/communities");
                }}
                className="font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center justify-center gap-1 cursor-pointer"
                href="#"
              >
                Explore All Consortium Channels
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
