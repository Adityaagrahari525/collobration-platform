import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-blue-100 selection:text-blue-900 min-h-screen">
      {/* TOP NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-none border-b border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="h-16 max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div onClick={() => navigate("/")} className="flex items-center gap-2.5 text-[#0F172A] hover:text-[#1E3A8A] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded bg-[#1E3A8A] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[19px]">account_balance</span>
              </div>
              <span className="font-semibold text-[17px] tracking-tight text-[#0F172A]">CampusLink</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <span onClick={() => navigate("/")} className="text-sm font-semibold text-[#1E3A8A] border-b-2 border-[#1E3A8A] py-5 -mb-[1px] cursor-pointer">Platform</span>
              <span onClick={() => navigate("/questions")} className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors py-5 cursor-pointer">Questions</span>
              <span onClick={() => navigate("/projects")} className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors py-5 cursor-pointer">Projects</span>
              <span onClick={() => navigate("/people")} className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors py-5 cursor-pointer">Institutions</span>
              <span onClick={() => navigate("/help")} className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors py-5 cursor-pointer">About</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-[#334155] hover:text-[#0F172A] px-3 py-2 transition-colors font-semibold">
              Sign In
            </button>
            <button onClick={() => navigate("/register")} className="h-9 px-4 rounded bg-[#1E3A8A] hover:bg-[#172554] text-white text-sm font-semibold flex items-center justify-center transition-colors shadow-sm">
              Create Account
            </button>
            <div onClick={() => navigate("/dashboard")} className="w-8 h-8 rounded border border-[#CBD5E1] bg-[#F1F5F9] flex items-center justify-center text-[#475569] cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-[#F8FAFC]">
        <div className="flex flex-col w-full">
          {/* HERO SECTION */}
          <section className="w-full px-6 py-10 md:py-14 max-w-7xl mx-auto flex flex-col">
            {/* Editorial Consortium Broadsheet Banner */}
            <div className="w-full border-b border-[#CBD5E1] pb-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[#64748B]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
                </span>
                <span className="font-mono font-bold tracking-wider text-[#0F172A] uppercase text-[11px]">NATIONAL INTER-INSTITUTIONAL RESEARCH & KNOWLEDGE REPOSITORY • EST. CONSORTIUM 2025</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[#475569]">
                <span><strong className="text-[#0F172A]">142</strong> Accredited Institutes</span>
                <span className="text-[#CBD5E1]">|</span>
                <span><strong className="text-[#0F172A]">28,400+</strong> Verified Academics</span>
                <span className="text-[#CBD5E1]">|</span>
                <span className="text-[#065F46] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">99.4% Faculty Endorsement Rate</span>
              </div>
            </div>

            {/* Asymmetric Hero Grid: Thesis & Query (Left) + Live Consortium Activity Codex (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              {/* Left Column: Scholarly Thesis & Interactive Academic Search */}
              <div className="lg:col-span-7 flex flex-col space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded mb-3">
                    <span className="material-symbols-outlined text-[14px] text-[#1E3A8A]">policy</span>
                    <span className="font-mono text-[10px] font-bold text-[#1E3A8A] tracking-wider uppercase">INTER-CAMPUS DISCOURSE PROTOCOL</span>
                  </div>
                  <h1 className="font-serif text-[#0F172A] tracking-tight text-3xl sm:text-4xl md:text-[44px] font-semibold leading-[1.18]">
                    Ask with precision. <br className="hidden sm:inline" />Contribute proofs. <br className="hidden sm:inline" /><span className="italic font-normal text-[#1E3A8A]">Build cross-campus.</span>
                  </h1>
                  <p className="text-[15px] md:text-[16px] leading-[26px] text-[#475569] mt-3 font-normal max-w-xl">
                    The verified academic exchange connecting undergraduate researchers, doctoral candidates, and faculty across India's premier engineering, science, and humanities departments.
                  </p>
                </div>

                {/* Functional Academic Query Box */}
                <div className="bg-white border border-[#CBD5E1] rounded-lg p-2.5 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex items-center gap-2.5 px-3 py-2 flex-grow bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                      <span className="material-symbols-outlined text-[18px] text-[#64748B]">search</span>
                      <input
                        className="bg-transparent w-full text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none"
                        placeholder="Search questions, research labs, or professor office hours..."
                        type="text"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") navigate("/questions");
                        }}
                      />
                      <span className="hidden sm:inline-block font-mono text-[10px] bg-white border border-[#CBD5E1] px-1.5 py-0.5 rounded text-[#64748B]">⌘K</span>
                    </div>
                    <button onClick={() => navigate("/questions")} className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs">
                      <span>Query Network</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>

                  {/* Quick Subject Filters */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2.5 mt-2 border-t border-[#E2E8F0]">
                    <span className="font-mono text-[10px] uppercase font-semibold text-[#64748B] mr-1">Domains:</span>
                    <button onClick={() => navigate("/questions")} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] hover:bg-[#EFF6FF] text-[#334155] hover:text-[#1E3A8A] transition-colors border border-[#E2E8F0]">CS & Distributed Systems</button>
                    <button onClick={() => navigate("/projects")} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] hover:bg-[#EFF6FF] text-[#334155] hover:text-[#1E3A8A] transition-colors border border-[#E2E8F0]">Edge Robotics</button>
                    <button onClick={() => navigate("/questions")} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] hover:bg-[#EFF6FF] text-[#334155] hover:text-[#1E3A8A] transition-colors border border-[#E2E8F0]">Quantum Physics</button>
                    <button onClick={() => navigate("/questions")} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] hover:bg-[#EFF6FF] text-[#334155] hover:text-[#1E3A8A] transition-colors border border-[#E2E8F0]">Bio-Informatics</button>
                  </div>
                </div>

                {/* Credential & Identity Callout */}
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <div className="w-5 h-5 rounded bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                  </div>
                  <span className="font-medium">Federated Eduroam & SAML 2.0 Auth</span>
                  <span className="text-[#CBD5E1]">•</span>
                  <span className="text-[#64748B]">Restricted to verified <code className="font-mono text-[11px] text-[#0F172A] bg-[#F1F5F9] px-1 py-0.5 rounded border border-[#E2E8F0]">.ac.in</code> / <code className="font-mono text-[11px] text-[#0F172A] bg-[#F1F5F9] px-1 py-0.5 rounded border border-[#E2E8F0]">.edu.in</code> accounts</span>
                </div>
              </div>

              {/* Right Column: Live Institutional Dispatch / Codex Widget */}
              <div className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-lg shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                    <span className="font-mono text-[11px] font-bold text-[#0F172A] uppercase tracking-wider">Live Consortium Activity</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#64748B] uppercase bg-white border border-[#CBD5E1] px-2 py-0.5 rounded">Realtime Sync</span>
                </div>

                <div className="divide-y divide-[#E2E8F0]">
                  {/* Feed Item 1 */}
                  <div onClick={() => navigate("/questions/q-101")} className="p-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-[#1E3A8A]">CS-402 • IIT Delhi</span>
                      <span className="text-[#64748B]">4m ago</span>
                    </div>
                    <p className="text-xs font-semibold text-[#0F172A] leading-snug">
                      Byzantine consensus state synchronization debate endorsed by Dr. A. Ramanujam
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-semibold text-[10px] inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified</span> Faculty Endorsed
                      </span>
                      <span className="text-[11px] text-[#64748B]">18 upvotes • 4 proofs</span>
                    </div>
                  </div>

                  {/* Feed Item 2 */}
                  <div onClick={() => navigate("/projects/proj-826")} className="p-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-[#1E3A8A]">ROBOTICS-LAB • BITS × NIT-T</span>
                      <span className="text-[#64748B]">12m ago</span>
                    </div>
                    <p className="text-xs font-semibold text-[#0F172A] leading-snug">
                      Micro-Rover sensor fusion sprint recruiting 2 embedded systems engineers
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] font-semibold text-[10px]">
                        Sprint Recruiting (3/5 Filled)
                      </span>
                      <span className="text-[11px] text-[#64748B]">ROS / EKF Filter</span>
                    </div>
                  </div>

                  {/* Feed Item 3 */}
                  <div onClick={() => navigate("/questions/q-102")} className="p-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-[#1E3A8A]">QUANTUM-SIM • IISc Bangalore</span>
                      <span className="text-[#64748B]">28m ago</span>
                    </div>
                    <p className="text-xs font-semibold text-[#0F172A] leading-snug">
                      Open proof validation submitted on Hamiltonian Monte Carlo for quantum lattice benchmarks
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-semibold text-[10px]">
                        Peer Validation Required
                      </span>
                      <span className="text-[11px] text-[#64748B]">QID: #IISc-4402</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#F1F5F9] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#475569] font-mono">
                  <span><strong className="text-[#0F172A]">42</strong> Open Grants</span>
                  <span className="text-[#CBD5E1]">•</span>
                  <span><strong className="text-[#0F172A]">186</strong> Pending Reviews</span>
                  <span onClick={() => navigate("/dashboard")} className="text-[#1E3A8A] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer">
                    <span>Registry</span>
                    <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Section Subtitle / Transition */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#1E3A8A]">dashboard_customize</span>
                <span className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">Curated Academic Discourse Preview</span>
              </div>
              <span className="text-xs text-[#64748B]">Live sample queries & verified collaborator cards</span>
            </div>

            {/* Component Preview Grid (Academic UI Artifacts) */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">
              {/* Top Left: Question Card UI */}
              <div onClick={() => navigate("/questions/q-101")} className="lg:col-span-7 bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-[#94A3B8] transition-colors cursor-pointer">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#94A3B8]"></span>
                      <span className="text-xs font-medium text-[#64748B]">Posted Anonymously • 4h ago</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span>Faculty Endorsed</span>
                    </div>
                  </div>
                  <h2 className="text-base font-semibold text-[#0F172A] leading-snug">
                    How to implement distributed consensus on Byzantine fault tolerant nodes in heterogeneous networks?
                  </h2>
                  <p className="text-sm text-[#475569] mt-2 line-clamp-2 leading-relaxed">
                    Evaluating PBFT state synchronization latency under asymmetric network delays between edge clusters. Specifically observing recovery state partition overhead in Raft-hybrid overlays.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="h-6 px-2.5 flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded text-[#334155] text-xs font-medium">Distributed Systems</span>
                    <span className="h-6 px-2.5 flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded text-[#334155] text-xs font-medium">CS-402</span>
                    <span className="h-6 px-2.5 flex items-center bg-[#EFF6FF] border border-[#BFDBFE] rounded text-[#1E3A8A] text-xs font-medium">IIT Delhi</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E2E8F0] text-[#64748B] text-xs font-medium">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[#1E3A8A] font-semibold bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      <span className="material-symbols-outlined text-[15px]">arrow_upward</span> 18 Upvotes
                    </span>
                    <span className="flex items-center gap-1 text-[#475569]">
                      <span className="material-symbols-outlined text-[15px]">forum</span> 4 Solutions
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#64748B]">QID: #DL-8821</span>
                </div>
              </div>

              {/* Top Right: Contribution Score Widget */}
              <div onClick={() => navigate("/people/usr-2")} className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-[#94A3B8] transition-colors cursor-pointer">
                <div>
                  <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-3 mb-4">
                    <div>
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Faculty Validator</span>
                      <h3 className="text-base font-semibold text-[#0F172A] mt-0.5">Dr. Rajesh K. Varma</h3>
                      <p className="text-xs text-[#475569]">Professor & Director • CSE, IIT Delhi</p>
                    </div>
                    <div className="w-10 h-10 rounded bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E3A8A] shadow-xs">
                      <span className="material-symbols-outlined text-[20px]">school</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                      <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Contribution Index</div>
                      <div className="text-xl font-bold text-[#0F172A] mt-1">4,890 <span className="text-xs text-[#1E3A8A] font-normal">pts</span></div>
                    </div>
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                      <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Resolution Rate</div>
                      <div className="text-xl font-bold text-[#0F172A] mt-1">98.2%</div>
                    </div>
                  </div>
                </div>
                <div className="p-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#D97706] text-[18px]">workspace_premium</span>
                    <span className="text-xs font-semibold text-[#92400E]">Top 1% Peer Validator</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#B45309] font-medium">SEMESTER II</span>
                </div>
              </div>

              {/* Bottom Left: Project Card UI */}
              <div onClick={() => navigate("/projects/proj-826")} className="lg:col-span-7 bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-[#94A3B8] transition-colors cursor-pointer">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                    <span className="text-xs font-semibold text-[#1E3A8A]">Cross-College Lab • IIT Delhi × IISc Bangalore</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]">Active Sprint 4</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0F172A]">FloodSense — Sub-GHz IoT Flood Telemetry Mesh Network</h3>
                  <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">
                    Real-time river basin monitoring using sub-GHz LoRa mesh and distributed consensus for early flash-flood prediction across vulnerable floodplains.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-xs font-medium text-[#64748B]">Recruiting:</span>
                    <span className="px-2 py-0.5 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] rounded text-xs font-medium">Embedded C++ / Raft</span>
                    <span className="px-2 py-0.5 bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] rounded text-xs font-medium">LoRaWAN Telemetry</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E2E8F0] text-xs text-[#475569]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#64748B]">group</span>
                    <span className="font-medium">3 Team Members Active</span>
                  </div>
                  <span className="font-semibold text-[#1E3A8A] hover:underline">View Workspace →</span>
                </div>
              </div>

              {/* Bottom Right: Expert Profile Snippet */}
              <div onClick={() => navigate("/people/usr-1")} className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-[#94A3B8] transition-colors cursor-pointer">
                <div>
                  <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
                    <div className="w-10 h-10 rounded bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      AS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0F172A]">Aditya Sharma</span>
                        <span className="px-1.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded text-[#065F46] text-[10px] font-bold tracking-wider uppercase">Verified Student</span>
                      </div>
                      <span className="text-xs text-[#475569]">B.Tech CSE '25 • IIT Delhi</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs">
                      <span className="text-[#475569] font-medium">Distributed Systems Val.</span>
                      <span className="font-mono text-[#0F172A] font-semibold">28 Accepted Answers</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs">
                      <span className="text-[#475569] font-medium">Open Code Contributions</span>
                      <span className="font-mono text-[#0F172A] font-semibold">5 Active Repos</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#E2E8F0] text-right">
                  <span className="font-mono text-[11px] text-[#64748B]">Eduroam SAML: #IN-9042-DL</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 1: THE PROBLEM */}
          <section className="w-full bg-[#F1F5F9] border-t border-b border-[#E2E8F0] py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-2xl mb-12">
                <span className="font-mono text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">Systemic Inefficiency</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#0F172A] font-semibold mt-2">
                  The Problem: Academic Collaboration is Fragmented
                </h2>
                <p className="text-sm md:text-base text-[#475569] mt-2 leading-relaxed">
                  Academic collaboration is fragmented across classrooms, WhatsApp groups, project teams and separate platforms.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center text-[#1E3A8A] mb-4">
                      <span className="material-symbols-outlined text-[20px]">folder_off</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A] mb-2">Information Silos</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Valuable project insights and research queries disappear into ephemeral chat apps without persistent institutional archival or searchability for incoming cohorts.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] font-mono text-[11px] font-medium text-[#64748B]">
                    ISSUE 01 • KNOWLEDGE LOSS
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center text-[#1E3A8A] mb-4">
                      <span className="material-symbols-outlined text-[20px]">person_cancel</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A] mb-2">Unverified Peer Networks</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Lack of verified academic credentials across institutions makes multi-college team recruitment unreliable, leading to unaligned commits and abandoned repository roadmaps.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] font-mono text-[11px] font-medium text-[#64748B]">
                    ISSUE 02 • ZERO TRUST BARRIER
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center text-[#1E3A8A] mb-4">
                      <span className="material-symbols-outlined text-[20px]">badge</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A] mb-2">Uncredited Knowledge Sharing</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Students and faculty spend countless hours answering peers and mentoring without verifiable academic contribution records or portable proof of institutional value.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] font-mono text-[11px] font-medium text-[#64748B]">
                    ISSUE 03 • INVISIBLE LABOUR
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: CORE WORKFLOW */}
          <section className="w-full py-16 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
              <span className="font-mono text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">Sequential Process</span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#0F172A] font-semibold mt-2">
                From Inquiry to Institutional Credibility
              </h2>
              <p className="text-sm md:text-base text-[#475569] mt-1">
                The verified academic iteration loop powering structured cross-college exchange.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Step 1 */}
              <div onClick={() => navigate("/questions/ask")} className="bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-xs cursor-pointer hover:border-[#1E3A8A] transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                    <span className="font-mono text-base font-bold text-[#1E3A8A]">01</span>
                    <span className="font-mono text-[11px] font-semibold uppercase text-[#64748B]">STEP</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-2 tracking-wide">ASK</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Ask academic and research questions with verified department context, or toggle optional anonymity without peer judgment.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#1E3A8A]">
                  LaTeX & Code Syntax
                </div>
              </div>

              {/* Step 2 */}
              <div onClick={() => navigate("/questions")} className="bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-xs cursor-pointer hover:border-[#1E3A8A] transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                    <span className="font-mono text-base font-bold text-[#1E3A8A]">02</span>
                    <span className="font-mono text-[11px] font-semibold uppercase text-[#64748B]">STEP</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-2 tracking-wide">ANSWER</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Dissect complex proofs, share verified course solutions, and annotate methodology with inline datasets.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#1E3A8A]">
                  Peer Validation
                </div>
              </div>

              {/* Step 3 */}
              <div onClick={() => navigate("/people")} className="bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-xs cursor-pointer hover:border-[#1E3A8A] transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                    <span className="font-mono text-base font-bold text-[#1E3A8A]">03</span>
                    <span className="font-mono text-[11px] font-semibold uppercase text-[#64748B]">STEP</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-2 tracking-wide">COLLABORATE</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Connect with cross-college peers based on verified skill competencies, laboratory resources, and project briefs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#1E3A8A]">
                  SAML Federated Match
                </div>
              </div>

              {/* Step 4 */}
              <div onClick={() => navigate("/projects")} className="bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-xs cursor-pointer hover:border-[#1E3A8A] transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                    <span className="font-mono text-base font-bold text-[#1E3A8A]">04</span>
                    <span className="font-mono text-[11px] font-semibold uppercase text-[#64748B]">STEP</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-2 tracking-wide">BUILD</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Form multi-disciplinary teams across IITs, NITs, and universities with shared milestone tracking and sprint logs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#1E3A8A]">
                  Cross-Campus Labs
                </div>
              </div>

              {/* Step 5 */}
              <div onClick={() => navigate("/recognition")} className="bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-xs cursor-pointer hover:border-[#1E3A8A] transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                    <span className="font-mono text-base font-bold text-[#1E3A8A]">05</span>
                    <span className="font-mono text-[11px] font-semibold uppercase text-[#64748B]">STEP</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-2 tracking-wide">EARN TRUST</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Build a permanent, verifiable academic contribution portfolio indexed by peer validations and faculty endorsements.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] font-semibold text-[#1E3A8A]">
                  Permanent Ledger
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: PLATFORM CAPABILITIES */}
          <section className="w-full bg-[#F1F5F9] border-t border-b border-[#E2E8F0] py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="font-mono text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">Functional Architecture</span>
                  <h2 className="font-serif text-2xl md:text-3xl text-[#0F172A] font-semibold mt-2">
                    Platform Capabilities
                  </h2>
                </div>
                <p className="text-sm text-[#475569] max-w-md mt-2 md:mt-0 leading-relaxed">
                  Engineered for rigour, peer accountability, and high-density technical discourse.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Capability 1 */}
                <div onClick={() => navigate("/questions")} className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#1E3A8A] transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="material-symbols-outlined text-[#1E3A8A] text-[24px]">help_center</span>
                      <span className="font-mono text-[11px] font-medium text-[#64748B]">MODULE 01</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A]">Academic Q&A</h3>
                    <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                      LaTeX equation parsing, structured monospaced code blocks, faculty endorsement banners, and privacy toggles for identity-safe inquiry.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                    <span className="text-xs font-medium text-[#334155]">Integrated MathJax & Highlight Engine</span>
                  </div>
                </div>

                {/* Capability 2 */}
                <div onClick={() => navigate("/projects")} className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#1E3A8A] transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="material-symbols-outlined text-[#1E3A8A] text-[24px]">terminal</span>
                      <span className="font-mono text-[11px] font-medium text-[#64748B]">MODULE 02</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A]">Projects & Collaboration Labs</h3>
                    <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                      Cross-college repository discovery, open skill matrices, collaborator applicant screening, and multi-institutional sprint milestone tracking.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                    <span className="text-xs font-medium text-[#334155]">Federated Milestone Logs</span>
                  </div>
                </div>

                {/* Capability 3 */}
                <div onClick={() => navigate("/people")} className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#1E3A8A] transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="material-symbols-outlined text-[#1E3A8A] text-[24px]">contacts</span>
                      <span className="font-mono text-[11px] font-medium text-[#64748B]">MODULE 03</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A]">Verified Academic Directory</h3>
                    <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                      Authoritative directory of scholars and professors categorized strictly by institution, department, research domain, and publication index.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                    <span className="text-xs font-medium text-[#334155]">Institutional SAML Handshake</span>
                  </div>
                </div>

                {/* Capability 4 */}
                <div onClick={() => navigate("/mentorship")} className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs flex flex-col justify-between md:col-span-1 cursor-pointer hover:border-[#1E3A8A] transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="material-symbols-outlined text-[#1E3A8A] text-[24px]">forum</span>
                      <span className="font-mono text-[11px] font-medium text-[#64748B]">MODULE 04</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A]">Structured Advisory Channels</h3>
                    <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                      Direct, asynchronous mentorship desks connecting postgraduate researchers and faculty to undergraduate builders for research thesis critiques.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                    <span className="text-xs font-medium text-[#334155]">Audited Advisory Transcripts</span>
                  </div>
                </div>

                {/* Capability 5 */}
                <div onClick={() => navigate("/contribution")} className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs flex flex-col justify-between md:col-span-2 cursor-pointer hover:border-[#1E3A8A] transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="material-symbols-outlined text-[#1E3A8A] text-[24px]">award_star</span>
                      <span className="font-mono text-[11px] font-medium text-[#64748B]">MODULE 05</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A]">Contribution Reputation</h3>
                    <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                      Immutable, audit-ready academic contribution score that reflects peer answers, code reviews, reproducible dataset publications, and cross-campus project delivery—portable beyond graduation.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                    <span className="text-xs font-medium text-[#334155]">Portable Institutional Ledger • No Speculative Tokens</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: CROSS-COLLEGE COLLABORATION */}
          <section className="w-full py-16 px-6 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="font-mono text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">Topology Map</span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#0F172A] font-semibold mt-2">
                Cross-College Academic Network
              </h2>
              <p className="text-sm md:text-base text-[#475569] mt-2">
                Verified peer connections across institutions, disciplines, and research laboratories.
              </p>
            </div>

            {/* Light Architectural Schematic SVG / Node Canvas */}
            <div className="w-full bg-white border border-[#CBD5E1] rounded-lg p-6 lg:p-8 overflow-hidden relative shadow-xs">
              <div className="w-full flex justify-center">
                <svg className="w-full max-w-4xl h-auto select-none" viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg">
                  {/* Connection Conduit Lines */}
                  <g fill="none" stroke="#CBD5E1" strokeDasharray="4 4" strokeWidth="1.5">
                    <path d="M 170 100 L 450 70"></path>
                    <path d="M 450 70 L 730 100"></path>
                    <path d="M 170 100 L 310 200"></path>
                    <path d="M 730 100 L 590 200"></path>
                    <path d="M 310 200 L 450 70"></path>
                    <path d="M 590 200 L 450 70"></path>
                    <path d="M 310 200 L 450 330"></path>
                    <path d="M 590 200 L 450 330"></path>
                    <path d="M 170 300 L 310 200"></path>
                    <path d="M 730 300 L 590 200"></path>
                    <path d="M 170 300 L 450 330"></path>
                    <path d="M 730 300 L 450 330"></path>
                  </g>

                  {/* Conduit Labels (Projects in Progress) */}
                  <g className="font-mono" fill="#475569" fontSize="10" textAnchor="middle">
                    <rect fill="#F1F5F9" height="20" rx="3" stroke="#CBD5E1" strokeWidth="1" width="120" x="250" y="70"></rect>
                    <text fontWeight="500" x="310" y="84">Joint Robotics Lab</text>
                    <rect fill="#F1F5F9" height="20" rx="3" stroke="#CBD5E1" strokeWidth="1" width="140" x="530" y="70"></rect>
                    <text fontWeight="500" x="600" y="84">Quantum Sim Benchmark</text>
                    <rect fill="#F1F5F9" height="20" rx="3" stroke="#CBD5E1" strokeWidth="1" width="140" x="380" y="190"></rect>
                    <text fontWeight="500" x="450" y="204">Edge AI Team Alpha</text>
                    <rect fill="#F1F5F9" height="20" rx="3" stroke="#CBD5E1" strokeWidth="1" width="140" x="380" y="320"></rect>
                    <text fontWeight="500" x="450" y="334">Bio-Informatics Stream</text>
                  </g>

                  {/* Institutional Nodes */}
                  <g transform="translate(90, 80)" onClick={() => navigate("/people")} className="cursor-pointer">
                    <rect fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" height="40" rx="4" stroke="#CBD5E1" strokeWidth="1.5" width="160"></rect>
                    <circle cx="18" cy="20" fill="#1E3A8A" r="4"></circle>
                    <text fill="#0F172A" fontFamily="'Public Sans', sans-serif" fontSize="12" fontWeight="600" x="32" y="24">IIT Bombay</text>
                    <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="10" x="110" y="24">84 Collabs</text>
                  </g>

                  <g transform="translate(370, 50)" onClick={() => navigate("/people")} className="cursor-pointer">
                    <rect fill="#EFF6FF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" height="40" rx="4" stroke="#1E3A8A" strokeWidth="1.5" width="160"></rect>
                    <circle cx="18" cy="20" fill="#1E3A8A" r="4"></circle>
                    <text fill="#1E3A8A" fontFamily="'Public Sans', sans-serif" fontSize="12" fontWeight="700" x="32" y="24">IISc Bangalore</text>
                    <text fill="#1E3A8A" fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="600" x="115" y="24">Hub Node</text>
                  </g>

                  <g transform="translate(650, 80)" onClick={() => navigate("/people")} className="cursor-pointer">
                    <rect fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" height="40" rx="4" stroke="#CBD5E1" strokeWidth="1.5" width="160"></rect>
                    <circle cx="18" cy="20" fill="#1E3A8A" r="4"></circle>
                    <text fill="#0F172A" fontFamily="'Public Sans', sans-serif" fontSize="12" fontWeight="600" x="32" y="24">BITS Pilani</text>
                    <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="10" x="110" y="24">62 Collabs</text>
                  </g>

                  <g transform="translate(230, 180)" onClick={() => navigate("/people")} className="cursor-pointer">
                    <rect fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" height="38" rx="4" stroke="#CBD5E1" strokeWidth="1.5" width="150"></rect>
                    <circle cx="18" cy="19" fill="#0D9488" r="4"></circle>
                    <text fill="#0F172A" fontFamily="'Public Sans', sans-serif" fontSize="12" fontWeight="600" x="32" y="23">NIT Trichy</text>
                    <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="10" x="100" y="23">45 Collabs</text>
                  </g>

                  <g transform="translate(520, 180)" onClick={() => navigate("/people")} className="cursor-pointer">
                    <rect fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" height="38" rx="4" stroke="#CBD5E1" strokeWidth="1.5" width="150"></rect>
                    <circle cx="18" cy="19" fill="#0D9488" r="4"></circle>
                    <text fill="#0F172A" fontFamily="'Public Sans', sans-serif" fontSize="12" fontWeight="600" x="32" y="23">Ashoka Univ</text>
                    <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="10" x="105" y="23">31 Collabs</text>
                  </g>

                  <g transform="translate(90, 280)" onClick={() => navigate("/people")} className="cursor-pointer">
                    <rect fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" height="40" rx="4" stroke="#CBD5E1" strokeWidth="1.5" width="160"></rect>
                    <circle cx="18" cy="20" fill="#1E3A8A" r="4"></circle>
                    <text fill="#0F172A" fontFamily="'Public Sans', sans-serif" fontSize="12" fontWeight="600" x="32" y="24">IIT Delhi</text>
                    <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="10" x="110" y="24">92 Collabs</text>
                  </g>

                  <g transform="translate(650, 280)" onClick={() => navigate("/people")} className="cursor-pointer">
                    <rect fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))" height="40" rx="4" stroke="#CBD5E1" strokeWidth="1.5" width="160"></rect>
                    <circle cx="18" cy="20" fill="#1E3A8A" r="4"></circle>
                    <text fill="#0F172A" fontFamily="'Public Sans', sans-serif" fontSize="12" fontWeight="600" x="32" y="24">AIIMS Bio-Inf</text>
                    <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="10" x="112" y="24">28 Collabs</text>
                  </g>

                  <circle cx="450" cy="200" fill="#1E3A8A" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
                </svg>
              </div>

              {/* Network Scale Metrics Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#E2E8F0] text-center">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  <div className="font-mono text-2xl font-bold text-[#0F172A]">140+</div>
                  <div className="text-xs font-semibold text-[#64748B] mt-1 uppercase tracking-wide">Partner Institutions</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  <div className="font-mono text-2xl font-bold text-[#0F172A]">24,000+</div>
                  <div className="text-xs font-semibold text-[#64748B] mt-1 uppercase tracking-wide">Verified Academics</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  <div className="font-mono text-2xl font-bold text-[#0F172A]">1,800+</div>
                  <div className="text-xs font-semibold text-[#64748B] mt-1 uppercase tracking-wide">Active Cross-College Projects</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: FINAL CTA */}
          <section className="w-full py-16 px-6 max-w-7xl mx-auto">
            <div className="bg-white border border-[#CBD5E1] rounded-lg p-8 md:p-14 text-center max-w-4xl mx-auto shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded mb-6">
                <span className="material-symbols-outlined text-[#1E3A8A] text-[16px]">verified_user</span>
                <span className="font-mono text-xs font-semibold text-[#1E3A8A] uppercase">Federated SAML Authentication</span>
              </div>
              <h2 className="font-serif text-2xl md:text-4xl text-[#0F172A] font-semibold">
                Join the Verified Academic Network
              </h2>
              <p className="text-sm md:text-base text-[#475569] max-w-xl mx-auto mt-4 leading-relaxed">
                Connect with researchers, students, and mentors across India. Start asking, building, and earning verifiable academic credibility.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <button onClick={() => navigate("/dashboard")} className="px-6 py-3 rounded bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172554] transition-colors shadow-sm">
                  Explore the Platform
                </button>
                <button onClick={() => navigate("/register")} className="px-6 py-3 rounded border border-[#CBD5E1] bg-white text-[#0F172A] text-sm font-medium hover:bg-[#F8FAFC] transition-colors shadow-xs">
                  Create Account with College ID
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-center gap-2 text-xs font-medium text-[#64748B]">
                <span className="material-symbols-outlined text-[16px] text-[#64748B]">lock</span>
                <span>Requires verified .ac.in, .edu.in or recognized college identification.</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-[#CBD5E1] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-[#E2E8F0]">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#1E3A8A] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[17px]">account_balance</span>
                </div>
                <span className="text-base font-bold text-[#0F172A] tracking-tight">CampusLink</span>
              </div>
              <p className="text-sm text-[#475569] max-w-sm leading-relaxed">
                Unified academic exchange and verified research infrastructure across accredited collegiate networks.
              </p>
              <div className="flex items-center gap-2 text-[#065F46] text-xs font-medium pt-2">
                <span className="material-symbols-outlined text-[16px] text-[#059669]">verified</span>
                <span>Verified Institutional Discourse Protocol</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">Product</div>
              <ul className="space-y-2 text-sm text-[#475569]">
                <li><span onClick={() => navigate("/dashboard")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Overview</span></li>
                <li><span onClick={() => navigate("/questions")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Academic Q&A</span></li>
                <li><span onClick={() => navigate("/projects")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Collaboration Labs</span></li>
                <li><span onClick={() => navigate("/people")} className="hover:text-[#0F172A] transition-colors cursor-pointer">University Directory</span></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">Knowledge</div>
              <ul className="space-y-2 text-sm text-[#475569]">
                <li><span onClick={() => navigate("/questions")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Preprints</span></li>
                <li><span onClick={() => navigate("/recognition")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Peer Review</span></li>
                <li><span onClick={() => navigate("/projects")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Open Datasets</span></li>
                <li><span onClick={() => navigate("/contribution")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Citation Index</span></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">Community & Legal</div>
              <ul className="space-y-2 text-sm text-[#475569]">
                <li><span onClick={() => navigate("/help")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Honor Code</span></li>
                <li><span onClick={() => navigate("/help")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Access Policy</span></li>
                <li><span onClick={() => navigate("/settings")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Privacy Framework</span></li>
                <li><span onClick={() => navigate("/settings")} className="hover:text-[#0F172A] transition-colors cursor-pointer">Audit & Governance</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
            <div>© 2025 CampusLink Consortium. All academic rights reserved.</div>
            <div>Federated identity authenticated via institutional SAML/Eduroam standards.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
