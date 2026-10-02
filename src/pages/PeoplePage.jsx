import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const PeoplePage = () => {
  const navigate = useNavigate();
  const { users, sendConnectionRequest, connections } = useApp();

  const [activeRole, setActiveRole] = useState("all");
  const [activeDept, setActiveDept] = useState("Computer Science & Eng.");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Top Consortium Institutional Trust Banner */}
      <div className="w-full bg-surface-container-low px-space-lg py-2 flex flex-wrap items-center justify-between text-on-surface-variant font-label-md text-label-md">
        <div className="flex items-center gap-space-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-primary uppercase tracking-wider">
            <span className="material-symbols-outlined text-secondary text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            Consortium Trust Node
          </span>
          <span className="text-outline-variant">|</span>
          <span>Inter-University Academic Exchange Protocol (IN-NKN v4.2)</span>
          <span className="hidden md:inline text-outline-variant">•</span>
          <span className="hidden md:inline">142 Verified Institutions Active</span>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="font-mono text-outline">HASH: 0x9e2c...b17f</span>
          <span className="inline-flex items-center gap-1 text-secondary font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Synchronized with National Knowledge Network
          </span>
        </div>
      </div>

      {/* Main Content Layout Area */}
      <div className="px-space-lg py-space-md max-w-[1400px] w-full mx-auto">
        {/* Breadcrumb & Title Section */}
        <div className="flex flex-col gap-1 mb-space-md">
          <nav className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
            <span onClick={() => navigate("/")} className="hover:text-primary cursor-pointer transition-colors">Academic Network</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Discover</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Find People</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-sm">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif">Find People</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
                Connect with verified scholars, research collaborators, and faculty across 140+ Indian academic consortium institutions.
              </p>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="bg-surface-container px-space-sm py-1 rounded flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-label-md text-label-md text-on-surface">12,480 Verified Scholars across Consortium</span>
              </div>
              <button className="bg-surface-container-lowest text-on-surface px-space-sm py-1 rounded shadow-sm hover:bg-surface-container transition-colors flex items-center gap-1 font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                Export Index
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Fast Role Toggles */}
        <div className="bg-surface-container-lowest p-space-md rounded shadow-sm mb-space-md flex flex-col gap-space-sm border border-surface-container-high">
          <div className="flex flex-col md:flex-row items-center gap-space-sm">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person_search</span>
              <input
                className="w-full pl-10 pr-24 py-2 bg-surface-container-low rounded text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high"
                id="scholar-search-input"
                placeholder="Search by scholar name, publication topic, laboratory skill, or grant title..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-container px-2 py-0.5 rounded font-label-sm text-label-sm text-on-surface-variant font-mono">⌘K</span>
            </div>
            <div className="flex items-center gap-space-xs w-full md:w-auto shrink-0">
              <button className="px-space-md py-2 bg-primary text-on-primary rounded font-label-lg text-label-lg hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">search</span>
                Search Index
              </button>
              <button
                onClick={() => setSearchQuery("")}
                className="p-2 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded transition-all border border-surface-container-high"
                title="Clear Filters"
              >
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Quick Role Pills & Fast Facet Counters */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-1">
            <div className="flex flex-wrap items-center gap-space-xs" id="role-pill-group">
              <button
                onClick={() => setActiveRole("all")}
                className={`px-space-sm py-1 rounded font-label-md text-label-md transition-all ${
                  activeRole === "all" ? "bg-primary text-on-primary font-semibold" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                All Roles (12,480)
              </button>
              <button
                onClick={() => setActiveRole("student")}
                className={`px-space-sm py-1 rounded font-label-md text-label-md transition-all ${
                  activeRole === "student" ? "bg-primary text-on-primary font-semibold" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                Students (8,310)
              </button>
              <button
                onClick={() => setActiveRole("faculty")}
                className={`px-space-sm py-1 rounded font-label-md text-label-md transition-all ${
                  activeRole === "faculty" ? "bg-primary text-on-primary font-semibold" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                Staff &amp; Faculty (1,840)
              </button>
              <button
                onClick={() => setActiveRole("fellows")}
                className={`px-space-sm py-1 rounded font-label-md text-label-md transition-all ${
                  activeRole === "fellows" ? "bg-primary text-on-primary font-semibold" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                Research Fellows (2,330)
              </button>
            </div>
            <div className="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input defaultChecked className="w-3.5 h-3.5 accent-primary rounded cursor-pointer" type="checkbox" />
                <span>Staff Verified Only</span>
              </label>
              <span className="text-outline-variant">•</span>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input defaultChecked className="w-3.5 h-3.5 accent-secondary rounded cursor-pointer" type="checkbox" />
                <span>.ac.in Verified Domain</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Grid: 3 Columns [Filters lg:col-span-3 | Content Grid lg:col-span-6 | Right Intelligence Rail lg:col-span-3] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          {/* COLUMN 1: Detailed Filter Sidebar (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-space-sm bg-surface-container-lowest p-space-md rounded shadow-sm border border-surface-container-high">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
              <div className="flex items-center gap-1.5 text-primary font-title-sm text-title-sm font-semibold">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Refine Directory</span>
              </div>
              <button className="font-label-sm text-label-sm text-primary hover:underline">Reset</button>
            </div>

            {/* Filter 1: Department */}
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wide font-semibold">Academic Department</label>
              <select
                className="w-full bg-surface-container-low py-1.5 px-2.5 rounded text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-container-high cursor-pointer"
                value={activeDept}
                onChange={(e) => setActiveDept(e.target.value)}
              >
                <option value="All">All Engineering &amp; Sciences</option>
                <option value="Computer Science & Eng.">Computer Science &amp; Eng.</option>
                <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                <option value="Mathematics & Computing">Mathematics &amp; Computing</option>
                <option value="Computational Data Sciences">Computational Data Sciences</option>
                <option value="Mechanical & Aerospace">Mechanical &amp; Aerospace</option>
                <option value="Biotechnology & Bio-Eng.">Biotechnology &amp; Bio-Eng.</option>
              </select>
            </div>

            {/* Filter 2: Institution Node */}
            <div className="flex flex-col gap-1 pt-1">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wide font-semibold">Institution Node</label>
              <select className="w-full bg-surface-container-low py-1.5 px-2.5 rounded text-on-surface font-body-sm text-body-sm focus:outline-none border border-surface-container-high cursor-pointer">
                <option>All Tier-1 Consortium Nodes</option>
                <option>IIT Delhi (Main Hub)</option>
                <option>IIT Bombay</option>
                <option>IISc Bangalore</option>
                <option>BITS Pilani (All Campuses)</option>
                <option>IIIT Hyderabad</option>
                <option>NIT Trichy</option>
                <option>IIT Madras</option>
              </select>
            </div>

            {/* Filter 3: Academic Cohort */}
            <div className="flex flex-col gap-1 pt-1">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wide font-semibold">Academic Cohort</label>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm cursor-pointer hover:text-primary">
                  <input defaultChecked className="accent-primary w-3.5 h-3.5" type="checkbox" />
                  <span>Ph.D. Scholars / Postdocs</span>
                  <span className="ml-auto text-outline font-mono text-[11px]">2,140</span>
                </label>
                <label className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm cursor-pointer hover:text-primary">
                  <input defaultChecked className="accent-primary w-3.5 h-3.5" type="checkbox" />
                  <span>M.Tech / M.S. by Research</span>
                  <span className="ml-auto text-outline font-mono text-[11px]">3,420</span>
                </label>
                <label className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm cursor-pointer hover:text-primary">
                  <input defaultChecked className="accent-primary w-3.5 h-3.5" type="checkbox" />
                  <span>Senior UG (3rd &amp; 4th Year)</span>
                  <span className="ml-auto text-outline font-mono text-[11px]">4,890</span>
                </label>
                <label className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm cursor-pointer hover:text-primary">
                  <input class="accent-primary w-3.5 h-3.5" type="checkbox" />
                  <span>Faculty &amp; Principal Investigators</span>
                  <span className="ml-auto text-outline font-mono text-[11px]">1,840</span>
                </label>
              </div>
            </div>

            {/* Filter 4: Domain Specialization */}
            <div className="flex flex-col gap-1 pt-1">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wide font-semibold">Domain Specialization</label>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-primary font-medium cursor-pointer">Distributed Systems</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-on-surface-variant cursor-pointer">Indic NLP</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-on-surface-variant cursor-pointer">Optimization</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-on-surface-variant cursor-pointer">Embedded / VLSI</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container font-label-sm text-label-sm text-on-surface-variant cursor-pointer">Robotics SLAM</span>
              </div>
            </div>

            {/* Verification Seal Box */}
            <div className="p-space-sm rounded bg-surface-container-low mt-space-xs flex flex-col gap-1 border border-surface-container-high">
              <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm uppercase font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Authenticity Assured
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
                Profiles carry institutional cryptographic verification linked to university registries.
              </p>
            </div>
          </div>

          {/* COLUMN 2: Structured Profile Cards Grid (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col gap-space-md">
            {/* Sorting and Counter Header */}
            <div className="bg-surface-container-lowest px-space-md py-2 rounded shadow-sm flex items-center justify-between border border-surface-container-high">
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                Showing <strong className="text-on-surface font-semibold">6 Scholars</strong> matched to your current research interests
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                <span>Sort by:</span>
                <select className="bg-surface-container-low py-1 px-2 rounded font-label-md text-label-md text-primary font-medium focus:outline-none border border-surface-container-high">
                  <option>Relevance &amp; Match %</option>
                  <option>Contribution Karma (Desc)</option>
                  <option>Accepted Answers</option>
                  <option>Active Collaborative Sprints</option>
                </select>
              </div>
            </div>

            {/* PROFILE 1: Devavrat Saxena */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col gap-space-sm border border-surface-container-high">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary-container flex items-center justify-center text-on-primary">
                    <span className="font-title-md font-bold">DS</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 onClick={() => navigate("/people/usr-1")} className="font-title-md text-title-md text-on-surface leading-snug font-semibold hover:text-primary cursor-pointer">
                        Devavrat Saxena
                      </h2>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-secondary text-[14px]">verified</span>
                        .ac.in Verified Scholar
                      </span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[15px] text-outline">school</span>
                      <span>Ph.D. Scholar · Distributed Systems · IIT Delhi</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 bg-surface-container-low px-2 py-1 rounded text-right flex items-center gap-1 text-secondary font-label-sm text-label-sm border border-surface-container-high">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>91% match for your project</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Investigating Byzantine fault tolerance in asynchronous storage engines. Authoring proofs in TLA+ for multi-master consensus across constrained edge gateways.
              </p>
              <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">Rust</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">Raft Consensus</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">Distributed Systems</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">TLA+</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">eBPF</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded grid grid-cols-4 gap-space-xs text-center border border-surface-container-high">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Karma</span>
                  <span className="font-title-sm text-title-sm text-primary font-bold">2,420 pts</span>
                  <span className="font-label-sm text-[10px] text-secondary">Top 1% Peer</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Accepted Q&amp;A</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">48 accepted</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">19 faculty endorsed</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Consortium Sprints</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">7 projects</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Lead Maintainer</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Peer Reviews</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">34 validations</span>
                  <span className="font-label-sm text-[10px] text-secondary">99.2% Accuracy</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 font-label-md text-label-md text-secondary">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Available for Q2 Research Sprints</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button onClick={() => navigate("/messages")} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded" title="Send Scholarly Message">
                    <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                  </button>
                  <button onClick={() => navigate("/people/usr-1")} className="px-space-sm py-1 bg-surface-container-low text-on-surface hover:bg-surface-container rounded font-label-md text-label-md border border-surface-container-high">
                    View Profile
                  </button>
                  <button onClick={() => sendConnectionRequest("usr-1")} className="px-space-md py-1 bg-primary text-on-primary hover:bg-primary-container rounded font-label-md text-label-md transition-colors shadow-sm font-semibold">
                    Connect
                  </button>
                </div>
              </div>
            </div>

            {/* PROFILE 2: Dr. Rohini Ramanathan */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col gap-space-sm border border-surface-container-high">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-tertiary-container text-on-tertiary flex items-center justify-center font-title-md font-bold">
                    RR
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 onClick={() => navigate("/people/usr-2")} className="font-title-md text-title-md text-on-surface leading-snug font-semibold hover:text-primary cursor-pointer">
                        Dr. Rohini Ramanathan
                      </h2>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-tertiary text-[14px]">stars</span>
                        Faculty Verified PI
                      </span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[15px] text-outline">business_center</span>
                      <span>Associate Professor · AI &amp; Speech · IIT Bombay</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 bg-surface-container-low px-2 py-1 rounded text-right flex items-center gap-1 text-secondary font-label-sm text-label-sm border border-surface-container-high">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>88% match for Indic LLM Research</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Leading the Multilingual Audio &amp; NLP Lab. Currently supervising cross-campus efforts in low-resource dialect speech models under the National Language Mission.
              </p>
              <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">PyTorch</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">Speech Processing</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">Indic NLP</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">Transformer Architecture</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded grid grid-cols-4 gap-space-xs text-center border border-surface-container-high">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Karma</span>
                  <span className="font-title-sm text-title-sm text-primary font-bold">4,180 pts</span>
                  <span className="font-label-sm text-[10px] text-tertiary-container font-semibold">Distinguished PI</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Endorsements</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">112 formal</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Council Verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Research Projects</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">14 grants</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">₹4.2 Cr Consortium</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Scholars Mentored</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">28 active</span>
                  <span className="font-label-sm text-[10px] text-secondary">3 Campuses</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 font-label-md text-label-md text-tertiary-container font-medium">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
                  <span>Mentoring 2 Teams · Advisory Only</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button onClick={() => navigate("/mentorship")} className="px-space-sm py-1 bg-surface-container-low text-on-surface hover:bg-surface-container rounded font-label-md text-label-md border border-surface-container-high">
                    Lab Dossier
                  </button>
                  <button onClick={() => navigate("/mentorship")} className="px-space-md py-1 bg-primary text-on-primary hover:bg-primary-container rounded font-label-md text-label-md transition-colors shadow-sm font-semibold">
                    Request Mentorship
                  </button>
                </div>
              </div>
            </div>

            {/* PROFILE 3: Kabir Sen */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col gap-space-sm border border-surface-container-high">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary-container flex items-center justify-center text-on-primary font-title-md font-bold">
                    KS
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 onClick={() => navigate("/people/usr-3")} className="font-title-md text-title-md text-on-surface leading-snug font-semibold hover:text-primary cursor-pointer">
                        Kabir Sen
                      </h2>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-secondary text-[14px]">verified</span>
                        .ac.in Verified Scholar
                      </span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[15px] text-outline">school</span>
                      <span>4th Year B.Tech CSE · BITS Pilani (Goa)</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 bg-surface-container-low px-2 py-1 rounded text-right flex items-center gap-1 text-secondary font-label-sm text-label-sm border border-surface-container-high">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>94% match for FloodSense</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Working on edge-embedded telemetry arrays and Kalman filters for disaster hydrometric sensor networks. High-throughput CUDA signal acceleration.
              </p>
              <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">C++</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">CUDA</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">Sensor Fusion</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface">Embedded Systems</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded grid grid-cols-4 gap-space-xs text-center border border-surface-container-high">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Karma</span>
                  <span className="font-title-sm text-title-sm text-primary font-bold">1,650 pts</span>
                  <span className="font-label-sm text-[10px] text-secondary">Top 5% UG</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Accepted Answers</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">34 accepted</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">8 hardware verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Projects</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">5 sprints</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">2 Open Source PIs</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Peer Validation</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold">21 reviews</span>
                  <span className="font-label-sm text-[10px] text-secondary">Verified Firmware</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 font-label-md text-label-md text-secondary">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>Available for Cross-Campus Projects</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button onClick={() => navigate("/people/usr-3")} className="px-space-sm py-1 bg-surface-container-low text-on-surface hover:bg-surface-container rounded font-label-md text-label-md border border-surface-container-high">
                    View Profile
                  </button>
                  <button onClick={() => sendConnectionRequest("usr-3")} className="px-space-md py-1 bg-primary text-on-primary hover:bg-primary-container rounded font-label-md text-label-md transition-colors shadow-sm font-semibold">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Right Intelligence Rail (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-space-md">
            {/* Faculty Mentors Spotlight */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm border border-surface-container-high space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
                <span className="font-title-sm text-title-sm text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Faculty Mentors
                </span>
                <span onClick={() => navigate("/mentorship")} className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer">
                  All (48)
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1 border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Prof. G. Krishnamurthy</span>
                  </div>
                  <div className="text-on-surface-variant text-[11px]">IISc Bangalore · Systems</div>
                  <div className="text-outline text-[10px]">Advising 2 active PhD grants in non-volatile memory architectures.</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="px-1.5 py-0.5 bg-secondary-container/40 text-on-secondary-container rounded font-mono text-[9px] font-semibold">Open to Mentorship</span>
                    <button onClick={() => navigate("/mentorship")} className="text-primary font-bold hover:underline">Request</button>
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1 border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Dr. Ananya Ganguly</span>
                  </div>
                  <div className="text-on-surface-variant text-[11px]">IIT Delhi · Comp Bio</div>
                  <div className="text-outline text-[10px]">Open to co-supervising graph neural nets on protein folding.</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="px-1.5 py-0.5 bg-surface-container-highest text-primary rounded font-mono text-[9px] font-semibold">Sprint Advisor</span>
                    <button onClick={() => navigate("/mentorship")} className="text-primary font-bold hover:underline">Request</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Consortium Guidelines */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm border border-surface-container-high space-y-3">
              <div className="flex items-center gap-1.5 font-title-sm text-title-sm text-on-surface font-bold border-b border-surface-container-low pb-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">gavel</span>
                <span>Consortium Guidelines</span>
              </div>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>CC BY-NC 4.0:</strong> All shared test vectors and benchmark logs exceeding 40 hours require academic attribution.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Authorship Parity:</strong> Sprints fall under non-commercial academic attribution.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
