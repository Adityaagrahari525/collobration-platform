import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Info, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { computeCompatibility, buildMatchExplanation } from "../utils/matchingAlgorithm";

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");

  const filteredProjects = projects.filter((p) => {
    const skills = p.skillsRequired || p.requiredSkills || [];
    if (filterSkill !== "all" && !skills.includes(filterSkill)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(term);
      const matchDesc = (p.description || p.tagline || "").toLowerCase().includes(term);
      const matchSkill = skills.some((s) => s.toLowerCase().includes(term));
      return matchTitle || matchDesc || matchSkill;
    }
    return true;
  });

  return (
    <div className="space-y-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-surface-container-high pb-space-xs">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-serif">Inter-Institutional Projects</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Collaborate on real-world academic research, open hardware telemetry, and computational infrastructure across India.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-space-md bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3.5 text-outline w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects by title, tagline, or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-surface-container-low border border-surface-container-high rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>

        <select
          value={filterSkill}
          onChange={(e) => setFilterSkill(e.target.value)}
          className="h-11 px-4 bg-surface-container-low border border-surface-container-high rounded-lg text-body-md font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Skills</option>
          <option value="Embedded C++">Embedded C++</option>
          <option value="PyTorch">PyTorch</option>
          <option value="ROS2">ROS2</option>
          <option value="Edge AI">Edge AI</option>
          <option value="Distributed Systems">Distributed Systems</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {filteredProjects.map((p) => {
          const skills = p.skillsRequired || p.requiredSkills || [];
          const matchScore = currentUser ? computeCompatibility(currentUser, { ...p, requiredSkills: skills }) : 85;
          const matchExplanation = currentUser ? buildMatchExplanation(currentUser, { ...p, requiredSkills: skills }) : "";

          return (
            <div
              key={p.id}
              className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs space-y-space-md flex flex-col justify-between hover:shadow-md hover:border-secondary/60 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-secondary-container/40 text-on-secondary-container font-mono text-label-sm font-semibold rounded-md uppercase">
                      {p.status}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-label-sm font-bold rounded-md flex items-center gap-1 border border-emerald-500/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      {matchScore}% Match
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-outline font-mono font-medium max-w-[220px] truncate">{p.institution}</span>
                </div>

                <h2
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="font-headline-sm text-headline-sm text-on-surface font-serif font-semibold hover:text-secondary cursor-pointer transition-colors"
                >
                  {p.title}
                </h2>

                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {p.tagline || p.description}
                </p>

                {matchExplanation && (
                  <div className="p-2.5 bg-surface-container-low rounded-lg border border-surface-container-high text-label-sm text-on-surface-variant flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{matchExplanation}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="text-label-sm text-outline font-semibold uppercase">Required Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-md font-label-sm font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-body-sm text-body-sm text-outline">Lead: {p.lead || "Project Lead"}</span>
                </div>
                <button
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                >
                  <span>View Workspace & Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

