import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const ContributionPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeLedgerCategory, setActiveLedgerCategory] = useState("all");

  const ledgerRows = [
    {
      id: "l1",
      category: "answers",
      date: "June 24, 2024",
      tag: "Accepted Answer",
      subhead: "Distributed Systems Hub",
      title: "Formal proof of Raft pre-vote safety with non-contiguous log replication",
      inquiry: "IISc Bangalore Inquiry",
      endorsement: "Faculty Confirmed (Dr. A. Sen, IISc)",
      tx: "TX: 0x9a8f...4e12",
      pts: "+15 pts",
    },
    {
      id: "l2",
      category: "projects",
      date: "June 20, 2024",
      tag: "Project Milestone",
      subhead: "FloodSense Workspace",
      title: "LoRa SX1262 SPI Driver & Power Profiling v0.3 merge",
      inquiry: "IIT Roorkee Environmental Informatics Node",
      endorsement: "3 Peer Approvals",
      tx: "TX: 0x4f12...bc90",
      pts: "+20 pts",
    },
    {
      id: "l3",
      category: "endorsements",
      date: "June 15, 2024",
      tag: "Faculty Endorsement",
      subhead: "Hydrological Modeling Lab",
      title: "Citation in Dr. K. Ramanathan's Monsoon Runoff Technical Working Note",
      inquiry: "SERB Grant #SRB-2024-89",
      endorsement: "IIT Delhi Civil & Comp. Sci Joint Taskforce",
      tx: "TX: 0x7c3d...11fe",
      pts: "+15 pts",
    },
    {
      id: "l4",
      category: "mentorship",
      date: "June 11, 2024",
      tag: "Technical Mentorship",
      subhead: "Operating Systems Practicum",
      title: "Reviewed Rust memory layout & unsafe boundary audit for 2nd Year Systems Group",
      inquiry: "IIT Delhi CS Department",
      endorsement: "4 Mentees Attested",
      tx: "TX: 0x12ba...44aa",
      pts: "+10 pts",
    },
    {
      id: "l5",
      category: "resources",
      date: "June 04, 2024",
      tag: "Shared Resource",
      subhead: "Benchmark Repository",
      title: "Published synthetic multi-node packet loss trace (.pcap format, 45ms latency jitter)",
      inquiry: "42 Consortium Forks Across 6 Universities",
      endorsement: "Open-Access Artifact",
      tx: "TX: 0x88ec...7921",
      pts: "+8 pts",
    },
    {
      id: "l6",
      category: "answers",
      date: "May 29, 2024",
      tag: "Accepted Answer",
      subhead: "Embedded Systems Subforum",
      title: "Zero-allocation deserialization with Serde in memory-constrained microcontrollers",
      inquiry: "BITS Pilani Inquiry",
      endorsement: "Canonical Solution Marked",
      tx: "TX: 0x55d1...2009",
      pts: "+10 pts",
    }
  ];

  const filteredRows = ledgerRows.filter((row) => {
    if (activeLedgerCategory === "all") return true;
    return row.category === activeLedgerCategory;
  });

  return (
    <div className="w-full px-space-lg py-space-lg">
      <div className="flex flex-col w-full">
        {/* Top Breadcrumb & Metadata Anchor */}
        <div className="flex items-center justify-between gap-space-md mb-space-sm text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span onClick={() => navigate("/dashboard")} className="hover:text-primary cursor-pointer">Academic Network</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-primary cursor-pointer">My Workspace</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Contribution Center</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-on-surface-variant font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>LEDGER AUDIT REF: IITD-SYS-2024-C9</span>
          </div>
        </div>

        {/* Editorial Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-lg mb-space-lg">
          <div className="max-w-3xl">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight leading-tight mb-2">
              My Contribution
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Verifiable academic audit of peer answers, research projects, technical mentorship, and institutional citations across the CampusLink consortium.
            </p>
          </div>
          {/* Academic Utility Actions */}
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low text-on-surface-variant rounded hover:bg-surface-container-high transition-colors font-title-sm text-title-sm border border-surface-container-high"
              onClick={() => {
                const el = document.getElementById("methodology-panel");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Attestation Keys</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-2 bg-primary-container text-on-primary rounded hover:bg-primary transition-colors font-title-sm text-title-sm shadow-sm"
              onClick={() => window.print()}
            >
              <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
              <span>Export Verified Audit (PDF)</span>
            </button>
          </div>
        </div>

        {/* Hero Scorecard & Recognition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-space-xl">
          {/* Primary Score Metric Card (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-lg p-space-md shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-low">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-bold">Consortium Index</span>
                  <span className="px-2 py-0.5 rounded bg-secondary-fixed/40 text-secondary font-label-sm text-label-sm font-bold">Verified</span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant">NODE: #04-IITD-8821</span>
              </div>
              <div className="flex items-baseline gap-space-md mb-1">
                <span className="font-display-lg text-display-lg font-bold text-on-surface tracking-tight leading-none">{user?.points || 742}</span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-secondary font-title-sm text-title-sm font-semibold">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span>+38 this cycle</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">+5.4% vs previous 30d</span>
                </div>
              </div>
              <p className="font-title-sm text-title-sm text-primary font-semibold mt-1">Top 4% in Distributed Systems & Architecture</p>
            </div>
            {/* Weekly Cadence Activity Grid */}
            <div className="mt-space-md pt-space-sm bg-surface-container-low/60 rounded p-space-sm border border-surface-container">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider">16-Week Research Term Cadence</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Avg: 4.8 Artifacts / Wk</span>
              </div>
              <div className="flex items-end gap-1.5 h-12 w-full pt-1">
                <div className="flex-1 bg-surface-container-highest rounded-t h-4" title="Week 1: 2 artifacts"></div>
                <div className="flex-1 bg-surface-container-highest rounded-t h-6" title="Week 2: 3 artifacts"></div>
                <div className="flex-1 bg-primary-fixed-dim rounded-t h-7" title="Week 3: 4 artifacts"></div>
                <div className="flex-1 bg-primary-fixed-dim rounded-t h-8" title="Week 4: 5 artifacts"></div>
                <div className="flex-1 bg-primary-fixed-dim rounded-t h-7" title="Week 5: 4 artifacts"></div>
                <div className="flex-1 bg-primary-container rounded-t h-9" title="Week 6: 6 artifacts"></div>
                <div className="flex-1 bg-primary-fixed-dim rounded-t h-6" title="Week 7: 3 artifacts"></div>
                <div className="flex-1 bg-primary-container rounded-t h-10" title="Week 8: Mid-Sem Review (7 artifacts)"></div>
                <div className="flex-1 bg-surface-container-highest rounded-t h-5" title="Week 9: 2 artifacts"></div>
                <div className="flex-1 bg-primary-fixed-dim rounded-t h-7" title="Week 10: 4 artifacts"></div>
                <div className="flex-1 bg-primary-container rounded-t h-9" title="Week 11: 6 artifacts"></div>
                <div className="flex-1 bg-primary-container rounded-t h-10" title="Week 12: 7 artifacts"></div>
                <div className="flex-1 bg-secondary rounded-t h-12" title="Week 13: End-Sem Sprint (9 artifacts)"></div>
                <div className="flex-1 bg-primary-container rounded-t h-8" title="Week 14: 5 artifacts"></div>
                <div className="flex-1 bg-primary-fixed-dim rounded-t h-7" title="Week 15: 4 artifacts"></div>
                <div className="flex-1 bg-secondary rounded-t h-10" title="Week 16: Final Jury (7 artifacts)"></div>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm mt-1.5 font-mono">
                <span>Term W01</span>
                <span>Mid-Review</span>
                <span>Term W16</span>
              </div>
            </div>
          </div>

          {/* Parallel Academic Status & Milestones (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-sm justify-between">
            {/* Recognition Tier & Streak Pair */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm border border-surface-container-high">
                <div className="flex items-center gap-2 mb-2 text-primary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Recognition Tier</span>
                </div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">
                  Senior Research Contributor
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                  Tier III status attested by Faculty Board (IIT Delhi & IISc Nodes).
                </p>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm border border-surface-container-high">
                <div className="flex items-center gap-2 mb-2 text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                  <span>Active Term Streak</span>
                </div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">
                  18 Consecutive Weeks
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                  Current streak active through Summer Research Term 2024.
                </p>
              </div>
            </div>

            {/* Recent Academic Milestones */}
            <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container-low">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-bold">Recent Academic Milestones</span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">All Sign-offs Verified</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low text-on-surface border border-surface-container">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">task_alt</span>
                    <span className="font-body-md text-body-md font-medium truncate">FloodSense Hydrological Surrogate Architecture Milestone Passed</span>
                  </div>
                  <span className="font-mono text-label-sm font-bold text-secondary bg-surface-container-lowest px-2 py-0.5 rounded shrink-0 ml-2 border border-surface-container-high">+20 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low text-on-surface border border-surface-container">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
                    <span className="font-body-md text-body-md font-medium truncate">Raft Consensus Byzantine Partition Proof marked as Canonical Answer</span>
                  </div>
                  <span className="font-mono text-label-sm font-bold text-secondary bg-surface-container-lowest px-2 py-0.5 rounded shrink-0 ml-2 border border-surface-container-high">+15 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low text-on-surface border border-surface-container">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">school</span>
                    <span className="font-body-md text-body-md font-medium truncate">Mentored 4 Undergrad Researchers in Rust Concurrency Primitives</span>
                  </div>
                  <span className="font-mono text-label-sm font-bold text-secondary bg-surface-container-lowest px-2 py-0.5 rounded shrink-0 ml-2 border border-surface-container-high">+10 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categorized Contribution Audit Grid (6 Core Categories) */}
        <div className="mb-space-xl">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Audited Scholarly Verticals</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Breakdown across 6 primary academic vectors monitored by consortium validators.</p>
            </div>
            <span className="hidden md:inline font-mono text-label-sm text-on-surface-variant">AGGREGATE WEIGHT: 100%</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {/* 1. Answers */}
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container-low">
                  <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">forum</span>
                  </div>
                  <span className="font-mono font-bold text-primary text-title-sm">380 pts</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Technical Answers</h3>
                <div className="mt-2 space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between"><span>Total Peer Responses:</span><span className="font-semibold text-on-surface">34</span></div>
                  <div className="flex justify-between"><span>Accepted Solutions:</span><span className="font-semibold text-secondary">21</span></div>
                  <div className="flex justify-between"><span>Faculty Endorsed:</span><span className="font-semibold text-primary">8</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs text-right border-t border-surface-container-low">
                <span className="font-label-sm text-label-sm font-bold text-primary">61.7% Acceptance Ratio</span>
              </div>
            </div>

            {/* 2. Questions */}
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container-low">
                  <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">help_center</span>
                  </div>
                  <span className="font-mono font-bold text-primary text-title-sm">95 pts</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Research Inquiries</h3>
                <div className="mt-2 space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between"><span>Inquiries Posted:</span><span className="font-semibold text-on-surface">14</span></div>
                  <div className="flex justify-between"><span>Definitively Resolved:</span><span className="font-semibold text-secondary">12</span></div>
                  <div className="flex justify-between"><span>Resolution Velocity:</span><span className="font-semibold text-on-surface">94%</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs text-right border-t border-surface-container-low">
                <span className="font-label-sm text-label-sm font-bold text-secondary">High Inquiry Quality</span>
              </div>
            </div>

            {/* 3. Projects */}
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container-low">
                  <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">science</span>
                  </div>
                  <span className="font-mono font-bold text-primary text-title-sm">140 pts</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Active Consortium Labs</h3>
                <div className="mt-2 space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between"><span>Collaborative Labs:</span><span className="font-semibold text-on-surface">3 (FloodSense, ZeroCopy, BFT)</span></div>
                  <div className="flex justify-between"><span>Completed Milestones:</span><span className="font-semibold text-secondary">6 merged</span></div>
                  <div className="flex justify-between"><span>Peer Code Reviews:</span><span className="font-semibold text-on-surface">24 PRs approved</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs text-right border-t border-surface-container-low">
                <span className="font-label-sm text-label-sm font-bold text-primary">Lead Systems Architect</span>
              </div>
            </div>

            {/* 4. Mentorship */}
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container-low">
                  <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">school</span>
                  </div>
                  <span className="font-mono font-bold text-primary text-title-sm">70 pts</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Technical Mentorship</h3>
                <div className="mt-2 space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between"><span>Mentees Supervised:</span><span className="font-semibold text-on-surface">6 Researchers</span></div>
                  <div className="flex justify-between"><span>Code Review Hours:</span><span className="font-semibold text-secondary">42 Clocked Hours</span></div>
                  <div className="flex justify-between"><span>Departmental Cohorts:</span><span className="font-semibold text-on-surface">IITD BTech Y2/Y3</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs text-right border-t border-surface-container-low">
                <span className="font-label-sm text-label-sm font-bold text-secondary">100% Milestone Completion</span>
              </div>
            </div>

            {/* 5. Resources */}
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container-low">
                  <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">dataset</span>
                  </div>
                  <span className="font-mono font-bold text-primary text-title-sm">35 pts</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Datasets & Proof Templates</h3>
                <div className="mt-2 space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between"><span>Published Artifacts:</span><span className="font-semibold text-on-surface">9 Datasets & LaTeX</span></div>
                  <div className="flex justify-between"><span>Consortium Downloads:</span><span className="font-semibold text-secondary">320 Across 14 Nodes</span></div>
                  <div className="flex justify-between"><span>Zenodo/DOI Synced:</span><span className="font-semibold text-on-surface">4 Repositories</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs text-right border-t border-surface-container-low">
                <span className="font-label-sm text-label-sm font-bold text-primary">Open Science CC BY 4.0</span>
              </div>
            </div>

            {/* 6. Endorsements */}
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container-low">
                  <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">approval</span>
                  </div>
                  <span className="font-mono font-bold text-primary text-title-sm">22 pts</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">Faculty Attestations</h3>
                <div className="mt-2 space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between"><span>Tenured Endorsements:</span><span className="font-semibold text-primary">7 Faculty Heads</span></div>
                  <div className="flex justify-between"><span>Partner Institutions:</span><span className="font-semibold text-on-surface">IITR, IITD, BITS Pilani</span></div>
                  <div className="flex justify-between"><span>Peer Commendations:</span><span className="font-semibold text-secondary">22 Senior Fellows</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs text-right border-t border-surface-container-low">
                <span className="font-label-sm text-label-sm font-bold text-secondary">Cryptographically Signed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Methodology Panel */}
        <div className="bg-surface-container-low rounded-lg p-space-lg mb-space-xl border border-surface-container" id="methodology-panel">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm mb-space-md border-b border-surface-container-high">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">balance</span>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Contribution Index Methodology & Weighting</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                CampusLink scores operate strictly under peer-reviewed academic integrity protocols, not commercial engagement gamification.
              </p>
            </div>
            <span className="font-mono text-label-sm font-bold bg-surface-container-highest px-3 py-1.5 rounded text-on-surface-variant shrink-0">
              PROTOCOL SPEC v3.2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md mb-space-md">
            <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-1">
                <span className="font-title-sm text-title-sm font-bold text-on-surface">Useful Answers</span>
                <span className="font-mono text-label-sm font-bold text-primary bg-surface-container px-2 py-0.5 rounded">+5 pts</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Triggered when a technical answer accumulates ≥3 affirmative verifications from verified graduate or faculty accounts.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-1">
                <span className="font-title-sm text-title-sm font-bold text-on-surface">Accepted Solution</span>
                <span className="font-mono text-label-sm font-bold text-primary bg-surface-container px-2 py-0.5 rounded">+10 to +15 pts</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Designated by the inquiry author or course coordinator as the definitive resolution with reproducible code or proofs.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-1">
                <span className="font-title-sm text-title-sm font-bold text-on-surface">Project Milestones</span>
                <span className="font-mono text-label-sm font-bold text-primary bg-surface-container px-2 py-0.5 rounded">+15 to +30 pts</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Audited pull requests, hardware schematics, or benchmark datasets merged into active Consortium Workspaces.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-1">
                <span className="font-title-sm text-title-sm font-bold text-on-surface">Technical Mentorship</span>
                <span className="font-mono text-label-sm font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">+10 pts / milestone</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Structured academic guidance, peer debugging sessions, and code reviews verified by participating scholars.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-1">
                <span className="font-title-sm text-title-sm font-bold text-on-surface">Faculty Attestation</span>
                <span className="font-mono text-label-sm font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">+20 pts multiplier</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Explicit endorsement or co-citation by tenured faculty or lab directors, sealing cryptographic node provenance.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-1">
                <span className="font-title-sm text-title-sm font-bold text-error">Integrity Penalty</span>
                <span className="font-mono text-label-sm font-bold text-error bg-error-container/40 px-2 py-0.5 rounded">-100 pts / Revocation</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Applied automatically upon confirmed AI hallucination without disclosure, plagiarism, or coordinated voting rings.
              </p>
            </div>
          </div>
        </div>

        {/* Chronological Contribution Provenance Ledger */}
        <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm border border-surface-container-high mb-space-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm mb-space-md border-b border-surface-container-low">
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Chronological Provenance Ledger</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Immutable chronological event trail synced with partner university nodes.</p>
            </div>
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded border border-surface-container">
              {[
                { id: "all", label: "All Events" },
                { id: "answers", label: "Answers" },
                { id: "projects", label: "Projects" },
                { id: "mentorship", label: "Mentorship" },
                { id: "endorsements", label: "Endorsements" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveLedgerCategory(btn.id)}
                  className={`px-3 py-1 rounded text-title-sm font-title-sm transition-colors ${
                    activeLedgerCategory === btn.id
                      ? "bg-surface-container-lowest text-primary font-bold shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Event Rows */}
          <div className="flex flex-col gap-space-sm">
            {filteredRows.map((row) => (
              <div key={row.id} className="p-space-md rounded-md bg-surface-container-low/40 hover:bg-surface-container-low transition-colors flex flex-col md:flex-row md:items-center justify-between gap-space-sm border border-surface-container">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-label-sm text-on-surface-variant">{row.date}</span>
                      <span className="px-2 py-0.2 rounded bg-surface-container font-label-sm text-label-sm text-primary font-bold uppercase">{row.tag}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">· {row.subhead}</span>
                    </div>
                    <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">
                      {row.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 font-body-sm text-body-sm text-on-surface-variant">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{row.inquiry}</span>
                      <span>·</span>
                      <span className="text-secondary font-medium">{row.endorsement}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0">
                  <span className="font-mono text-label-sm text-on-surface-variant">{row.tx}</span>
                  <span className="font-mono font-bold text-title-sm text-secondary bg-surface-container-lowest px-2.5 py-1 rounded shadow-xs border border-surface-container-high">{row.pts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Seal & Consortium Attestation Footer */}
        <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant border border-surface-container">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0 border border-surface-container-high">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">Cryptographic Provenance Verified</span>
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              </div>
              <p className="font-mono text-label-sm text-on-surface-variant break-all">
                Academic Provenance Hash: 0x9f88c3a71b2d0012e84...71ca · Synced across NKN Mesh Nodes
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant block">Governed under CC BY-NC-SA 4.0</span>
            <span className="font-label-sm text-label-sm text-primary font-semibold">CampusLink Academic Consortium Standards Board</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionPage;
