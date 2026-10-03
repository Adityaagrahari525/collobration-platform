import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Info, ArrowRight, Plus, X, FolderPlus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { computeCompatibility, buildMatchExplanation } from "../utils/matchingAlgorithm";

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, currentUser, createProject } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [skillsStr, setSkillsStr] = useState("PyTorch, Embedded C++, Distributed Systems");

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const parsedSkills = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
      await createProject({
        title,
        tagline: tagline || description.slice(0, 100),
        description,
        skillsRequired: parsedSkills,
        requiredSkills: parsedSkills,
        institution: currentUser?.institution || "IIT Delhi",
        status: "ACTIVE",
      });
      setIsModalOpen(false);
      setTitle("");
      setTagline("");
      setDescription("");
    } catch (err) {
      alert(err.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-primary text-on-primary rounded-xl font-title-sm text-title-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Research Project</span>
        </button>
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

      {/* Post Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
              <div className="flex items-center gap-2 text-primary font-serif font-bold text-headline-sm">
                <FolderPlus className="w-5 h-5 text-primary" />
                <span>Post Inter-Institutional Project</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-label-sm font-semibold text-on-surface">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Quantum State Simulator"
                  className="w-full h-10 px-3 bg-surface-container-low border border-surface-container-high rounded-lg text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-label-sm font-semibold text-on-surface">Tagline / Short Brief</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. GPU-accelerated qubit state vector evolution across NKN nodes"
                  className="w-full h-10 px-3 bg-surface-container-low border border-surface-container-high rounded-lg text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-label-sm font-semibold text-on-surface">Description & Objectives</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the research scope, datasets involved, and open collaboration roles..."
                  className="w-full p-3 bg-surface-container-low border border-surface-container-high rounded-lg text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-label-sm font-semibold text-on-surface">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="PyTorch, C++, Rust, ROS2, Edge AI"
                  className="w-full h-10 px-3 bg-surface-container-low border border-surface-container-high rounded-lg text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-md text-label-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg font-label-md text-label-md font-semibold transition-all shadow-sm"
                >
                  {isSubmitting ? "Publishing..." : "Publish Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

