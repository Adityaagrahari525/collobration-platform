import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/apiService";
import { CodeEditorModal } from "../components/CodeEditorModal";

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, deleteProject, currentUser } = useApp();

  const [projectDetails, setProjectDetails] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applyModalRole, setApplyModalRole] = useState(null);
  const [pitchText, setPitchText] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const project = projectDetails || projects.find((p) => p.id === id) || projects[0] || {};
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCite, setCopiedCite] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (id) {
      apiService.getProjectById(id).then((res) => {
        if (res.success && res.data) {
          setProjectDetails(res.data);
          if (res.data.applications) {
            setApplications(res.data.applications);
          }
        }
      }).catch(() => {});
    }
  }, [id]);

  const isProjectLead =
    currentUser?.id === project?.leadId ||
    currentUser?.id === project?.ownerId ||
    currentUser?.role === "admin" ||
    currentUser?.rawRole === "ADMIN";

  const userMembership = project?.members?.find((m) => m.userId === currentUser?.id);
  const userApplication = applications?.find((a) => a.applicantId === currentUser?.id);
  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  const handleOpenApplyModal = (role) => {
    const targetRole = role || project?.roles?.[0] || {
      id: project?.roles?.[0]?.id || "default",
      title: "Core Contributor",
      requiredSkills: project?.requiredSkills || [],
    };
    setApplyModalRole(targetRole);
    setPitchText("");
  };

  const handleReviewApplication = async (appId, status) => {
    try {
      await apiService.updateApplicationStatus(appId, status);
      setActionSuccess(`Application status updated to ${status}!`);
      const refreshed = await apiService.getProjectById(id);
      if (refreshed.success && refreshed.data) {
        setProjectDetails(refreshed.data);
        setApplications(refreshed.data.applications || []);
      }
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to update application status.");
    }
  };

  const handleApplySubmit = async (e) => {
    e?.preventDefault();
    if (!applyModalRole) return;
    setIsApplying(true);
    try {
      await apiService.applyToProject(project.id, {
        roleId: applyModalRole.id,
        pitch: pitchText || "I would love to contribute my technical skills and research background to this project.",
      });
      setActionSuccess("Your application was submitted to the project lead!");
      setApplyModalRole(null);
      setPitchText("");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to submit application.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this research project workspace from the database?")) {
      await deleteProject(project.id);
      navigate("/projects");
    }
  };

  const handleCopyCite = () => {
    const bibtex = `@article{floodsense2024,
  title={Low-Cost LoRa Telemetry & Surrogate Catchment GNNs},
  author={Ramanathan, K. and Saxena, D. and Sen, A.},
  journal={CampusLink Consortium},
  year={2024},
  note={Node #PRJ-8842}
}`;
    navigator.clipboard?.writeText(bibtex);
    setCopiedCite(true);
    setTimeout(() => setCopiedCite(false), 2000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Academic Hierarchy & Breadcrumb Status Banner */}
      <div className="flex flex-col gap-space-sm mb-space-lg">
        {/* Breadcrumb Line */}
        <div className="flex flex-wrap items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
          <span onClick={() => navigate("/dashboard")} className="hover:text-primary transition-colors cursor-pointer">Academic Network</span>
          <span className="material-symbols-outlined text-[13px] text-outline-variant">chevron_right</span>
          <span onClick={() => navigate("/projects")} className="hover:text-primary transition-colors cursor-pointer">Projects</span>
          <span className="material-symbols-outlined text-[13px] text-outline-variant">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer">AI / IoT / GIS</span>
          <span className="material-symbols-outlined text-[13px] text-outline-variant">chevron_right</span>
          <span className="text-on-surface font-semibold font-mono tracking-tight">{project.title || "FloodSense"}</span>
          <span className="ml-space-xs px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[10px] tracking-wider uppercase">Project #PRJ-8842</span>
          <span className="text-outline-variant">·</span>
          <span className="text-on-surface-variant font-mono text-[11px]">NKN Consortium Node #772</span>
        </div>
        {/* Active Consortium Alert Strip */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm px-space-md py-2 bg-surface-container-low rounded-lg">
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant uppercase tracking-wider font-semibold">Active Collaboration Sprint #1</span>
            </div>
            <div className="hidden sm:block h-3.5 w-px bg-outline-variant"></div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary-container text-[16px]">person_add</span>
              <span className="font-label-sm text-label-sm text-on-surface font-medium">Looking for contributors (2 Open Roles)</span>
            </div>
            <div className="hidden md:block h-3.5 w-px bg-outline-variant"></div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Last commit: <span className="font-mono text-on-surface">4h ago</span> by IIT Roorkee Hydro-Informatics Lab</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-3 py-1.5 bg-primary text-on-primary rounded text-label-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              <span>Open Monaco Workspace</span>
            </button>
            <span className="font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded text-secondary font-mono font-medium">Peer-Reviewed Protocol v0.3</span>
          </div>
        </div>
      </div>

      {/* Project Header Dossier */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg mb-space-lg shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-lg">
          <div className="flex-1 space-y-space-sm">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-mono">SERB Grant ID: #SRB-2024-89</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">CC BY-NC-SA 4.0</span>
              <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                Consortium Multi-Campus Project
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight">
              {project.title || "FloodSense"}
            </h1>
            <p className="font-headline-sm text-headline-sm text-on-surface-variant font-serif italic max-w-4xl leading-snug">
              {project.tagline || "Urban Flash-Flood Early Warning & Runoff Prediction via Low-Cost LoRaWAN Telemetry & Hydrological Neural Surrogates"}
            </p>
            {/* Domain Badges */}
            <div className="flex flex-wrap items-center gap-space-xs pt-1">
              <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono hover:bg-surface-container-high transition-colors cursor-default">
                AI / Machine Learning
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono hover:bg-surface-container-high transition-colors cursor-default">
                IoT & Embedded Systems
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono hover:bg-surface-container-high transition-colors cursor-default">
                GIS & Hydrology
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono hover:bg-surface-container-high transition-colors cursor-default">
                Disaster Resilience
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-low text-primary font-label-sm text-label-sm font-mono">
                Yamuna Basin Catchment
              </span>
            </div>
          </div>
          {/* Action Panel */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-space-xs shrink-0 lg:w-56">
            {isProjectLead ? (
              <div className="w-full py-2.5 px-3 bg-primary/10 border border-primary/20 text-primary rounded-lg font-title-sm text-center flex items-center justify-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>You are Project Lead</span>
              </div>
            ) : userMembership ? (
              <div className="w-full py-2.5 px-3 bg-secondary-container text-on-secondary-container rounded-lg font-title-sm text-center flex items-center justify-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Active Team Member</span>
              </div>
            ) : userApplication ? (
              <div className="w-full py-2.5 px-3 bg-surface-container-high text-primary rounded-lg font-title-sm text-center flex items-center justify-center gap-1.5 font-medium border border-outline-variant/60">
                <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                <span>Application {userApplication.status}</span>
              </div>
            ) : (
              <button
                onClick={() => handleOpenApplyModal()}
                className="w-full inline-flex items-center justify-center gap-2 font-title-sm text-title-sm px-4 py-2.5 rounded-lg transition-all bg-primary-container text-on-primary hover:bg-primary shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">group_add</span>
                <span>Request to Join</span>
              </button>
            )}
            <button
              onClick={() => navigate("/messages")}
              className="w-full inline-flex items-center justify-center gap-2 bg-surface-container-low text-on-surface font-title-sm text-title-sm px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              <span>Contact Team</span>
            </button>
            {isProjectLead && (
              <button
                onClick={handleDeleteProject}
                className="w-full inline-flex items-center justify-center gap-2 bg-error-container text-on-error-container font-title-sm text-title-sm px-4 py-2 rounded-lg hover:bg-error/20 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Delete Workspace</span>
              </button>
            )}
            <div className="grid grid-cols-3 gap-1 pt-1">
              <button className="flex flex-col items-center justify-center p-2 rounded bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant transition-colors" title="Watch Repository" type="button">
                <span className="material-symbols-outlined text-[18px] text-primary">star</span>
                <span className="font-label-sm text-[10px] mt-0.5 font-mono">148</span>
              </button>
              <button onClick={handleCopyCite} className="flex flex-col items-center justify-center p-2 rounded bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant transition-colors" title="Fork Specification" type="button">
                <span className="material-symbols-outlined text-[18px]">call_split</span>
                <span className="font-label-sm text-[10px] mt-0.5 font-mono">Cite</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 rounded bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant transition-colors" title="Share Project" type="button">
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span className="font-label-sm text-[10px] mt-0.5 font-mono">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Workspace Layout (70% Left / 30% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg">
        {/* Left Column: Scientific Specification & Collaboration (7 Columns) */}
        <div className="lg:col-span-7 space-y-space-lg">
          {actionSuccess && (
            <div className="p-3.5 bg-secondary-container text-on-secondary-container rounded-xl flex items-center gap-2 text-title-sm font-medium shadow-sm animate-fade-in">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Navigation Document Tabs */}
          <div className="bg-surface-container-lowest rounded-xl p-space-xs shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto text-body-md font-body-md">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-semibold text-title-sm whitespace-nowrap transition-colors ${
                  activeTab === "overview" ? "bg-surface-container text-primary" : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>Overview & Architecture</span>
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`flex items-center gap-2 px-space-md py-2 rounded-lg text-title-sm whitespace-nowrap transition-colors ${
                  activeTab === "roles" ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>Open Roles</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-tertiary-container text-white text-[10px] font-mono leading-tight">
                  {project.roles?.length || 2}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("milestones")}
                className={`flex items-center gap-2 px-space-md py-2 rounded-lg text-title-sm whitespace-nowrap transition-colors ${
                  activeTab === "milestones" ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">timeline</span>
                <span>Milestone Roadmap</span>
              </button>
              <button
                onClick={() => setActiveTab("datasets")}
                className={`flex items-center gap-2 px-space-md py-2 rounded-lg text-title-sm whitespace-nowrap transition-colors ${
                  activeTab === "datasets" ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span>Datasets & Code</span>
              </button>
              <button
                onClick={() => setActiveTab("discussions")}
                className={`flex items-center gap-2 px-space-md py-2 rounded-lg text-title-sm whitespace-nowrap transition-colors ${
                  activeTab === "discussions" ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">forum</span>
                <span>Discussions</span>
                <span className="ml-1 px-1.5 py-0.2 rounded bg-surface-container text-outline text-[10px] font-mono">19</span>
              </button>
              {isProjectLead && (
                <button
                  onClick={() => setActiveTab("applications")}
                  className={`flex items-center gap-2 px-space-md py-2 rounded-lg text-title-sm whitespace-nowrap transition-colors ${
                    activeTab === "applications" ? "bg-primary text-on-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Review Applications</span>
                  {pendingCount > 0 ? (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-error text-white text-[10px] font-mono leading-tight font-bold">
                      {pendingCount}
                    </span>
                  ) : (
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-surface-container text-outline text-[10px] font-mono">
                      {applications.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Applications Review Section (Rendered when activeTab === 'applications') */}
          {activeTab === "applications" && (
            <section className="bg-surface-container-lowest rounded-xl p-space-lg space-y-space-md shadow-sm border border-outline-variant/60">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">how_to_reg</span>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Candidate Applications & Peer Review
                    </h2>
                    <p className="text-body-sm text-on-surface-variant">
                      Review applicant backgrounds, pitch statements, and academic qualifications. Accepting adds candidate to PostgreSQL project membership.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-label-sm px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-semibold">
                  {applications.length} Received
                </span>
              </div>

              {applications.length === 0 ? (
                <div className="p-8 text-center bg-surface-container-low rounded-xl text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
                  <p className="font-medium">No candidate applications currently pending review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const applicantName = app.applicant ? `${app.applicant.firstName} ${app.applicant.lastName}` : "Applicant";
                    const institutionName = app.applicant?.institution?.name || "Academic Institution";
                    const skills = app.applicant?.userSkills?.map((us) => us.skill?.name).filter(Boolean) || [];
                    const isPending = app.status === "PENDING";
                    const isAccepted = app.status === "ACCEPTED";
                    const isRejected = app.status === "REJECTED";

                    return (
                      <div key={app.id} className="p-5 rounded-xl bg-surface border border-outline-variant/60 flex flex-col gap-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-lg">
                              {applicantName[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-title-md font-bold text-on-surface">{applicantName}</h3>
                                <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-surface-container text-on-surface-variant">
                                  {institutionName}
                                </span>
                                {app.matchScore && (
                                  <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-secondary-fixed text-on-secondary-fixed">
                                    {app.matchScore}% Match
                                  </span>
                                )}
                              </div>
                              <p className="text-body-sm text-on-surface-variant mt-0.5">
                                Applied for: <span className="font-semibold text-primary">{app.role?.title || "Project Role"}</span> · {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                              <span className="text-xs text-outline font-mono">{app.applicant?.email}</span>
                            </div>
                          </div>
                          <div>
                            {isPending && (
                              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-300">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                Pending Review
                              </span>
                            )}
                            {isAccepted && (
                              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                Accepted & Joined
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-100 text-red-800 border border-red-300">
                                Declined
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Pitch Statement */}
                        <div className="p-3.5 bg-surface-container-low rounded-lg border border-surface-container text-body-sm">
                          <span className="text-xs font-mono uppercase text-outline font-semibold block mb-1">Scholar Statement / Pitch:</span>
                          <p className="text-on-surface leading-relaxed italic">"{app.pitch}"</p>
                        </div>

                        {/* Applicant Skills */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-mono uppercase text-outline font-semibold">Verified Skills:</span>
                            {skills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px] text-primary font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Review Actions if PENDING */}
                        {isPending && (
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                            <button
                              onClick={() => handleReviewApplication(app.id, "REJECTED")}
                              className="px-4 py-1.5 rounded-lg border border-error/40 text-error hover:bg-error/10 text-title-sm font-medium transition-colors"
                              type="button"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleReviewApplication(app.id, "ACCEPTED")}
                              className="px-5 py-1.5 rounded-lg bg-secondary text-on-secondary hover:bg-secondary/90 text-title-sm font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">check</span>
                              <span>Accept into Project</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Section 1: Problem Statement & Catchment Modeling */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg space-y-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">troubleshoot</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">1. Problem Statement & Regional Context</h2>
              </div>
              <span className="font-label-sm text-label-sm font-mono text-outline uppercase tracking-wider">Doc ID: FS-PR-01</span>
            </div>
            <div className="p-space-md rounded-lg bg-surface-container-low text-on-surface space-y-space-sm">
              <p className="font-body-md text-body-md leading-relaxed text-on-surface">
                High-density urban flash floods across monsoonal Indian catchments—specifically focusing on the
                <strong className="font-semibold text-primary"> Yamuna drainage corridor (NCT Delhi)</strong> and the
                <strong className="font-semibold text-primary"> Chennai Adyar-Cooum stormwater mesh</strong>—exhibit spatial latency that conventional Doppler radar and IMD gridded products fail to resolve. Sub-hourly, street-level inundation occurs within <span className="font-mono text-on-surface font-semibold">12 to 25 minutes</span> of cloudburst events.
              </p>
              <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                Commercial telemetry stations (e.g., radar level transmitters, acoustic Doppler velocity meters) require imported infrastructure costing upwards of <span className="font-mono text-error font-medium">₹80,000 to ₹1,40,000 per observation point</span>, making hyper-local municipal mesh coverage economically unviable for urban local bodies (ULBs).
              </p>
            </div>
            {/* Metric comparison table: Legacy vs FloodSense */}
            <div className="overflow-x-auto rounded-lg bg-surface border border-surface-container-high">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container text-on-surface font-semibold uppercase font-label-sm tracking-wider text-[11px]">
                  <tr>
                    <th className="p-space-sm">Hydrological Parameter</th>
                    <th className="p-space-sm">Commercial SCADA Station</th>
                    <th className="p-space-sm">Doppler Radar (IMD)</th>
                    <th className="p-space-sm bg-primary-container text-on-primary">FloodSense Node (Target)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high font-mono text-[12px]">
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="p-space-sm font-sans font-medium text-on-surface">Telemetry Unit Capital Cost</td>
                    <td className="p-space-sm text-error">₹85,000+</td>
                    <td className="p-space-sm text-outline">Centralized (~₹15 Cr)</td>
                    <td className="p-space-sm font-bold text-secondary bg-primary-container/5">₹3,400 per node</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="p-space-sm font-sans font-medium text-on-surface">Temporal Sampling Resolution</td>
                    <td className="p-space-sm">15-minute polling</td>
                    <td className="p-space-sm">30-60 minutes</td>
                    <td className="p-space-sm font-bold text-primary bg-primary-container/5">30-second burst telemetry</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="p-space-sm font-sans font-medium text-on-surface">Backhaul Survivability</td>
                    <td className="p-space-sm">4G/LTE (fails on grid outage)</td>
                    <td className="p-space-sm">Satellite link</td>
                    <td className="p-space-sm font-bold text-secondary bg-primary-container/5">LoRaWAN Mesh (865-867 MHz)</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50">
                    <td className="p-space-sm font-sans font-medium text-on-surface">Hydrological Predictive Lead</td>
                    <td className="p-space-sm text-outline">None (Pure telemetry)</td>
                    <td className="p-space-sm">Empirical Nowcasting</td>
                    <td className="p-space-sm font-bold text-primary bg-primary-container/5">15-min PI-GNN Inundation (94.2%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Proposed Solution & System Architecture */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg space-y-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">schema</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">2. Solution & Technical Architecture</h2>
              </div>
              <span className="font-label-sm text-label-sm font-mono text-outline uppercase tracking-wider">Arch Tier 1-3</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              FloodSense deploys a resilient two-tier architecture: autonomous, ultra-low-power field sensor nodes with LoRa backhaul routed to campus gateways, combined with cloud/edge hydrological surrogates trained on the 30-meter Copernicus Sentinel-2 DEM and historical SWMM stormwater network logs.
            </p>
            {/* Inline Data Visual Architecture Diagram (SVG) */}
            <div className="p-space-md rounded-lg bg-surface-container-low">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-title-sm text-title-sm text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">hub</span>
                  Edge-to-Consortium Dataflow Pipeline
                </span>
                <span className="font-mono text-label-sm text-label-sm text-outline">Lat: &lt; 420ms · Loss: 0.12%</span>
              </div>
              <svg className="w-full h-auto text-on-surface" viewBox="0 0 740 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Node Tier 1 */}
                <rect x="10" y="20" width="160" height="140" rx="8" fill="#ffffff" className="stroke-primary/20" strokeWidth="1.5"></rect>
                <text x="25" y="45" className="font-mono text-[11px] font-bold fill-current text-primary">TIER 1: FIELD NODES</text>
                <text x="25" y="68" className="font-sans text-[11px] fill-current text-on-surface-variant">• ESP32-S3 + SX1262</text>
                <text x="25" y="88" className="font-sans text-[11px] fill-current text-on-surface-variant">• Ultrasonic JSN-SR04T</text>
                <text x="25" y="108" className="font-sans text-[11px] fill-current text-on-surface-variant">• 1.2W Solar Harvester</text>
                <rect x="25" y="124" width="130" height="22" rx="4" fill="#eaedff"></rect>
                <text x="40" y="139" className="font-mono text-[10px] font-semibold fill-current text-primary">Burst: 30s @ 866 MHz</text>

                {/* Arrow 1 */}
                <path d="M170 90 L230 90" stroke="#757682" strokeWidth="1.5" strokeDasharray="4 4"></path>
                <polygon points="230,90 222,86 222,94" fill="#757682"></polygon>
                <text x="180" y="80" className="font-mono text-[9px] fill-current text-outline">LoRaWAN</text>

                {/* Node Tier 2 */}
                <rect x="240" y="20" width="180" height="140" rx="8" fill="#ffffff" className="stroke-secondary/30" strokeWidth="1.5"></rect>
                <text x="255" y="45" className="font-mono text-[11px] font-bold fill-current text-secondary">TIER 2: CAMPUS GATEWAY</text>
                <text x="255" y="68" className="font-sans text-[11px] fill-current text-on-surface-variant">• NKN RAK7289 Gateway</text>
                <text x="255" y="88" className="font-sans text-[11px] fill-current text-on-surface-variant">• MQTT Ingestion Broker</text>
                <text x="255" y="108" className="font-sans text-[11px] fill-current text-on-surface-variant">• TimescaleDB Hypertable</text>
                <rect x="255" y="124" width="150" height="22" rx="4" fill="#82f5c1" fillOpacity="0.25"></rect>
                <text x="268" y="139" className="font-mono text-[10px] font-semibold fill-current text-on-secondary-container">Telemetry Validation OK</text>

                {/* Arrow 2 */}
                <path d="M420 90 L480 90" stroke="#757682" strokeWidth="1.5"></path>
                <polygon points="480,90 472,86 472,94" fill="#757682"></polygon>
                <text x="432" y="80" className="font-mono text-[9px] fill-current text-outline">NKN Mesh</text>

                {/* Node Tier 3 */}
                <rect x="490" y="20" width="235" height="140" rx="8" fill="#ffffff" className="stroke-primary/30" strokeWidth="1.5"></rect>
                <text x="505" y="45" className="font-mono text-[11px] font-bold fill-current text-primary-container">TIER 3: HYDRO-NEURAL MODEL</text>
                <text x="505" y="68" className="font-sans text-[11px] fill-current text-on-surface-variant">• PyTorch Geometric (PyG)</text>
                <text x="505" y="88" className="font-sans text-[11px] fill-current text-on-surface-variant">• Physics-Informed GNN Loss</text>
                <text x="505" y="108" className="font-sans text-[11px] fill-current text-on-surface-variant">• 15-min Inundation Horizon</text>
                <rect x="505" y="124" width="205" height="22" rx="4" fill="#1e3a8a"></rect>
                <text x="520" y="139" className="font-mono text-[10px] font-semibold fill-white">94.2% Watershed Accuracy</text>
              </svg>
            </div>

            {/* Field Deployment Gallery (2 Imagery Anchors) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
              <div className="relative rounded-lg overflow-hidden bg-surface-container group">
                <img
                  className="w-full h-44 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAMZOnfJD-v9IZwoKPzkpNa6eUjj7s64AFjy03HKk274uDy2QsnhpKhKRQjqyPU24nn7g7TmvZK9kQK_jGYdnG6m8G6Qt-Zl7a_BBXq5Rnr8DWkussoAL-eQkObdjyNnVG0AYX-s70ZgZfcDV13g4Z5SKkxSfLf72G5zN9CxHHiL1KJ2sGvj4wshSiRem3Uw3A5NJHZp7qNeoib7T7SNuITfvlCJ3Ve3EWOvE4HgIlz2n2qx3LbC3e"
                  alt="Ultrasonic Sensor Hardware"
                />
                <div className="p-space-sm bg-surface-container-lowest">
                  <div className="flex items-center justify-between text-label-sm font-label-sm">
                    <span className="font-mono font-semibold text-primary">Node #07 Field Unit</span>
                    <span className="text-secondary font-mono">Telemetry OK · 3.9V</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Roorkee Upper Ganga Canal deployment pilot</p>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-surface-container group">
                <img
                  className="w-full h-44 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhye8QSA2VJibwZju-q4gnb-jEiZC4EaR3Vf3lQXeMt8t1kqP0478JM0EOGzz3nQOL7MMR2qveNUcJAL2UtXpwHS8t0ThGJgiJG8PkZW8KqefXriUy7H5kXkF3WPqFCTcir0RGGTnAWKE2_LqTQd_cAGsi1FwGEMlYXczE-UdEp1TogV4doT5jWEXOSHKBYc6khwxrZWGjahFzPboZOQctXbkiMDzeBSMfOrDMFqM-I85lx82-9Y3y"
                  alt="GIS Inundation Map"
                />
                <div className="p-space-sm bg-surface-container-lowest">
                  <div className="flex items-center justify-between text-label-sm font-label-sm">
                    <span className="font-mono font-semibold text-primary">Yamuna Sector 12 Mesh</span>
                    <span className="text-on-tertiary-container font-mono">15m Horizon Sim</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Catchment boundary runoff vector output</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Technology Stack & Repositories */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg space-y-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">3. Technology Stack & Software Artifacts</h2>
              </div>
              <span className="font-label-sm text-label-sm font-mono text-outline uppercase tracking-wider">v0.3-Release</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Stack Sub-Card: IoT */}
              <div className="p-space-md rounded-lg bg-surface space-y-space-sm border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px]">memory</span>
                    Embedded & IoT Hardware
                  </span>
                  <span className="font-mono text-label-sm text-outline">Layer 01</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">ESP32-S3 (Xtensa LX7)</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">LoRa SX1262 (865-867 MHz)</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">FreeRTOS v10.5</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">TinyML TFLite-Micro</span>
                </div>
              </div>
              {/* Stack Sub-Card: Backend */}
              <div className="p-space-md rounded-lg bg-surface space-y-space-sm border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px]">dns</span>
                    Backend & Telemetry Pipeline
                  </span>
                  <span className="font-mono text-label-sm text-outline">Layer 02</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">Rust 1.79 (Tokio / Axum)</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">TimescaleDB / PostgreSQL</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">EMQX MQTT Broker</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">Redis In-Memory Streams</span>
                </div>
              </div>
              {/* Stack Sub-Card: ML / Spatial */}
              <div className="p-space-md rounded-lg bg-surface space-y-space-sm border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px]">scatter_plot</span>
                    Spatial Modeling & Neural Surrogates
                  </span>
                  <span className="font-mono text-label-sm text-outline">Layer 03</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">PyTorch Geometric (PyG)</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">Hydro-GNN Catchment</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">GDAL / GeoPandas</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">Copernicus 30m DEM</span>
                </div>
              </div>
              {/* Stack Sub-Card: Frontend */}
              <div className="p-space-md rounded-lg bg-surface space-y-space-sm border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="font-title-sm text-title-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px]">web</span>
                    Cartographic Visualization
                  </span>
                  <span className="font-mono text-label-sm text-outline">Layer 04</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">React 19 & TypeScript</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">Mapbox GL JS / Deck.gl</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">TailwindCSS</span>
                  <span className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface font-mono text-[11px] font-medium">Native WebSockets</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Required Skills & Open Contribution Roles */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg space-y-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">group_add</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">4. Open Consortium Roles</h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Verified positions open for student researchers and engineers across Indian academic institutions
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-secondary-container/40 text-on-secondary-container font-mono font-semibold text-label-sm">
                {project.roles?.length || 2} Vacancies
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {(project.roles && project.roles.length > 0
                ? project.roles
                : [
                    {
                      id: "firmware-eng",
                      title: "Embedded Firmware Engineer",
                      description:
                        "Design and optimize low-power deep sleep cycles (<15μA) on ESP32-S3 units. Implement adaptive data rate (ADR) algorithms for the 865-867 MHz band.",
                      requiredSkills: ["C / C++", "FreeRTOS", "LoRaWAN", "Power Profiling"],
                    },
                    {
                      id: "ml-researcher",
                      title: "Hydrological ML Researcher",
                      description:
                        "Formulate physics-informed loss functions enforcing conservation of mass in graph neural networks. Map topological sewer culverts into PyTorch Geometric.",
                      requiredSkills: ["PyTorch Geometric", "GNNs", "GIS / QGIS", "PINNs"],
                    },
                  ]
              ).map((role, idx) => {
                const hasApplied = applications.some(
                  (a) => (a.roleId === role.id || a.role?.title === role.title) && a.applicantId === currentUser?.id
                );

                return (
                  <div key={role.id || idx} className="p-space-md rounded-lg bg-surface flex flex-col justify-between space-y-space-sm border border-surface-container-high">
                    <div className="space-y-space-xs">
                      <div className="flex items-start justify-between">
                        <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-mono text-[10px] font-bold uppercase">
                          Role #{idx + 1}
                        </span>
                        <span className="text-secondary font-mono text-[11px] font-semibold">Active Recruitment</span>
                      </div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">{role.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        {role.description}
                      </p>
                      {role.requiredSkills && role.requiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {role.requiredSkills.map((sk, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[10px]">
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-space-xs flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-outline">12–15 hrs/wk · Co-Authorship</span>
                      {isProjectLead ? (
                        <button
                          onClick={() => setActiveTab("applications")}
                          className="px-3 py-1.5 rounded bg-surface-container text-primary font-label-lg hover:bg-surface-container-high transition-colors flex items-center gap-1"
                          type="button"
                        >
                          <span>Review Candidates</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      ) : userMembership ? (
                        <span className="px-3 py-1.5 rounded bg-secondary-container text-on-secondary-container font-mono text-xs font-semibold">
                          Active Member
                        </span>
                      ) : hasApplied ? (
                        <span className="px-3 py-1.5 rounded bg-surface-container-high text-primary font-mono text-xs font-semibold">
                          Application Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenApplyModal(role)}
                          className="px-3 py-1.5 rounded bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors flex items-center gap-1"
                          type="button"
                        >
                          <span>Apply for Role</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 5: Project Milestones & Progress Tracker */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg space-y-space-md shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-space-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">5. Research Milestones & Verification Track</h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Audited sprint cycle adhering to DST/SERB academic deliverable checkpoints</p>
              </div>
              <div className="flex items-center gap-2 font-mono text-label-sm">
                <span className="text-on-surface-variant">Overall Progress:</span>
                <span className="font-bold text-primary text-title-sm">55%</span>
              </div>
            </div>
            {/* High-level Progress Bar */}
            <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden flex">
              <div className="bg-secondary h-full" style={{ width: "40%" }}></div>
              <div className="bg-primary h-full" style={{ width: "15%" }}></div>
              <div className="bg-surface-container-high h-full" style={{ width: "45%" }}></div>
            </div>
            {/* Milestone Itemized List */}
            <div className="space-y-space-xs pt-space-xs">
              {/* MS 1: Research */}
              <div className="p-space-sm rounded-lg bg-surface flex items-start justify-between gap-space-sm border border-surface-container-high">
                <div className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-on-surface">1. Research & Catchment Validation</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-surface-container-lowest text-secondary font-semibold">100% COMPLETED</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Literature review, hydraulic baseline verification, and historical flood inundation calibration for NCT Yamuna sector.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-label-sm text-outline shrink-0">Jan 2024</span>
              </div>
              {/* MS 2: Design */}
              <div className="p-space-sm rounded-lg bg-surface flex items-start justify-between gap-space-sm border border-surface-container-high">
                <div className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-on-surface">2. Hardware CAD & Gateway Topology</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-surface-container-lowest text-secondary font-semibold">100% COMPLETED</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Schematic KiCad design, solar MPPT battery management, IP68 3D enclosure modeling, and NKN gateway location clearance.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-label-sm text-outline shrink-0">Mar 2024</span>
              </div>
              {/* MS 3: Development (In Progress) */}
              <div className="p-space-sm rounded-lg bg-surface flex items-start justify-between gap-space-sm border border-surface-container-high">
                <div className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">autorenew</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">3. Multi-Node Deployment & Model Train</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-primary-fixed text-primary font-semibold">65% IN PROGRESS</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Firmware alpha deployed on 14 campus nodes; PyTorch Geometric graph model training on 8-year runoff time-series logs.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-label-sm text-primary font-medium shrink-0">Current</span>
              </div>
              {/* MS 4: Testing */}
              <div className="p-space-sm rounded-lg bg-surface flex items-start justify-between gap-space-sm border border-surface-container-high">
                <div className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-surface-container text-outline flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-on-surface">4. Monsoonal Stormwater Field Test</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-surface-container-lowest text-outline font-semibold">10% UPCOMING</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Field stress-testing under heavy monsoonal precipitation canal conditions across Roorkee and IIT Delhi southern drains.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-label-sm text-outline shrink-0">Jul 2024</span>
              </div>
              {/* MS 5: Demo & Open Publication */}
              <div className="p-space-sm rounded-lg bg-surface flex items-start justify-between gap-space-sm border border-surface-container-high">
                <div className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-surface-container text-outline flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">publish</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-on-surface">5. Open Dataset & IEEE INDICON Publication</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-surface-container-lowest text-outline font-semibold">0% SCHEDULED</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Full dataset publication under open research license and oral presentation at IEEE INDICON 2024.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-label-sm text-outline shrink-0">Nov 2024</span>
              </div>
            </div>
          </section>

          {/* Section 6: Verified Consortium Team Roster */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg space-y-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">6. Consortium Research Team</h2>
              </div>
              <span className="font-label-sm text-label-sm font-mono text-outline uppercase tracking-wider">3 Active · 2 Open</span>
            </div>
            <div className="space-y-space-xs">
              {/* Member 1: Faculty Advisor */}
              <div className="p-space-md rounded-lg bg-surface flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container-high">
                <div className="flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-serif text-title-md shrink-0">
                    KR
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">Dr. K. Ramanathan</h3>
                      <span className="material-symbols-outlined text-[15px] text-secondary" title="Faculty Verified">verified</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container font-mono text-[10px] text-primary">Lead Investigator</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Professor, Dept. of Water Resources Development & Management · <strong class="font-medium text-on-surface">IIT Roorkee</strong>
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] font-mono text-on-surface-variant">
                      <span>Computational Hydrology</span>
                      <span>·</span>
                      <span>GIS & Remote Sensing</span>
                      <span>·</span>
                      <span>Flood Routing Dynamics</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-lg shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <span className="block font-mono text-title-sm text-on-surface font-bold">2,840</span>
                    <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Scholar Score</span>
                  </div>
                  <button onClick={() => navigate("/people/p-ramanathan")} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant" type="button">
                    <span className="material-symbols-outlined text-[18px]">account_box</span>
                  </button>
                </div>
              </div>
              {/* Member 2: Ph.D. Scholar */}
              <div className="p-space-md rounded-lg bg-surface flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container-high">
                <div className="flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center font-mono text-title-md shrink-0">
                    DS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">Devavrat Saxena</h3>
                      <span className="material-symbols-outlined text-[15px] text-secondary" title="Institutional Verified">verified</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container font-mono text-[10px] text-on-surface-variant">Ph.D. Candidate</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Distributed Systems Laboratory, Dept. of CSE · <strong class="font-medium text-on-surface">IIT Delhi</strong>
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] font-mono text-on-surface-variant">
                      <span>Lead Systems & Gateway Architect</span>
                      <span>·</span>
                      <span>Rust / Tokio</span>
                      <span>·</span>
                      <span>TimescaleDB</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-lg shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <span className="block font-mono text-title-sm text-on-surface font-bold">1,910</span>
                    <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Scholar Score</span>
                  </div>
                  <button onClick={() => navigate("/people/p-devavrat")} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant" type="button">
                    <span className="material-symbols-outlined text-[18px]">account_box</span>
                  </button>
                </div>
              </div>
              {/* Member 3: M.Tech Scholar */}
              <div className="p-space-md rounded-lg bg-surface flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container-high">
                <div className="flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center font-mono text-title-md shrink-0">
                    AS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">Ananya Sen</h3>
                      <span className="material-symbols-outlined text-[15px] text-secondary" title="Institutional Verified">verified</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container font-mono text-[10px] text-on-surface-variant">M.Tech AI/ML</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Center for Visual Information & Graph Computing · <strong class="font-medium text-on-surface">IIIT Hyderabad</strong>
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] font-mono text-on-surface-variant">
                      <span>Graph ML Engineer</span>
                      <span>·</span>
                      <span>PyTorch Geometric</span>
                      <span>·</span>
                      <span>Spatial GNNs</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-lg shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <span className="block font-mono text-title-sm text-on-surface font-bold">1,420</span>
                    <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Scholar Score</span>
                  </div>
                  <button onClick={() => navigate("/people/p-ananya")} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant" type="button">
                    <span className="material-symbols-outlined text-[18px]">account_box</span>
                  </button>
                </div>
              </div>
              {/* Open Roster Slots */}
              <div className="p-space-md rounded-lg bg-surface-container-low/60 flex items-center justify-between border border-surface-container-high">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high text-outline flex items-center justify-center font-mono text-title-md shrink-0">
                    <span className="material-symbols-outlined text-[20px]">person_outline</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-primary font-semibold">Open Role: Embedded Firmware Engineer</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-lowest font-mono text-[10px] text-secondary font-medium">Assigned to incoming applicant</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Focus: Low-power LoRa firmware & antenna calibration</p>
                  </div>
                </div>
                <button onClick={() => handleOpenApplyModal(project.roles?.[0])} className="px-3 py-1 bg-surface-container-lowest text-primary rounded font-label-sm text-label-sm hover:bg-surface-container transition-colors" type="button">
                  Review Role
                </button>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low/60 flex items-center justify-between border border-surface-container-high">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high text-outline flex items-center justify-center font-mono text-title-md shrink-0">
                    <span className="material-symbols-outlined text-[20px]">person_outline</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-primary font-semibold">Open Role: Hydrological ML Researcher</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-lowest font-mono text-[10px] text-secondary font-medium">Assigned to incoming applicant</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Focus: Physics-informed loss & catchment spatial graph design</p>
                  </div>
                </div>
                <button onClick={() => handleOpenApplyModal(project.roles?.[1])} className="px-3 py-1 bg-surface-container-lowest text-primary rounded font-label-sm text-label-sm hover:bg-surface-container transition-colors" type="button">
                  Review Role
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Rail: Project Telemetry & Institutional Oversight (3 Columns) */}
        <div className="lg:col-span-3 space-y-space-lg">
          {/* Academic Metadata Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md space-y-space-md shadow-sm">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                Project Summary
              </span>
              <span className="font-mono text-label-sm text-secondary">NKN Node OK</span>
            </div>
            {/* Metric Bars */}
            <div className="space-y-space-sm pt-1">
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-1">
                  <span className="text-on-surface-variant">Team Capacity</span>
                  <span className="font-mono font-semibold text-on-surface">3 of 5 (60%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: "60%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-1">
                  <span className="text-on-surface-variant">Sprint #1 Progress</span>
                  <span className="font-mono font-semibold text-secondary">65% Target</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
            {/* Structured Metadata Table */}
            <div className="pt-space-xs space-y-2.5 font-body-sm text-body-sm">
              <div className="flex items-start justify-between">
                <span className="text-on-surface-variant">Institutional Lead:</span>
                <span className="font-medium text-on-surface text-right">IIT Roorkee</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-on-surface-variant">Partner Hubs:</span>
                <span className="font-medium text-on-surface text-right">IIT-D × IIIT-H</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-on-surface-variant">Initiated:</span>
                <span className="font-mono text-on-surface text-right">5 days ago</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-on-surface-variant">Hardware Grant:</span>
                <span className="font-mono text-primary text-right font-medium">SERB #SRB-2024-89</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-on-surface-variant">License:</span>
                <span className="font-mono text-on-surface text-right">CC BY-NC-SA 4.0</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-on-surface-variant">Telemetry Encryption:</span>
                <span className="font-mono text-on-surface text-right">AES-128 CTR</span>
              </div>
            </div>
          </div>

          {/* Institutional Oversight & Safety Endorsement Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md space-y-space-sm shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">Institutional Clearance</span>
            </div>
            <div className="p-space-sm rounded-lg bg-surface space-y-2 border border-surface-container-high">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong className="font-semibold">Faculty Mentor Endorsement:</strong> Validated by Department of Water Resources Development, IIT Roorkee.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong className="font-semibold">Ethical & Civic Data Protocol:</strong> Field telemetry certified under MoHUA Smart Cities Open Data framework.
                </p>
              </div>
            </div>
            <div className="pt-1 flex items-center justify-between text-outline font-mono text-[10px]">
              <span>Audit Hash: 0x8842...NKN</span>
              <span className="text-secondary font-medium">Validated</span>
            </div>
          </div>

          {/* Artifacts & Resources Drawer */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md space-y-space-sm shadow-sm">
            <span className="font-title-sm text-title-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">folder_open</span>
              Scholarly Artifacts
            </span>
            <div className="space-y-1.5">
              <a className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-high" href="#github" onClick={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-outline text-[18px]">code</span>
                  <div className="truncate">
                    <div className="font-mono text-[12px] font-semibold text-on-surface truncate">GitHub / floodsense-core</div>
                    <div className="font-mono text-[10px] text-outline">commit #e7f2c1 · 4h ago</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[16px]">arrow_outward</span>
              </a>
              <a className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-high" href="#dataset" onClick={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-outline text-[18px]">dataset</span>
                  <div className="truncate">
                    <div className="font-mono text-[12px] font-semibold text-on-surface truncate">Yamuna Inundation Sample</div>
                    <div className="font-mono text-[10px] text-outline">12.4 MB CSV / NetCDF</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[16px]">download</span>
              </a>
              <a className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-high" href="#pdf" onClick={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-outline text-[18px]">description</span>
                  <div className="truncate">
                    <div className="font-mono text-[12px] font-semibold text-on-surface truncate">System Whitepaper Draft v0.3</div>
                    <div className="font-mono text-[10px] text-outline">PDF · 18 pages · 4.1 MB</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[16px]">visibility</span>
              </a>
            </div>
          </div>

          {/* Quick Citation Tool Box */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md space-y-space-sm shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Cite This Project (BibTeX)</span>
              <button onClick={handleCopyCite} className="text-primary hover:text-primary-container font-mono text-[11px] flex items-center gap-0.5" type="button">
                <span className="material-symbols-outlined text-[14px]">{copiedCite ? "check" : "content_copy"}</span>
                <span>{copiedCite ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <div className="p-space-sm rounded bg-surface font-mono text-[10px] text-on-surface-variant leading-relaxed overflow-x-auto whitespace-pre border border-surface-container-high">{`@article{floodsense2024,
  title={Low-Cost LoRa Telemetry &
         Surrogate Catchment GNNs},
  author={Ramanathan, K. and 
          Saxena, D. and Sen, A.},
  journal={CampusLink Consortium},
  year={2024},
  note={Node #PRJ-8842}
}`}</div>
          </div>
        </div>
      </div>

      {/* Apply for Role Modal Dialog */}
      {applyModalRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setApplyModalRole(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[22px]">assignment_ind</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Apply for {applyModalRole.title}
              </h3>
            </div>
            <p className="text-body-sm text-on-surface-variant mb-4">
              Project: <span className="font-semibold text-primary">{project.title}</span>
            </p>

            {applyModalRole.requiredSkills && applyModalRole.requiredSkills.length > 0 && (
              <div className="mb-4 p-3 bg-surface-container-low rounded-lg border border-surface-container">
                <span className="text-label-sm font-semibold uppercase text-outline block mb-1">
                  Required Role Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {applyModalRole.requiredSkills.map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-surface-container font-mono text-xs text-primary font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-label-sm font-semibold text-on-surface mb-1">
                  Academic Pitch & Relevant Background
                </label>
                <textarea
                  rows={4}
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Describe your technical skills, relevant coursework, lab experience, or GitHub repos that make you a great fit..."
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setApplyModalRole(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-label-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-semibold text-label-md flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  {isApplying ? "Submitting..." : "Submit Application"}
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Monaco Code Workspace Modal */}
      <CodeEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        projectTitle={project.title || "Project Workspace"}
      />
    </div>
  );
};

export default ProjectDetailPage;
