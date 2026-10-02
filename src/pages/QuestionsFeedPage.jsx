import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const QuestionsFeedPage = () => {
  const navigate = useNavigate();
  const { questions, voteQuestion } = useApp();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = questions.filter((q) => {
    if (!searchQuery) return true;
    return (
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-space-md lg:px-space-lg py-space-md space-y-space-md bg-surface">
      {/* Top Breadcrumb & Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-surface-container-high">
        <div className="space-y-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            <span>Academic Network</span>
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            <span>Knowledge Exchange</span>
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            <span className="text-primary font-semibold">Questions</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif">Questions</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Explore, resolve, and cite academic inquiries across 140+ verified Indian universities and research institutes.
          </p>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={() => navigate("/questions/ask")}
            className="flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container px-space-md py-2 rounded font-title-sm text-title-sm shadow-sm transition-all"
            id="ask-btn"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Ask Question</span>
          </button>
        </div>
      </div>

      {/* Search & Total Question Strip */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-space-sm border border-surface-container-high">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              className="w-full pl-10 pr-24 py-2.5 rounded bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-inner transition-all border border-surface-container-high"
              id="q-search"
              placeholder="Search questions by topic, equation, college or theorem... (e.g. distributed consensus, Raft, Fourier transform)"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Ctrl</kbd>
              <span className="text-on-surface-variant font-label-sm text-label-sm">+</span>
              <kbd className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">K</kbd>
            </div>
          </div>
          <div className="flex items-center gap-2 px-space-sm py-1.5 bg-surface-container-low rounded shrink-0 border border-surface-container-high">
            <span className="material-symbols-outlined text-primary text-[18px]">database</span>
            <span className="font-label-md text-label-md text-on-surface">
              <strong className="text-primary font-bold">4,829</strong> Academic Questions indexed across consortium
            </span>
          </div>
        </div>

        {/* Primary Filter Tabs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-title-sm text-title-sm transition-all ${
                activeTab === "all" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              <span>All Questions</span>
            </button>
            <button
              onClick={() => setActiveTab("unanswered")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-title-sm text-title-sm transition-all ${
                activeTab === "unanswered" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              <span>Unanswered</span>
              <span className="bg-surface-container-highest text-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded-full font-bold">412</span>
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-title-sm text-title-sm transition-all ${
                activeTab === "trending" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>Trending</span>
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-title-sm text-title-sm transition-all ${
                activeTab === "following" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              <span>Following</span>
            </button>
            <button
              onClick={() => setActiveTab("endorsed")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-title-sm text-title-sm transition-all ${
                activeTab === "endorsed" ? "bg-primary text-on-primary font-semibold shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-secondary font-medium"
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
              <span>Faculty Endorsed</span>
            </button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Sort:</span>
            <select className="bg-surface-container-low text-on-surface font-title-sm text-title-sm px-2.5 py-1 rounded focus:outline-none border border-surface-container-high">
              <option>Most Votes</option>
              <option>Newest Inquiries</option>
              <option>Most Discussed</option>
              <option>Highest Impact</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-space-sm border border-surface-container-high">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Institutional Filters &amp; Cohort Criteria</span>
          </div>
          <button className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1" id="reset-filters">
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Reset Filters
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Department</label>
            <select className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded focus:outline-none border border-surface-container-high">
              <option>Computer Science &amp; Eng</option>
              <option>Electrical &amp; Electronics</option>
              <option>Mechanical Eng</option>
              <option>Physics &amp; Pure Mathematics</option>
              <option>Chemical &amp; Materials</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Subject / Core Domain</label>
            <select className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded focus:outline-none border border-surface-container-high">
              <option>All Specializations</option>
              <option>Distributed Operating Systems</option>
              <option>Quantum Information &amp; Crypto</option>
              <option>Deep Learning Architectures</option>
              <option>FPGA &amp; VLSI Design</option>
              <option>Stochastic Optimization</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Academic Cohort</label>
            <select className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded focus:outline-none border border-surface-container-high">
              <option>All Academic Cohorts</option>
              <option>B.Tech 3rd / 4th Year</option>
              <option>M.Tech / M.S. Research</option>
              <option>Ph.D. Scholar</option>
              <option>Postdoctoral &amp; Faculty</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Consortium Node</label>
            <select className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded focus:outline-none border border-surface-container-high">
              <option>All Consortium Nodes (140+)</option>
              <option>IIT Delhi</option>
              <option>IIT Bombay</option>
              <option>IISc Bangalore</option>
              <option>BITS Pilani</option>
              <option>IIT Madras</option>
              <option>NIT Trichy</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-surface-container-low">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer bg-surface-container-low px-2 py-1 rounded">
              <input defaultChecked className="accent-primary rounded" type="checkbox" />
              <span className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[14px]">verified</span>
                Staff Verified Solutions
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-surface-container-low px-2 py-1 rounded">
              <input className="accent-primary rounded" type="checkbox" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">Anonymous Inquiries Only</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-surface-container-low px-2 py-1 rounded">
              <input className="accent-primary rounded" type="checkbox" />
              <span className="font-label-sm text-label-sm text-tertiary-container font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                Bounty / Research Credits Active
              </span>
            </label>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
            <span>Active Tag Filters:</span>
            <span className="bg-surface-container text-primary px-1.5 py-0.5 rounded font-mono">#rust</span>
            <span className="bg-surface-container text-primary px-1.5 py-0.5 rounded font-mono">#concurrency</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Question Feed (Left 9 Cols) & Academic Rails (Right 3 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Questions List (9 Columns) */}
        <div className="lg:col-span-9 space-y-space-sm">
          {/* Question Item 1 */}
          <article className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm hover:bg-surface-bright transition-all border border-surface-container-high">
            <div className="flex flex-col sm:flex-row gap-space-md">
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:w-28 shrink-0 text-right">
                <div className="flex sm:flex-col items-center sm:items-end gap-1">
                  <span className="font-title-md text-title-md text-on-surface font-bold">48</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">votes</span>
                </div>
                <div className="bg-secondary text-on-secondary px-2 py-1 rounded text-center sm:w-full">
                  <div className="font-title-sm text-title-sm font-bold flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    6
                  </div>
                  <div className="font-label-sm text-label-sm leading-none text-white/90">Faculty Endorsed</div>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">1.4k views</div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/questions/q1");
                    }}
                    className="font-title-md text-title-md text-primary font-bold hover:underline line-clamp-2 cursor-pointer"
                    href="#"
                  >
                    How does Raft handle leader partition during uncommitted log replication under high network jitter?
                  </a>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                    In our lab implementation of Raft consensus in Rust, when the leader network is partitioned after appending log entries to a minority of nodes but before receiving the quorum ack, split-vote cycles occur repeatedly...
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">distributed-systems</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">raft-consensus</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">rust</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">fault-tolerance</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-low/50 px-2 py-1.5 rounded">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary">
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                    <span>Endorsed by Prof. R. Ramanathan (IIT Madras)</span>
                  </div>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-[10px]">DS</div>
                    <span className="font-semibold text-on-surface">Devavrat Saxena</span>
                    <span>•</span>
                    <span className="bg-surface-container px-1 rounded text-primary">Ph.D. Scholar @ IIT Delhi</span>
                    <span>•</span>
                    <span>asked 3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Question Item 2 */}
          <article className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm hover:bg-surface-bright transition-all border border-surface-container-high">
            <div className="flex flex-col sm:flex-row gap-space-md">
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:w-28 shrink-0 text-right">
                <div className="flex sm:flex-col items-center sm:items-end gap-1">
                  <span className="font-title-md text-title-md text-on-surface font-bold">31</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">votes</span>
                </div>
                <div className="bg-surface-container text-secondary px-2 py-1 rounded text-center sm:w-full">
                  <div className="font-title-sm text-title-sm font-bold flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    4
                  </div>
                  <div className="font-label-sm text-label-sm leading-none">Verified Solution</div>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">890 views</div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/questions/q2");
                    }}
                    className="font-title-md text-title-md text-primary font-bold hover:underline line-clamp-2 cursor-pointer"
                    href="#"
                  >
                    Optimizing 2D Fourier Transform decomposition on FPGA systolic arrays for medical imaging
                  </a>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                    We are profiling memory bandwidth bottlenecks during row-column matrix transpose on Xilinx UltraScale+. What pipelining strategies minimize BRAM stalls for 1024x1024 float32 matrices?
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">fpga</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">vlsi-design</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">dsp</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">verilog</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">medical-imaging</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-low/50 px-2 py-1.5 rounded">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Peer review blind evaluation enabled</span>
                  </div>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">visibility_off</span>
                    <span className="font-semibold text-on-surface">Anonymous Scholar</span>
                    <span>•</span>
                    <span className="bg-surface-container px-1 rounded text-on-surface-variant">M.Tech Scholar @ BITS Pilani</span>
                    <span>•</span>
                    <span>asked 5 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Question Item 3 */}
          <article className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm hover:bg-surface-bright transition-all border border-surface-container-high">
            <div className="flex flex-col sm:flex-row gap-space-md">
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:w-28 shrink-0 text-right">
                <div className="flex sm:flex-col items-center sm:items-end gap-1">
                  <span className="font-title-md text-title-md text-on-surface font-bold">19</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">votes</span>
                </div>
                <div className="bg-surface-container-low text-on-surface-variant px-2 py-1 rounded text-center sm:w-full">
                  <div className="font-title-sm text-title-sm font-bold flex items-center justify-center gap-1">0</div>
                  <div className="font-label-sm text-label-sm leading-none text-tertiary-container font-semibold">150 Bounty pts</div>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">340 views</div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/questions/q3");
                    }}
                    className="font-title-md text-title-md text-primary font-bold hover:underline line-clamp-2 cursor-pointer"
                    href="#"
                  >
                    Proving convergence bounds for asynchronous SGD with delayed gradient compensation on non-IID datasets
                  </a>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                    Existing proofs assume bounded gradient delays τ &lt; τ_max. In edge federated clusters with extreme stragglers, delays follow a heavy-tailed Pareto distribution. How do we reformulate the Lipschitz smoothness condition?
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">federated-learning</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">optimization</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">mathematics</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">stochastic-calculus</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-low/50 px-2 py-1.5 rounded">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-tertiary-container font-semibold">
                    <span className="material-symbols-outlined text-[16px]">token</span>
                    <span>150 Research Credits Offered for Rigorous Proof</span>
                  </div>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-[10px]">PV</div>
                    <span className="font-semibold text-on-surface">Pooja Varma</span>
                    <span>•</span>
                    <span className="bg-surface-container px-1 rounded text-primary">Senior UG @ IISc Bangalore</span>
                    <span>•</span>
                    <span>asked 11 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Question Item 4 */}
          <article className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm hover:bg-surface-bright transition-all border border-surface-container-high">
            <div className="flex flex-col sm:flex-row gap-space-md">
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:w-28 shrink-0 text-right">
                <div className="flex sm:flex-col items-center sm:items-end gap-1">
                  <span className="font-title-md text-title-md text-on-surface font-bold">64</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">votes</span>
                </div>
                <div className="bg-secondary text-on-secondary px-2 py-1 rounded text-center sm:w-full">
                  <div className="font-title-sm text-title-sm font-bold flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    12
                  </div>
                  <div className="font-label-sm text-label-sm leading-none text-white/90">2 Staff Answers</div>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">3.2k views</div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/questions/q1");
                    }}
                    className="font-title-md text-title-md text-primary font-bold hover:underline line-clamp-2 cursor-pointer"
                    href="#"
                  >
                    What are the exact computational differences between FlashAttention-2 and standard multi-head self-attention tiled kernels?
                  </a>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                    Tracing through CUDA register allocations and shared memory tile ping-ponging. Does the online softmax normalization require multiple passes over SRAM in warp-level primitives?
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">deep-learning</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">cuda</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">gpu-architecture</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">transformer-models</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-low/50 px-2 py-1.5 rounded">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary">
                    <span className="material-symbols-outlined text-[16px]">code</span>
                    <span>Includes CUDA Profiling Kernel Benchmark Trace</span>
                  </div>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <div className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[10px]">AN</div>
                    <span className="font-semibold text-on-surface">Arjun Nair</span>
                    <span>•</span>
                    <span className="bg-surface-container px-1 rounded text-primary">Adjunct Fellow @ IIT Bombay</span>
                    <span>•</span>
                    <span>asked 1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Question Item 5 */}
          <article className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm hover:bg-surface-bright transition-all border border-surface-container-high">
            <div className="flex flex-col sm:flex-row gap-space-md">
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:w-28 shrink-0 text-right">
                <div className="flex sm:flex-col items-center sm:items-end gap-1">
                  <span className="font-title-md text-title-md text-on-surface font-bold">14</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">votes</span>
                </div>
                <div className="bg-surface-container-low text-on-surface-variant px-2 py-1 rounded text-center sm:w-full">
                  <div className="font-title-sm text-title-sm font-bold flex items-center justify-center gap-1">2</div>
                  <div className="font-label-sm text-label-sm leading-none">Peer Answers</div>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">510 views</div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/questions/q1");
                    }}
                    className="font-title-md text-title-md text-primary font-bold hover:underline line-clamp-2 cursor-pointer"
                    href="#"
                  >
                    Inter-college laboratory resource sharing protocols: How to authenticate via Eduroam across INFLIBNET nodes?
                  </a>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                    Our team from NIT Trichy needs remote access to the high-performance computing cluster at IIT Kanpur for molecular dynamics simulations. What is the institutional token handshake requirement?
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">consortium-policy</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">eduroam</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">inflibnet</span>
                  <span className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono">hpc-access</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-low/50 px-2 py-1.5 rounded">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                    <span>Consortium MoU #718 Applicable</span>
                  </div>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <div className="w-5 h-5 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-[10px]">KS</div>
                    <span className="font-semibold text-on-surface">Karthik Subramanian</span>
                    <span>•</span>
                    <span className="bg-surface-container px-1 rounded text-primary">Lab Admin @ NIT Trichy</span>
                    <span>•</span>
                    <span>asked 2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Pagination & Page Size Control */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm border border-surface-container-high">
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              Showing <strong className="text-on-surface">1–5</strong> of <strong class="text-on-surface">4,829</strong> inquiries
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container" disabled>
                Prev
              </button>
              <button className="px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-bold">1</button>
              <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm">2</button>
              <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm">3</button>
              <span className="px-1 text-on-surface-variant">...</span>
              <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm">967</button>
              <button className="px-2 py-1 rounded bg-surface-container-low text-on-surface font-label-sm text-label-sm hover:bg-surface-container">Next</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Per page:</span>
              <select className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-2 py-1 rounded focus:outline-none border border-surface-container-high">
                <option>15</option>
                <option>30</option>
                <option>50</option>
              </select>
            </div>
          </div>

          {/* Consortium Academic Integrity Notice */}
          <div className="bg-surface-container-low p-space-md rounded-lg flex items-start gap-space-sm text-on-surface-variant border border-surface-container-high">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">policy</span>
            <div className="space-y-1">
              <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">CampusLink Academic Attribution &amp; Quality Mandate</h4>
              <p className="font-body-sm text-body-sm leading-relaxed">
                All technical Q&amp;A contributions are archived under CC-BY-NC 4.0 Institutional Attribution. Plagiarism and automated LLM regurgitation without rigorous mathematical derivation or benchmark reproduction are flagged by consortium peer review.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar / Academic Rails (3 Columns) */}
        <aside className="lg:col-span-3 space-y-space-md">
          {/* User Institutional Node Snapshot */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-3 border border-surface-container-high">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                <span className="font-title-sm text-title-sm text-on-surface font-bold">My Consortium Node</span>
              </div>
              <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-1.5 py-0.5 rounded font-semibold">Active</span>
            </div>
            <div className="space-y-1">
              <div className="font-title-sm text-title-sm text-on-surface font-semibold">IIT Delhi • Node #04</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">Department of Computer Science</div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="bg-surface-container-low p-2 rounded">
                <div className="font-title-md text-title-md font-bold text-primary">28</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Inquiries Solved</div>
              </div>
              <div className="bg-surface-container-low p-2 rounded">
                <div className="font-title-md text-title-md font-bold text-secondary">420</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Scholarly Karma</div>
              </div>
            </div>
          </div>

          {/* Popular Tags in Your Cohort */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-3 border border-surface-container-high">
            <div className="flex items-center justify-between">
              <h3 className="font-title-sm text-title-sm text-on-surface font-bold">Trending in Your Cohort</h3>
              <span onClick={() => navigate("/communities")} className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer">
                Explore All
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <a className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container font-mono" href="#" onClick={(e) => e.preventDefault()}>
                  #distributed-systems
                </a>
                <span className="font-label-sm text-label-sm text-on-surface-variant">1,204 Qs</span>
              </div>
              <div className="flex items-center justify-between">
                <a className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container font-mono" href="#" onClick={(e) => e.preventDefault()}>
                  #cuda-programming
                </a>
                <span className="font-label-sm text-label-sm text-on-surface-variant">892 Qs</span>
              </div>
              <div className="flex items-center justify-between">
                <a className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container font-mono" href="#" onClick={(e) => e.preventDefault()}>
                  #rust-async
                </a>
                <span className="font-label-sm text-label-sm text-on-surface-variant">643 Qs</span>
              </div>
              <div className="flex items-center justify-between">
                <a className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container font-mono" href="#" onClick={(e) => e.preventDefault()}>
                  #vlsi-verification
                </a>
                <span className="font-label-sm text-label-sm text-on-surface-variant">518 Qs</span>
              </div>
              <div className="flex items-center justify-between">
                <a className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container font-mono" href="#" onClick={(e) => e.preventDefault()}>
                  #federated-learning
                </a>
                <span className="font-label-sm text-label-sm text-on-surface-variant">429 Qs</span>
              </div>
            </div>
          </div>

          {/* Unanswered Questions in CSE with Quick Answer */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-3 border border-surface-container-high">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">quiz</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">Unanswered in CSE</h3>
              </div>
              <span className="bg-surface-container px-1.5 py-0.5 rounded font-label-sm text-label-sm text-primary font-bold">Open</span>
            </div>
            <div className="space-y-3 divide-y divide-surface-container">
              <div className="space-y-1.5 pt-1">
                <a onClick={(e) => { e.preventDefault(); navigate("/questions/q-101"); }} className="font-title-sm text-title-sm text-primary hover:underline line-clamp-2 font-medium cursor-pointer" href="#">
                  Lock-free ring buffer memory barrier ordering on ARM Neoverse V2 architectures?
                </a>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>IIT Kharagpur • 4h ago</span>
                  <button onClick={() => navigate("/questions/q-101")} className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">reply</span> Solve
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <a onClick={(e) => { e.preventDefault(); navigate("/questions/q-101"); }} className="font-title-sm text-title-sm text-primary hover:underline line-clamp-2 font-medium cursor-pointer" href="#">
                  Deriving worst-case tail latencies for zero-copy socket buffers in eBPF filters
                </a>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>IIT Roorkee • 6h ago</span>
                  <button onClick={() => navigate("/questions/q-101")} className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">reply</span> Solve
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Integrity Guidelines Widget */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-2 border border-surface-container-high">
            <div className="flex items-center gap-1.5 text-on-surface font-title-sm text-title-sm font-bold">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
              <span>Integrity Standards</span>
            </div>
            <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span>All equations require LaTeX verification</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span>Code benchmarks must include toolchain metadata</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
