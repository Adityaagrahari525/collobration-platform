import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  ChevronRight,
  Plus,
  Search,
  Database,
  TrendingUp,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  Award,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  GraduationCap,
  ShieldCheck,
  CornerUpLeft
} from "lucide-react";

export const QuestionsFeedPage = () => {
  const navigate = useNavigate();
  const { questions, voteQuestion } = useApp();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = questions.filter((q) => {
    if (activeTab === "unanswered" && ((q.answersCount || 0) > 0 || (q.answers && q.answers.length > 0))) return false;
    if (activeTab === "endorsed" && !q.isFacultyEndorsed) return false;
    if (!searchQuery) return true;
    return (
      q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }).sort((a, b) => {
    if (activeTab === "trending") return (b.votes || 0) - (a.votes || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-space-md lg:px-space-lg py-space-md space-y-space-md bg-surface">
      {/* Top Breadcrumb & Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-surface-container-high">
        <div className="space-y-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            <span>Academic Network</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Knowledge Exchange</span>
            <ChevronRight className="w-3.5 h-3.5" />
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
            <Plus className="w-4 h-4" />
            <span>Ask Question</span>
          </button>
        </div>
      </div>

      {/* Search & Total Question Strip */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-space-sm border border-surface-container-high">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
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
            <Database className="w-4 h-4 text-primary" />
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
              <TrendingUp className="w-4 h-4" />
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
              <CheckCircle2 className="w-4 h-4 text-secondary" />
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
            <SlidersHorizontal className="w-4 h-4" />
            <span>Institutional Filters &amp; Cohort Criteria</span>
          </div>
          <button className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1" id="reset-filters">
            <RotateCcw className="w-3.5 h-3.5" />
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
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
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
                <Award className="w-3.5 h-3.5" />
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
          {filteredQuestions.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-lg p-space-xl text-center border border-surface-container-high shadow-sm space-y-3">
              <HelpCircle className="w-10 h-10 text-outline" />
              <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">No questions found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                No academic inquiries match your current filters. Post a question to start a consortium discussion!
              </p>
              <button
                onClick={() => navigate("/questions/ask")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded font-title-sm shadow-sm hover:bg-primary-container"
              >
                <Plus className="w-4 h-4" />
                <span>Ask Question</span>
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const answersCount = q.answersCount !== undefined ? q.answersCount : (q.answers?.length || 0);
              const authorName = q.isAnonymous ? "Anonymous Scholar" : (q.author?.name || `${q.author?.firstName || ""} ${q.author?.lastName || ""}`.trim() || q.authorName || "Consortium Scholar");
              const authorInstitution = q.author?.institution || q.author?.institutionDetail?.name || q.department || "Academic Consortium";

              return (
                <article
                  key={q.id}
                  className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm hover:bg-surface-bright transition-all border border-surface-container-high"
                >
                  <div className="flex flex-col sm:flex-row gap-space-md">
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:w-28 shrink-0 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          voteQuestion(q.id);
                        }}
                        className={`flex sm:flex-col items-center sm:items-end gap-1 px-2.5 py-1 rounded transition-colors ${
                          q.userVoted ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container-low text-on-surface"
                        }`}
                        title="Upvote inquiry"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-title-md text-title-md font-bold">{q.votes || 0}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">votes</span>
                      </button>

                      {q.isFacultyEndorsed && (
                        <div className="bg-secondary text-on-secondary px-2 py-1 rounded text-center sm:w-full">
                          <div className="font-title-sm text-title-sm font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div className="font-label-sm text-label-sm leading-none text-white/90">Faculty Endorsed</div>
                        </div>
                      )}

                      <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{answersCount} ans</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 min-w-0">
                      <div>
                        <h2
                          onClick={() => navigate(`/questions/${q.id}`)}
                          className="font-title-md text-title-md text-primary font-bold hover:underline line-clamp-2 cursor-pointer"
                        >
                          {q.title}
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                          {q.description}
                        </p>
                      </div>

                      {q.tags && q.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {q.tags.map((t, idx) => (
                            <span
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery(t);
                              }}
                              className="bg-surface-container-low text-primary px-2 py-0.5 rounded font-label-sm text-label-sm hover:bg-surface-container cursor-pointer font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-low/50 px-2 py-1.5 rounded">
                        <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span>{q.subject || q.department || "Academic Network"}</span>
                        </div>
                        <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                          <span className="font-semibold text-on-surface">{authorName}</span>
                          <span>•</span>
                          <span className="bg-surface-container px-1 rounded text-primary">{authorInstitution}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
          
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
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
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
                <GraduationCap className="w-5 h-5 text-primary" />
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
                <HelpCircle className="w-4 h-4 text-primary" />
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
                    <CornerUpLeft className="w-3.5 h-3.5" /> Solve
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
                    <CornerUpLeft className="w-3.5 h-3.5" /> Solve
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Integrity Guidelines Widget */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-2 border border-surface-container-high">
            <div className="flex items-center gap-1.5 text-on-surface font-title-sm text-title-sm font-bold">
              <ShieldCheck className="w-4.5 h-4.5 text-secondary" />
              <span>Integrity Standards</span>
            </div>
            <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>All equations require LaTeX verification</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>Code benchmarks must include toolchain metadata</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
