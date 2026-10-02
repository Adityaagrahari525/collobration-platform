import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { analyzeSkillGap } from "../utils/aiService";
import { calculateLevel } from "../utils/userStats";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, deleteUserAccount } = useApp();
  const [activeTab, setActiveTab] = useState("tab-all");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");

  const handleDeleteAccount = async () => {
    if (window.confirm("WARNING: Are you sure you want to permanently delete your account and all associated profile, questions, answers, and project records from the database? This action cannot be undone.")) {
      await deleteUserAccount(currentUser?.id);
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Archival Canvas Substrate */}
      <div className="w-full max-w-[1360px] mx-auto px-space-md py-space-md lg:py-space-xl flex flex-col gap-space-lg text-on-surface">
        {/* Institutional Breadcrumbs & System Status Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm border-b border-outline-variant/50 pb-space-sm text-body-sm">
          <nav className="flex items-center gap-1.5 text-on-surface-variant font-label-md">
            <span onClick={() => navigate("/")} className="hover:text-primary transition-colors cursor-pointer">Academic Network</span>
            <span className="text-outline">/</span>
            <span onClick={() => navigate("/people")} className="hover:text-primary transition-colors cursor-pointer">Scholar Registry</span>
            <span className="text-outline">/</span>
            <span onClick={() => navigate("/people")} className="hover:text-primary transition-colors cursor-pointer">Scholarly Profiles</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-semibold text-primary">{currentUser?.name || "Aditya Sharma"} (UID: 2021CS10842)</span>
          </nav>
          <div className="flex items-center gap-2 self-start md:self-auto font-label-sm text-on-surface-variant bg-surface-container-high/60 px-space-sm py-1 rounded border border-outline-variant/60">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="tracking-wide uppercase">Consortium Verification Hash:</span>
            <span className="font-mono text-[11px] text-primary font-semibold">0x7F4A...B89C</span>
            <span className="text-outline">·</span>
            <span className="text-secondary font-medium">Valid / In-Session</span>
          </div>
        </div>

        {/* Section 1: Scholarly Header & Verified Credentials */}
        <header className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md lg:p-space-lg shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-space-lg">
            {/* Left Column: Primary Identity & Credentials */}
            <div className="flex flex-col gap-space-sm flex-1">
              <div className="flex flex-wrap items-center gap-space-sm">
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif">
                  {currentUser?.name || "Aditya Sharma"}
                </h1>
                <div className="inline-flex items-center gap-1.5 bg-[#ecfdf5] border border-[#a7f3d0] text-secondary px-2.5 py-0.5 rounded text-label-sm font-semibold tracking-wide">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span>VERIFIED SCHOLAR</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/60 text-on-surface-variant px-2 py-0.5 rounded text-label-sm font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  <span>{currentUser?.institution || "IIT Delhi"} · Node #04 · Roll: 2021CS10842</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-body-md text-on-surface-variant">
                <span className="font-medium text-on-surface">Indian Institute of Technology Delhi</span>
                <span className="text-outline">·</span>
                <span>Department of Computer Science &amp; Engineering</span>
                <span className="text-outline">·</span>
                <span className="text-on-surface-variant/80">4th Year Undergrad (B.Tech Candidate)</span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface max-w-4xl pt-1 text-balance">
                Distributed Systems &amp; Formal Verification Researcher. Maintainer of the Raft-Rust Consortium Engine. Undergraduate Research Fellow focusing on crash-fault-tolerant consensus protocols under network partitions.
              </p>
              <div className="flex flex-wrap items-center gap-space-xs pt-2">
                <span className="text-label-sm uppercase tracking-wider text-outline pr-1">Consortium Nodes:</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface text-label-md font-mono">iitd.ac.in/~aditya.sharma</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface text-label-md font-mono">orcid:0009-0004-9812-7489</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface text-label-md font-mono">github:aditya-sharma-dist</span>
              </div>
            </div>

            {/* Right Column: Contribution Metric & Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-space-md w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-outline-variant/40 pt-space-md lg:pt-0 lg:pl-space-lg">
              <div className="flex flex-col lg:items-end">
                <div className="text-label-sm font-label-sm uppercase tracking-wider text-outline">Consortium Contribution Score</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-display-lg text-primary-container tracking-tight font-serif font-bold">
                    {currentUser?.contributionScore?.toLocaleString() || "2,840"}
                  </span>
                  <span className="text-title-sm text-secondary font-semibold font-mono">CCS</span>
                </div>
                <div className="inline-flex items-center gap-1 text-label-md font-label-md text-secondary bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>Top 2.1% in Computer Science Cohort</span>
                </div>
              </div>
              <div className="flex flex-col w-full sm:w-auto gap-1.5">
                <button className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary hover:bg-[#172554] transition-colors px-3.5 py-2 rounded text-title-sm font-medium shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span>Export Audited CV (PDF)</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 bg-surface-container-lowest border border-outline-variant/80 hover:bg-surface-container-high transition-colors px-2.5 py-1.5 rounded text-label-md text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">key</span>
                    <span>Verify Public Key</span>
                  </button>
                  <button onClick={handleDeleteAccount} className="inline-flex items-center justify-center gap-1.5 bg-error-container text-on-error-container border border-error/30 hover:bg-error/20 transition-colors px-2.5 py-1.5 rounded text-label-md font-semibold" title="Permanently delete user account from database">
                    <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Section 2: Four Primary Impact Metrics */}
        <section aria-label="Audited Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
          {/* Metric 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md flex flex-col justify-between transition-colors hover:border-outline">
            <div className="flex items-center justify-between text-outline pb-space-xs">
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Questions Answered</span>
              <span className="material-symbols-outlined text-[20px] text-primary-container">forum</span>
            </div>
            <div className="my-space-xs">
              <span className="font-headline-lg text-headline-lg text-primary font-serif font-bold">142</span>
              <span className="text-body-sm text-outline ml-1">inquiries</span>
            </div>
            <div className="border-t border-outline-variant/30 pt-space-xs text-body-sm text-on-surface-variant">
              <span className="text-secondary font-medium font-mono">94%</span> within 4 hours <span className="text-outline">·</span> 12,480 peer impressions across 18 universities
            </div>
          </div>
          {/* Metric 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md flex flex-col justify-between transition-colors hover:border-outline">
            <div className="flex items-center justify-between text-outline pb-space-xs">
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Accepted Solutions</span>
              <span className="material-symbols-outlined text-[20px] text-secondary">task_alt</span>
            </div>
            <div className="my-space-xs">
              <span className="font-headline-lg text-headline-lg text-secondary font-serif font-bold">89</span>
              <span className="text-body-sm text-outline ml-1">resolutions</span>
            </div>
            <div className="border-t border-outline-variant/30 pt-space-xs text-body-sm text-on-surface-variant">
              <span className="font-mono text-on-surface font-semibold">62.6%</span> validation rate <span className="text-outline">·</span> 24 designated Canonical Reference by faculty
            </div>
          </div>
          {/* Metric 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md flex flex-col justify-between transition-colors hover:border-outline">
            <div className="flex items-center justify-between text-outline pb-space-xs">
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Consortium Projects</span>
              <span className="material-symbols-outlined text-[20px] text-primary-container">science</span>
            </div>
            <div className="my-space-xs">
              <span className="font-headline-lg text-headline-lg text-primary font-serif font-bold">4</span>
              <span className="text-body-sm text-outline ml-1">initiatives</span>
            </div>
            <div className="border-t border-outline-variant/30 pt-space-xs text-body-sm text-on-surface-variant">
              <span className="font-medium text-on-surface">2 Lead Architect</span> <span className="text-outline">·</span> 3 cross-institute partnerships with IISc Bangalore &amp; BITS Pilani
            </div>
          </div>
          {/* Metric 4 */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md flex flex-col justify-between transition-colors hover:border-outline">
            <div className="flex items-center justify-between text-outline pb-space-xs">
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Mentorship Audits</span>
              <span className="material-symbols-outlined text-[20px] text-tertiary-container">supervisor_account</span>
            </div>
            <div className="my-space-xs">
              <span className="font-headline-lg text-headline-lg text-primary font-serif font-bold">38</span>
              <span className="text-body-sm text-outline ml-1">sessions</span>
            </div>
            <div className="border-t border-outline-variant/30 pt-space-xs text-body-sm text-on-surface-variant">
              16 junior scholars instructed in OS internals <span className="text-outline">·</span> <span className="font-mono text-secondary font-semibold">4.9/5.0</span> peer rating
            </div>
          </div>
        </section>

        {/* Section 2.5: Interactive Skill Gap & Learning Path Recommendation Widget */}
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md shadow-sm">
          {(() => {
            const userSkills = currentUser?.skills || ["Distributed Systems", "C++20", "Go", "Rust", "Kafka"];
            const gapAnalysis = analyzeSkillGap(userSkills, targetRole);
            const userLevel = calculateLevel(currentUser?.contributionScore || 1420);

            return (
              <div className="space-y-space-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/40 pb-space-sm">
                  <div>
                    <h2 className="font-title-md text-title-md text-primary font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[22px]">auto_awesome</span>
                      Target Role Skill Gap &amp; Learning Path Analysis
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Evaluate current skills against target industry roles and generate a structured 4-step recommendation roadmap.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm text-outline font-semibold uppercase">Target Role:</span>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="px-3 py-1.5 bg-surface-container-low border border-outline-variant/60 rounded text-label-md font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="AI/ML Engineer">AI/ML Engineer</option>
                      <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
                      <option value="Mobile Developer">Mobile Developer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                    </select>
                  </div>
                </div>

                {/* Progress Bar & Level Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md bg-surface-container-low/50 p-space-md rounded-lg border border-outline-variant/40">
                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Academic Tier Level</span>
                    <div className="font-title-md text-title-md font-serif text-primary font-bold">{userLevel.name} (Level {userLevel.level})</div>
                    <div className="w-full bg-surface-container-high rounded-full h-2 mt-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${userLevel.progressPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Target Readiness Score</span>
                    <div className="font-title-md text-title-md font-serif text-secondary font-bold">{gapAnalysis.progress}% Ready</div>
                    <div className="w-full bg-surface-container-high rounded-full h-2 mt-1">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: `${gapAnalysis.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Skill Gaps Identified</span>
                    <div className="font-title-md text-title-md font-serif text-on-surface font-bold">
                      {gapAnalysis.missingSkills.length} Skills Missing
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Out of {gapAnalysis.requiredSkills.length} role requirements</span>
                  </div>
                </div>

                {/* Missing Skills Tags & Roadmap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-1">
                  <div className="space-y-2">
                    <span className="font-title-sm text-title-sm font-semibold text-on-surface block">Missing Skill Gaps for {targetRole}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {gapAnalysis.missingSkills.length > 0 ? (
                        gapAnalysis.missingSkills.map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded text-label-sm font-mono font-medium">
                            + {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-body-sm text-emerald-600 font-medium">✨ All required skills for this role are present on your profile!</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-title-sm text-title-sm font-semibold text-on-surface block">Recommended 4-Phase Learning Path</span>
                    <div className="space-y-1.5">
                      {gapAnalysis.recommendedPath.map((step, idx) => (
                        <div key={idx} className="p-2 bg-surface-container-low rounded border border-outline-variant/40 text-body-sm text-on-surface-variant flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-mono font-bold text-label-sm flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Section 3: Scholarly Domains & Cryptographic Verification Chips */}
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs border-b border-outline-variant/40 pb-space-sm mb-space-sm">
            <div>
              <h2 className="font-title-md text-title-md text-primary font-semibold">Domain Rigor &amp; Validated Competencies</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Peer-examined technical disciplines backed by verifiable accepted solutions and code artifacts.</p>
            </div>
            <span className="font-label-sm text-label-sm text-outline uppercase font-mono">Consortium Assessment Standard V2.4</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-sm pt-space-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-surface-container-low border border-outline-variant/40">
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface font-medium">Distributed Systems</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Level 4 Candidate · 42 validated solutions</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/60 text-secondary text-label-sm font-mono font-semibold">42 Proofs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-surface-container-low border border-outline-variant/40">
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface font-medium">Rust Systems Programming</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Level 4 Senior · 38 solutions · 1 crates.io</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/60 text-secondary text-label-sm font-mono font-semibold">38 Proofs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-surface-container-low border border-outline-variant/40">
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface font-medium">Formal Verification (TLA+)</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Level 3 Practitioner · 19 solutions</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/60 text-secondary text-label-sm font-mono font-semibold">19 Proofs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-surface-container-low border border-outline-variant/40">
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface font-medium">Raft &amp; Paxos Consensus</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Level 4 Specialist · 26 solutions</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/60 text-secondary text-label-sm font-mono font-semibold">26 Proofs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-surface-container-low border border-outline-variant/40">
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface font-medium">Linux Kernel Internals</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Level 3 Practitioner · 15 solutions</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/60 text-secondary text-label-sm font-mono font-semibold">15 Proofs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-surface-container-low border border-outline-variant/40">
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface font-medium">High Performance Computing (HPC)</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Level 2 Contributor · 8 solutions</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/60 text-secondary text-label-sm font-mono font-semibold">8 Proofs</span>
            </div>
          </div>
        </section>

        {/* Section 4: Main Grid: Main Ledger Column (8 cols) + Right Institutional Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Primary Academic Column (Cols 1-8) */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            {/* Tabbed Contribution Highlights */}
            <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg">
              <div className="border-b border-outline-variant/40 px-space-md pt-space-sm flex items-center justify-between flex-wrap gap-space-sm">
                <div className="flex items-center gap-space-sm overflow-x-auto" id="profile-tabs">
                  <button
                    onClick={() => setActiveTab("tab-all")}
                    className={`tab-button font-title-sm text-title-sm pb-space-sm px-1 font-semibold ${
                      activeTab === "tab-all" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    All Highlights
                  </button>
                  <button
                    onClick={() => setActiveTab("tab-projects")}
                    className={`tab-button font-title-sm text-title-sm pb-space-sm px-1 font-semibold ${
                      activeTab === "tab-projects" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Projects Led (4)
                  </button>
                  <button
                    onClick={() => setActiveTab("tab-solutions")}
                    className={`tab-button font-title-sm text-title-sm pb-space-sm px-1 font-semibold ${
                      activeTab === "tab-solutions" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Verified Answers (89)
                  </button>
                  <button
                    onClick={() => setActiveTab("tab-faculty")}
                    className={`tab-button font-title-sm text-title-sm pb-space-sm px-1 font-semibold ${
                      activeTab === "tab-faculty" ? "border-b-2 border-primary text-primary" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Faculty Endorsements (2)
                  </button>
                </div>
                <div className="text-label-sm text-outline pb-space-sm font-mono">Archive Ref: CL-IITD-2024</div>
              </div>

              <div className="p-space-md flex flex-col gap-space-md">
                {/* Section A: Projects Contributed & Led */}
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm uppercase tracking-wider text-outline font-semibold">Institutional Engineering Milestones</span>
                    <span onClick={() => navigate("/projects")} className="text-label-sm text-primary font-mono cursor-pointer hover:underline">View All in Projects →</span>
                  </div>
                  {/* Project Card 1 */}
                  <div className="border border-outline-variant/40 rounded p-space-md bg-surface-bright hover:border-outline transition-colors flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-container text-[20px]">layers</span>
                        <h3 className="font-headline-sm text-headline-sm text-primary font-serif font-semibold">FloodSense: IoT-Edge Hydrological Warning Network</h3>
                      </div>
                      <span className="inline-flex items-center gap-1 font-mono text-label-sm text-secondary bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded">
                        Milestone 3 Delivered
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Architected telemetry consensus pipeline for low-power edge nodes deployed in Cauvery basin sensors. Prevents split-brain state during flash-flood backhaul cutoffs.
                    </p>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md pt-1 text-body-sm text-on-surface-variant font-mono">
                      <span>Role: <strong className="text-on-surface">Lead Edge Architect</strong></span>
                      <span className="text-outline">·</span>
                      <span>Co-developed: <strong class="text-on-surface">NIT Trichy &amp; IIT Roorkee</strong></span>
                      <span className="text-outline">·</span>
                      <span>Verification: <strong className="text-secondary">1,420 lines audited Rust code</strong></span>
                    </div>
                  </div>
                  {/* Project Card 2 */}
                  <div className="border border-outline-variant/40 rounded p-space-md bg-surface-bright hover:border-outline transition-colors flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-container text-[20px]">terminal</span>
                        <h3 className="font-headline-sm text-headline-sm text-primary font-serif font-semibold">ConsensusLab: Educational Distributed Key-Value Store</h3>
                      </div>
                      <span className="inline-flex items-center gap-1 font-mono text-label-sm text-primary-container bg-surface-container-high border border-outline-variant/60 px-2 py-0.5 rounded">
                        Core Curriculum Adoption
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Deterministic fault-injection harness paired with a simplified Raft state machine, built for university undergraduate OS labs to simulate Byzantine drops and clock skew.
                    </p>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md pt-1 text-body-sm text-on-surface-variant font-mono">
                      <span>Role: <strong className="text-on-surface">Principal Maintainer</strong></span>
                      <span className="text-outline">·</span>
                      <span>Adoption: <strong className="text-on-surface">3 Consortium Universities (Course: CS302)</strong></span>
                      <span className="text-outline">·</span>
                      <span>License: <strong className="text-on-surface">Apache-2.0 / CampusLink Academic</strong></span>
                    </div>
                  </div>
                </div>

                {/* Section B: Top Accepted Answers */}
                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm uppercase tracking-wider text-outline font-semibold">Peer-Reviewed Canonical Solutions</span>
                    <span onClick={() => navigate("/questions")} className="text-label-sm text-primary font-mono cursor-pointer hover:underline">Explore All Q&amp;A →</span>
                  </div>
                  <div className="border border-outline-variant/40 rounded p-space-md bg-surface-bright hover:border-outline transition-colors flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-label-sm font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> ACCEPTED SOLUTION
                          </span>
                          <span className="text-label-sm font-mono text-on-surface-variant font-medium">+48 Peer Endorsements</span>
                        </div>
                        <a onClick={(e) => { e.preventDefault(); navigate("/questions/q1"); }} className="font-title-md text-title-md text-primary font-medium hover:underline cursor-pointer" href="#">
                          Raft consensus split-brain mitigation during uncommitted log replication under high network jitter
                        </a>
                      </div>
                      <span className="shrink-0 font-mono text-label-sm text-outline">QID #88219</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                      "The issue occurs because the leader sends AppendEntries RPCs with prevLogIndex that are stale by exactly one heartbeat timeout tick when the OS socket buffer queues fill up. Introducing the pre-vote phase according to Ongaro's dissertation §9.6 guarantees..."
                    </p>
                    <div className="flex items-center justify-between text-body-sm pt-1 border-t border-outline-variant/20">
                      <div className="flex items-center gap-1.5 text-on-surface font-medium text-[13px]">
                        <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                        <span>Endorsed by Prof. R. Ramanathan, IIT Madras</span>
                      </div>
                      <span className="text-outline text-label-sm font-mono">Recorded: Oct 14, 2024</span>
                    </div>
                  </div>
                </div>

                {/* Section C: Faculty Verification & Cryptographic Sign-Offs */}
                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <span className="font-label-sm uppercase tracking-wider text-outline font-semibold">Faculty Verification &amp; Cryptographic Sign-Offs</span>
                  <div className="border border-outline-variant/40 rounded p-space-md bg-[#faf8ff] flex flex-col gap-space-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-primary-container text-on-primary flex items-center justify-center font-serif text-[12px] font-bold">
                          RR
                        </div>
                        <div>
                          <div className="font-title-sm text-title-sm text-primary font-semibold">Prof. R. Ramanathan</div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant">Professor, Department of CSE, IIT Madras</div>
                        </div>
                      </div>
                      <span className="font-mono text-label-sm text-secondary bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded self-start sm:self-auto">
                        SIG-DIST-VERIFIED #VER-IITM-8821
                      </span>
                    </div>
                    <blockquote className="font-body-md text-body-md text-on-surface italic border-l-2 border-primary-container pl-3 py-0.5 my-1">
                      “Aditya's formal proof demonstrating pre-vote protocol liveness under asymmetric partitions was rigorous, reproducible, and adopted in our research group's distributed verification test harness.”
                    </blockquote>
                    <div className="flex items-center justify-between font-mono text-[11px] text-outline pt-1">
                      <span>Sign-off: PGP Key ID 0x3E1B7A49</span>
                      <span>Date: Oct 14, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Institutional Standing Sidebar (Cols 9-12) */}
          <aside className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-low font-title-sm text-title-sm text-primary font-bold">
                <span>INSTITUTIONAL STANDING</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between"><span className="text-on-surface-variant">Degree Track:</span><span className="font-bold text-on-surface">B.Tech Honors CSE</span></div>
                <div className="flex items-center justify-between"><span className="text-on-surface-variant">Cumulative GPA:</span><span className="font-bold text-secondary">9.42 / 10.00</span></div>
                <div className="flex items-center justify-between"><span className="text-on-surface-variant">Department Rank:</span><span className="font-bold text-on-surface">Rank 3 of 136 Scholars</span></div>
                <div className="flex items-center justify-between"><span className="text-on-surface-variant">Institute Fellowship:</span><span className="font-bold text-primary">Dean's Research &amp; Merit Fellow</span></div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-space-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-low font-title-sm text-title-sm text-primary font-bold">
                <span>SCORE DISTRIBUTION (CCS)</span>
                <span className="text-xs font-mono text-outline">2,840 Total</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between"><span>Verified Solutions &amp; Q&amp;A</span><span className="font-bold text-primary">1,480 pts (52%)</span></div>
                <div className="flex items-center justify-between"><span>Engineering Milestones &amp; Code</span><span className="font-bold text-secondary">820 pts (29%)</span></div>
                <div className="flex items-center justify-between"><span>Mentorship &amp; Peer TA Sessions</span><span className="font-bold font-semibold text-tertiary-container">320 pts (11%)</span></div>
                <div className="flex items-center justify-between"><span>Faculty Sign-Offs &amp; Grants</span><span className="font-bold text-on-surface">220 pts (8%)</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
