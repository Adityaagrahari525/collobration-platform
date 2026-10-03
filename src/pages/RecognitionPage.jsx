import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const RecognitionPage = () => {
  const navigate = useNavigate();
  const { users } = useApp();

  const [activeDomain, setActiveDomain] = useState("all");
  const [activeCategoryTab, setActiveCategoryTab] = useState("cat-ai");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <div className="px-space-lg py-space-md max-w-[1360px] mx-auto w-full space-y-space-lg">
        {/* Breadcrumb & Top Metas */}
        <section className="flex flex-col gap-space-xs">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2">
            <span onClick={() => navigate("/")} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Academic Network</span>
            <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
            <span onClick={() => navigate("/communities")} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Community</span>
            <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
            <span className="font-label-sm text-label-sm text-primary font-semibold">Recognition &amp; Impact</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mt-1">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif">Community Recognition</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
                Honoring scholarly contributions, peer validation, and open academic research across 140+ consortium institutions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-sm">
              <div className="inline-flex items-center gap-2 px-space-sm py-1.5 rounded bg-surface-container text-on-surface text-body-sm font-label-md border border-surface-container-high">
                <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                <span>Quarterly Cycle: Q2 2024 (April – June)</span>
                <div className="relative group cursor-pointer inline-flex items-center">
                  <span className="material-symbols-outlined text-[16px] text-outline hover:text-primary transition-colors">info</span>
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-inverse-surface text-inverse-on-surface text-body-sm font-body-sm rounded shadow-xl z-30 pointer-events-none">
                    Recognitions update weekly based on verified peer reviews, accepted technical solutions, and project milestones.
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md shadow-sm border border-surface-container-high">
                <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                <span>Export Archive</span>
              </button>
            </div>
          </div>
        </section>

        {/* Search & Domain Filter Toolbar */}
        <section className="bg-surface-container-lowest rounded p-space-md shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md border border-surface-container-high">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              className="w-full pl-9 pr-4 py-2 rounded bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-all border border-surface-container-high"
              id="scholar-search-input"
              placeholder="Filter by scholar name, researcher ID, or focus..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" id="domain-filter-group">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mr-2 hidden sm:inline">Filter Domain:</span>
            <button
              onClick={() => setActiveDomain("all")}
              className={`domain-btn px-3 py-1.5 rounded font-label-md text-label-md transition-colors ${
                activeDomain === "all" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              All Domains
            </button>
            <button
              onClick={() => setActiveDomain("ai")}
              className={`domain-btn px-3 py-1.5 rounded font-label-md text-label-md transition-colors ${
                activeDomain === "ai" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              AI / ML
            </button>
            <button
              onClick={() => setActiveDomain("systems")}
              className={`domain-btn px-3 py-1.5 rounded font-label-md text-label-md transition-colors ${
                activeDomain === "systems" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Systems &amp; Web
            </button>
            <button
              onClick={() => setActiveDomain("research")}
              className={`domain-btn px-3 py-1.5 rounded font-label-md text-label-md transition-colors ${
                activeDomain === "research" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Applied Research
            </button>
            <button
              onClick={() => setActiveDomain("faculty")}
              className={`domain-btn px-3 py-1.5 rounded font-label-md text-label-md transition-colors ${
                activeDomain === "faculty" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Faculty PIs
            </button>
          </div>
        </section>

        {/* Scholarly Progress Benchmark Panel */}
        <section className="bg-surface-container-lowest rounded p-space-lg shadow-sm relative overflow-hidden border border-surface-container-high">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg">
            <div className="space-y-space-xs max-w-xl">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Cohort Calibration</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                  Computer Science &amp; Engineering • Distributed Systems
                </span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Node Authenticated
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-serif font-bold">My Scholarly Progress</h2>
              <p className="font-body-md text-body-md text-on-surface">
                Your technical contribution score is currently ahead of <strong className="text-primary font-semibold">72% of active peer contributors</strong> within your selected domain node.
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed pt-1">
                Benchmarking is calibrated against verified <span className="font-semibold text-on-surface">.ac.in</span> activity to assist research matching and faculty mentorship eligibility. It is never utilized for punitive academic evaluation.
              </p>
            </div>
            {/* Metric Cluster */}
            <div className="w-full xl:w-auto grid grid-cols-2 sm:grid-cols-4 gap-space-sm sm:gap-space-md font-mono">
              <div className="bg-surface-container-low p-space-sm sm:p-space-md rounded flex flex-col justify-between border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-1 font-sans">
                  <span className="font-label-sm text-label-sm">Score</span>
                  <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
                </div>
                <div className="font-headline-sm text-headline-sm text-primary font-semibold font-serif">742 pts</div>
                <span className="font-label-sm text-label-sm text-secondary mt-1">Top 28% Cohort</span>
              </div>
              <div className="bg-surface-container-low p-space-sm sm:p-space-md rounded flex flex-col justify-between border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-1 font-sans">
                  <span className="font-label-sm text-label-sm">Solutions</span>
                  <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-semibold font-serif">14</div>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-sans">Formally Accepted</span>
              </div>
              <div className="bg-surface-container-low p-space-sm sm:p-space-md rounded flex flex-col justify-between border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-1 font-sans">
                  <span className="font-label-sm text-label-sm">Repositories</span>
                  <span className="material-symbols-outlined text-[16px] text-outline">source</span>
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-semibold font-serif">3</div>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-sans">Active Sprints</span>
              </div>
              <div className="bg-surface-container-low p-space-sm sm:p-space-md rounded flex flex-col justify-between border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-1 font-sans">
                  <span className="font-label-sm text-label-sm">Endorsements</span>
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container">military_tech</span>
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-semibold font-serif">4</div>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-sans">Faculty Endorsed</span>
              </div>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest border-t border-surface-container-low">
            <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-outline">sync</span>
              <span>Last synchronized with IIT Delhi Node: Today, 08:30 IST</span>
            </div>
            <a onClick={(e) => { e.preventDefault(); navigate("/profile"); }} className="inline-flex items-center gap-1 text-primary hover:underline font-label-md text-label-md cursor-pointer" href="#">
              <span>View full contribution breakdown</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* Main Recognition Content & Integrity Dual Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Primary Recognition Tables (8 Columns) */}
          <section className="xl:col-span-8 space-y-space-md">
            {/* Category Selector Tab Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-surface-container-lowest p-space-xs rounded shadow-sm border border-surface-container-high">
              <button
                onClick={() => setActiveCategoryTab("cat-ai")}
                className={`category-tab px-3 py-2 rounded font-label-md text-label-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategoryTab === "cat-ai" ? "bg-surface-container text-primary font-semibold shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">neurology</span>
                <span>AI / ML</span>
              </button>
              <button
                onClick={() => setActiveCategoryTab("cat-systems")}
                className={`category-tab px-3 py-2 rounded font-label-md text-label-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategoryTab === "cat-systems" ? "bg-surface-container text-primary font-semibold shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">dns</span>
                <span>Web &amp; Systems</span>
              </button>
              <button
                onClick={() => setActiveCategoryTab("cat-research")}
                className={`category-tab px-3 py-2 rounded font-label-md text-label-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategoryTab === "cat-research" ? "bg-surface-container text-primary font-semibold shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Research</span>
              </button>
            </div>

            {/* CATEGORY TABLE */}
            <div className="bg-surface-container-lowest rounded shadow-sm overflow-hidden border border-surface-container-high">
              <div className="px-space-md py-space-sm bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    {activeCategoryTab === "cat-systems" ? "dns" : activeCategoryTab === "cat-research" ? "menu_book" : "neurology"}
                  </span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-serif font-bold">
                      {activeCategoryTab === "cat-systems"
                        ? "Top Web & Distributed Systems Contributors"
                        : activeCategoryTab === "cat-research"
                        ? "Top Peer-Reviewed Research Scholars"
                        : "Top AI/ML Contributors"}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {activeCategoryTab === "cat-systems"
                        ? "Fault-tolerant consensus, low-power LoRaWAN networks, and cloud architecture"
                        : activeCategoryTab === "cat-research"
                        ? "Formal verifications, preprints archived, and reproducible laboratory benchmarks"
                        : "Validated neural architectures, reproducible checkpoints, and algorithmic peer solutions"}
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">Q2 2024 Cycle</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                      <th className="py-2.5 px-space-md w-14 font-semibold">Rank</th>
                      <th className="py-2.5 px-space-md font-semibold">Scholar &amp; Credential</th>
                      <th className="py-2.5 px-space-md font-semibold">Institution</th>
                      <th className="py-2.5 px-space-md font-semibold">Primary Focus</th>
                      <th className="py-2.5 px-space-md text-right font-semibold">Score</th>
                      <th className="py-2.5 px-space-md font-semibold">Substantive Impact</th>
                      <th className="py-2.5 px-space-md text-right w-24 font-semibold">Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low font-body-sm text-body-sm text-on-surface">
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-space-md font-label-md text-label-md text-on-surface">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container font-semibold text-primary font-mono">#1</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <div onClick={() => navigate("/people/usr-2")} className="font-title-sm text-title-sm text-primary font-semibold hover:underline cursor-pointer">
                          {activeCategoryTab === "cat-systems" ? "Dr. Rajesh K. Varma" : "Dr. Rohini Ramanathan"}
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Faculty PI • Systems &amp; AI</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium">IIT Delhi</span>
                      </td>
                      <td className="py-3 px-space-md text-on-surface-variant">
                        {activeCategoryTab === "cat-systems" ? "Distributed Consensus" : "Physics-informed GNNs"}
                      </td>
                      <td className="py-3 px-space-md text-right font-semibold text-primary font-label-md font-mono">4,180</td>
                      <td className="py-3 px-space-md">
                        <div className="font-label-sm text-label-sm text-secondary font-medium">54 accepted • 9 papers</div>
                        <span className="text-[11px] text-on-surface-variant font-mono">54 citations indexed</span>
                      </td>
                      <td className="py-3 px-space-md text-right">
                        <button onClick={() => navigate("/people/usr-2")} className="text-primary hover:text-primary-container font-label-sm text-label-sm underline cursor-pointer">Profile</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-space-md font-label-md text-label-md text-on-surface">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container font-semibold text-on-surface font-mono">#2</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <div onClick={() => navigate("/people/usr-1")} className="font-title-sm text-title-sm text-on-surface font-semibold hover:text-primary cursor-pointer">Devavrat Saxena</div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Ph.D. Scholar • Vision Lab</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium">IIT Bombay</span>
                      </td>
                      <td className="py-3 px-space-md text-on-surface-variant">Self-Supervised Vision Transformers</td>
                      <td className="py-3 px-space-md text-right font-semibold text-primary font-label-md font-mono">3,640</td>
                      <td className="py-3 px-space-md">
                        <div className="font-label-sm text-label-sm text-secondary font-medium">41 accepted • 4 models</div>
                        <span className="text-[11px] text-on-surface-variant font-mono">HuggingFace verified node</span>
                      </td>
                      <td className="py-3 px-space-md text-right">
                        <button onClick={() => navigate("/people/usr-1")} className="text-primary hover:text-primary-container font-label-sm text-label-sm underline cursor-pointer">Profile</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-space-md font-label-md text-label-md text-on-surface">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container font-semibold text-on-surface font-mono">#3</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <div onClick={() => navigate("/people/5bd56243-ac60-4b69-8412-5ad8e20862fe")} className="font-title-sm text-title-sm text-on-surface font-semibold hover:text-primary cursor-pointer">
                          Ananya Iyer
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">M.Tech AI Candidate • Edge Systems</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium">IIT Bombay</span>
                      </td>
                      <td className="py-3 px-space-md text-on-surface-variant">Edge Computer Vision &amp; Remote Sensing</td>
                      <td className="py-3 px-space-md text-right font-semibold text-primary font-label-md font-mono">3,110</td>
                      <td className="py-3 px-space-md">
                        <div className="font-label-sm text-label-sm text-secondary font-medium">38 accepted • 12 datasets</div>
                        <span className="text-[11px] text-on-surface-variant font-mono">Verified Research Node</span>
                      </td>
                      <td className="py-3 px-space-md text-right">
                        <button onClick={() => navigate("/people/5bd56243-ac60-4b69-8412-5ad8e20862fe")} className="text-primary hover:text-primary-container font-label-sm text-label-sm underline cursor-pointer">Profile</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-space-md font-label-md text-label-md text-on-surface">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface-container-low font-semibold text-outline font-mono">#4</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <div onClick={() => navigate("/people/4a567a2c-87c1-42ba-a16f-b131e99b9b06")} className="font-title-sm text-title-sm text-on-surface font-semibold hover:text-primary cursor-pointer">
                          Rohan Verma
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Dual Degree Research Fellow</span>
                      </td>
                      <td className="py-3 px-space-md">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-medium">IIIT Hyderabad</span>
                      </td>
                      <td className="py-3 px-space-md text-on-surface-variant">Distributed Consensus &amp; DB Storage</td>
                      <td className="py-3 px-space-md text-right font-semibold text-primary font-label-md font-mono">2,870</td>
                      <td className="py-3 px-space-md">
                        <div className="font-label-sm text-label-sm text-secondary font-medium">29 accepted • 6 notebooks</div>
                        <span className="text-[11px] text-on-surface-variant font-mono">Artifact Certified</span>
                      </td>
                      <td className="py-3 px-space-md text-right">
                        <button onClick={() => navigate("/people/4a567a2c-87c1-42ba-a16f-b131e99b9b06")} className="text-primary hover:text-primary-container font-label-sm text-label-sm underline cursor-pointer">Profile</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Sidebar Guidelines & Calibration Methodology (4 Columns) */}
          <aside className="xl:col-span-4 flex flex-col gap-space-md">
            {/* Calibration Methodology Panel */}
            <div className="bg-surface-container-lowest border border-surface-container-high rounded p-space-md shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 font-title-sm text-title-sm text-primary font-bold border-b border-surface-container-low pb-2 font-serif">
                <span className="material-symbols-outlined text-[18px]">balance</span>
                <span>Calibration Methodology</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                CampusLink metrics are designed to discourage superficial forum volume. Score weighting is governed strictly through verifiable scholarly utility:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-surface-container-low rounded border border-surface-container-high">
                  <div className="font-bold text-on-surface">1. Peer-Reviewed Technical Solutions</div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">Solutions accepted by verified researchers carry a 3.5× weight compared to unverified upvotes.</div>
                </div>
                <div className="p-2 bg-surface-container-low rounded border border-surface-container-high">
                  <div className="font-bold text-on-surface">2. Open Science Artifacts</div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">Reproducible dataset uploads, validated schematics, and preprints archived with permanent DOIs.</div>
                </div>
              </div>
            </div>

            {/* Ethical Attribution Notice */}
            <div className="bg-surface-container-lowest border border-surface-container-high rounded p-space-md shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-on-surface font-title-sm text-title-sm font-bold">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                <span>Ethical Attribution Notice</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                CampusLink adheres to the Berlin Declaration on Open Access. All recognized scholars retain complete moral copyright over code snippets, benchmark results, and responses published on the consortium exchange.
              </p>
              <div className="pt-2 font-mono text-[10px] text-outline flex items-center justify-between border-t border-surface-container-low">
                <span>Audit Standard: IEEE 7000-2021</span>
                <span className="text-primary hover:underline cursor-pointer font-semibold">Guidelines →</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
