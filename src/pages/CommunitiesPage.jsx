import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  CheckCircle2,
  Lock,
  Clock,
  Search,
  ChevronDown,
  LayoutGrid,
  GitBranch,
  Users,
  GraduationCap,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const CommunitiesPage = () => {
  const navigate = useNavigate();
  const { communities, joinCommunity, leaveCommunity } = useApp();
  const [selectedDiscipline, setSelectedDiscipline] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const disciplines = [
    "1. All Communities",
    "2. AI / ML",
    "3. Web Development",
    "4. Cybersecurity",
    "5. Electronics",
    "6. Data Science",
    "7. Entrepreneurship",
    "8. Research",
    "9. Design",
    "10. Mechanical",
    "11. Civil"
  ];

  const safeCommunities = Array.isArray(communities) ? communities : [];
  const filteredCommunities = safeCommunities.filter((c) => {
    if (selectedDiscipline > 0) {
      const discRaw = disciplines[selectedDiscipline].replace(/^\d+\.\s*/, "").toLowerCase();
      const cat = (c.category || "").toLowerCase();
      if (!cat.includes(discRaw) && !discRaw.includes(cat)) {
        return false;
      }
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      (c.institution && typeof c.institution === "string" && c.institution.toLowerCase().includes(q))
    );
  });

  const handleToggleJoin = async (c) => {
    if (c.isMember) {
      if (leaveCommunity) await leaveCommunity(c.id);
    } else {
      if (joinCommunity) await joinCommunity(c.id);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Archival Header & Institutional Metadata Banner */}
      <section className="w-full bg-surface-container-lowest shadow-sm px-space-lg py-space-xl">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-lg">
            <div className="space-y-space-xs max-w-3xl">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded">Consortium Node 04 / Multi-Campus Index</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">•</span>
                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 font-medium">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  Authenticated via .ac.in
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-primary tracking-tight font-headline-lg">Communities</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Discipline-focused consortium hubs for collaborative inquiry, open-source repositories, and inter-institutional research.
              </p>
            </div>
            {/* Institutional Stats Strip */}
            <div className="flex items-center gap-space-lg bg-surface-container-low px-space-md py-space-sm rounded shadow-sm self-start lg:self-auto">
              <div className="space-y-0.5">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Indexed Guilds</div>
                <div className="font-headline-sm text-headline-sm text-primary leading-none">28 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">Hubs</span></div>
              </div>
              <div className="w-px h-8 bg-surface-container"></div>
              <div className="space-y-0.5">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Faculty & Fellows</div>
                <div className="font-headline-sm text-headline-sm text-primary leading-none">4,820 <span class="font-body-sm text-body-sm font-normal text-on-surface-variant">in 140+ Nodes</span></div>
              </div>
              <div className="w-px h-8 bg-surface-container"></div>
              <div className="space-y-0.5">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Peer Validation</div>
                <div className="font-headline-sm text-headline-sm text-tertiary-container leading-none">182 <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">Open Queries</span></div>
              </div>
            </div>
          </div>
          {/* Live Consortium Ledger Visual Micro-Strip */}
          <div className="bg-surface-container-low rounded p-space-sm flex flex-col md:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <span className="w-2 h-2 rounded-full bg-secondary shrink-0 animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider shrink-0">Consortium Dispatch:</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                IISc & IIT-M Joint Task Force submitted RFC-049 to <span className="font-semibold text-primary">Cybersecurity & Cryptographic Verification</span>
              </span>
            </div>
            <div className="flex items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm shrink-0">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lock</span> Tamper-proof Record</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> Updated 4m ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* Query Filtering Architecture */}
      <section className="w-full bg-surface max-w-[1280px] mx-auto px-space-lg pt-space-lg pb-space-md">
        <div className="space-y-space-md">
          {/* Search Input and Sorting Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm">
            <div className="relative flex-1 max-w-2xl">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant text-body-md font-body-md pl-10 pr-28 py-2 rounded focus:outline-none shadow-sm focus:bg-surface-container-lowest border border-surface-container-high"
                placeholder="Search communities by name, topic, or keyword..."
                type="text"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded">
                <span>Filter: ESC</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider shrink-0">Order by</span>
              <div className="relative min-w-[210px]">
                <select className="w-full appearance-none bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-space-sm py-2 rounded focus:outline-none shadow-sm cursor-pointer pr-8 border border-surface-container-high">
                  <option value="velocity">Activity Velocity (Desc)</option>
                  <option value="members">Most Members</option>
                  <option value="unanswered">Most Unanswered Queries</option>
                  <option value="newest">Newest Chartered Node</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
              </div>
              <button className="bg-surface-container-lowest text-on-surface-variant hover:text-primary px-space-sm py-2 rounded shadow-sm flex items-center gap-1 font-label-md text-label-md border border-surface-container-high" title="Toggle Table View">
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
            </div>
          </div>

          {/* 11 Canonical Disciplines Chips */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-2 scrollbar-none">
            {disciplines.map((disc, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDiscipline(idx)}
                className={`px-space-sm py-1.5 rounded font-label-md text-label-md shadow-sm shrink-0 whitespace-nowrap transition-colors ${
                  selectedDiscipline === idx
                    ? "bg-primary text-on-primary font-semibold"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-surface-container-high"
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Card Catalog */}
      <section className="w-full bg-surface max-w-[1280px] mx-auto px-space-lg pb-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredCommunities.length === 0 ? (
            <div className="col-span-full bg-surface-container-lowest p-space-xl rounded text-center border border-surface-container-high shadow-sm space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">hub</span>
              <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">No communities found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Try selecting "All Communities" or adjust your search term.
              </p>
            </div>
          ) : (
            filteredCommunities.map((c) => {
              const institutionName = typeof c.institution === "string" ? c.institution : (c.institution?.name || "Academic Consortium");

              return (
                <article
                  key={c.id}
                  className="bg-surface-container-lowest rounded shadow-sm p-space-md flex flex-col justify-between hover:shadow-md transition-shadow border border-surface-container-high"
                >
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between gap-space-xs">
                      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider bg-surface-container px-2 py-0.5 rounded">
                        {c.category || "General Academic"}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-secondary">verified</span>
                        {institutionName}
                      </span>
                    </div>

                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface leading-snug">{c.name}</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-3">
                        {c.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-space-sm rounded">
                      <div className="space-y-0.5">
                        <div className="font-label-sm text-label-sm text-on-surface-variant">Scholars Enrolled</div>
                        <div className="font-title-sm text-title-sm text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">groups</span>
                          {c.memberCount || 1} Verified
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-label-sm text-label-sm text-on-surface-variant">Consortium Node</div>
                        <div className="font-title-sm text-title-sm text-secondary truncate flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">school</span>
                          {institutionName}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-space-md mt-space-md bg-surface-container-lowest flex items-center justify-between gap-space-sm border-t border-surface-container-low">
                    <button
                      onClick={() => handleToggleJoin(c)}
                      className={`px-space-md py-1.5 rounded font-label-md text-label-md transition-colors shadow-sm ${
                        c.isMember
                          ? "bg-secondary-container text-on-secondary-container font-semibold"
                          : "bg-primary text-on-primary hover:bg-primary-container font-semibold"
                      }`}
                    >
                      {c.isMember ? "Joined Hub ✓" : "Join Hub"}
                    </button>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/questions");
                      }}
                      className="font-label-md text-label-md text-primary hover:text-primary-container flex items-center gap-1 font-semibold cursor-pointer"
                      href="#discourse"
                    >
                      Explore Q&A <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Paginated Navigation & Archival Pagination */}
        <div className="mt-space-xl pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            Showing <span className="font-semibold text-on-surface">1 - 9</span> of <span className="font-semibold text-on-surface">28</span> discipline hubs
          </div>
          <div className="flex items-center gap-1">
            <button className="px-space-sm py-1.5 rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm font-label-md text-label-md flex items-center gap-1 border border-surface-container-high">
              <span className="material-symbols-outlined text-[16px]">chevron_left</span> Previous
            </button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary font-label-md text-label-md shadow-sm">1</button>
            <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md shadow-sm border border-surface-container-high">2</button>
            <button className="w-8 h-8 rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md shadow-sm border border-surface-container-high">3</button>
            <button className="px-space-sm py-1.5 rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm font-label-md text-label-md flex items-center gap-1 border border-surface-container-high">
              Next <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunitiesPage;
