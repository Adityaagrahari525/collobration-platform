import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { findSimilarQuestions } from "../utils/duplicateDetector";
import { ProofFileUpload } from "../components/ProofFileUpload";

export const AskQuestionPage = () => {
  const navigate = useNavigate();
  const { createQuestion, currentUser, questions } = useApp();

  const [title, setTitle] = useState(
    "How does Raft handle leader partition during uncommitted log replication under high network jitter?"
  );
  const [description, setDescription] = useState(
    `In our lab implementation of Raft consensus in Rust, when the leader network is partitioned after appending log entries to a minority of nodes but before receiving the quorum ack, we observe split-brain livelocks upon reconnection.

Specific environment:
- 5-node cluster running over simulated wide-area latency (45ms ± 12ms jitter)
- Election timeout randomized between 150ms-300ms

Has anyone formalized or implemented pre-vote protocol extensions or lease read mechanisms in an academic testbed to prevent this?`
  );
  const [subject, setSubject] = useState("Distributed Systems & Cloud");
  const [department, setDepartment] = useState(currentUser?.department || "Computer Science & Engineering");
  const [year, setYear] = useState("3rd Year Undergrad (B.Tech)");
  const [tags, setTags] = useState(["distributed-systems", "raft-consensus", "rust", "fault-tolerance"]);
  const [tagInput, setTagInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [requestStaffResponse, setRequestStaffResponse] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [attachments, setAttachments] = useState([
    { name: "raft_partition_trace_v2.pcap", size: "4.2 MB", status: "Verified Clean (SHA-256 Validated)" },
  ]);
  const [draftSavedTime, setDraftSavedTime] = useState("45s ago");

  const handleAddTag = (tagToAdd) => {
    const trimmed = tagToAdd.trim().replace(/^#/, "");
    if (trimmed && tags.length < 5 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleKeyDownTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title || !description) return;

    const newQuestionId = await createQuestion({
      title,
      description,
      subject,
      department,
      year,
      tags,
      isAnonymous,
      requestStaffResponse,
      attachments,
    });

    navigate(`/questions/${newQuestionId || ''}`);
  };

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-space-md sm:px-space-lg py-space-lg">
        {/* Breadcrumb Hierarchy */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant mb-space-sm">
          <span onClick={() => navigate("/")} className="font-label-md text-label-md hover:text-primary cursor-pointer transition-colors">
            Academic Network
          </span>
          <span className="material-symbols-outlined text-outline-variant text-[14px]">chevron_right</span>
          <span onClick={() => navigate("/questions")} className="font-label-md text-label-md hover:text-primary cursor-pointer transition-colors">
            Knowledge Exchange
          </span>
          <span className="material-symbols-outlined text-outline-variant text-[14px]">chevron_right</span>
          <span onClick={() => navigate("/questions")} className="font-label-md text-label-md hover:text-primary cursor-pointer transition-colors">
            Questions
          </span>
          <span className="material-symbols-outlined text-outline-variant text-[14px]">chevron_right</span>
          <span className="font-label-md text-label-md text-primary font-semibold">Ask a Question</span>
        </nav>

        {/* Header Section with Safe Space Callout */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-lg">
          <div className="space-y-1 max-w-2xl">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-serif">Ask a Question</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Ask the community. Choose to remain anonymous.
            </p>
          </div>
          <div className="bg-surface-container-low px-space-md py-space-sm rounded-lg flex items-start gap-space-sm max-w-md shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <div className="space-y-0.5">
              <span className="font-label-md text-label-md text-on-surface font-semibold tracking-wide block">Scholarly Safe Space</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                Questions are reviewed by verified peer moderators and faculty. Identity controls are strictly preserved.
              </p>
            </div>
          </div>
        </header>

        {/* Main Two-Column Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Main Question Composer Form (8 cols) */}
          <section className="lg:col-span-8 space-y-space-lg">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md sm:p-space-lg space-y-space-lg">
              {/* 1. Question Title */}
              <div className="space-y-space-xs">
                <div className="flex items-baseline justify-between">
                  <label className="font-title-sm text-title-sm text-on-surface font-semibold" htmlFor="question-title">
                    Question Title <span className="text-error">*</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant" id="title-counter">
                    {title.length} / 150
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Be specific and imagine you are posing a query to a colleague or professor.
                </p>
                <div className="relative mt-1">
                  <input
                    className="w-full px-space-md py-2.5 rounded bg-surface-container-low text-on-surface font-title-sm text-title-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner transition-all placeholder:text-outline"
                    id="question-title"
                    maxLength={150}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How does Raft handle leader partition during uncommitted log replication under high network jitter?"
                    type="text"
                  />
                </div>

                {/* Duplicate Question Alert (Jaccard Token Similarity) */}
                {(() => {
                  const similarMatches = findSimilarQuestions(title, questions || [], 0.3);
                  if (similarMatches.length === 0) return null;
                  const topMatch = similarMatches[0];
                  return (
                    <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2 text-amber-800 dark:text-amber-300">
                      <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0 text-amber-600">warning</span>
                      <div className="text-body-sm space-y-1">
                        <span className="font-semibold block">Similar Question Already Posted ({Math.round(topMatch.similarity * 100)}% Token Similarity)</span>
                        <p className="line-clamp-1 italic text-on-surface-variant font-mono text-label-sm">
                          "{topMatch.question.title}"
                        </p>
                        <span
                          onClick={() => navigate(`/questions/${topMatch.question.id}`)}
                          className="text-primary hover:underline cursor-pointer font-medium block text-label-sm"
                        >
                          View existing question and answers →
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 2. Academic Classification Row */}
              <div className="space-y-space-xs pt-space-xs">
                <label className="font-title-sm text-title-sm text-on-surface font-semibold">Academic Classification</label>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Categorize your inquiry to ensure it indexes with accredited subject matter experts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-1">
                  {/* Department */}
                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Department</span>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-surface-container-low hover:bg-surface-container px-3 py-2 pr-8 rounded text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                        <option value="Mathematics & Scientific Computing">Mathematics & Scientific Computing</option>
                        <option value="Mechanical & Aerospace Systems">Mechanical & Aerospace Systems</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                  {/* Subject Domain */}
                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Course Domain</span>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-surface-container-low hover:bg-surface-container px-3 py-2 pr-8 rounded text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      >
                        <option value="Distributed Systems & Cloud">Distributed Systems & Cloud</option>
                        <option value="Database Internals & Storage">Database Internals & Storage</option>
                        <option value="Formal Verification & Logic">Formal Verification & Logic</option>
                        <option value="Network Protocol Engineering">Network Protocol Engineering</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                  {/* Academic Cohort */}
                  <div className="space-y-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Academic Cohort</span>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-surface-container-low hover:bg-surface-container px-3 py-2 pr-8 rounded text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="3rd Year Undergrad (B.Tech)">3rd Year Undergrad (B.Tech)</option>
                        <option value="4th Year Undergrad / Capstone">4th Year Undergrad / Capstone</option>
                        <option value="Master of Science / M.Tech">Master of Science / M.Tech</option>
                        <option value="Doctoral Candidate (Ph.D.)">Doctoral Candidate (Ph.D.)</option>
                        <option value="Postdoctoral / Faculty">Postdoctoral / Faculty</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Detailed Description / Body */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-title-sm text-title-sm text-on-surface font-semibold" htmlFor="question-body">
                    Detailed Description <span className="text-error">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded">
                    <button
                      className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all ${
                        activeTab === "edit"
                          ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      type="button"
                      onClick={() => setActiveTab("edit")}
                    >
                      Edit
                    </button>
                    <button
                      className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all ${
                        activeTab === "preview"
                          ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      type="button"
                      onClick={() => setActiveTab("preview")}
                    >
                      Preview
                    </button>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Include all context, equations, reproducible steps, or academic citations. Markdown and LaTeX syntax supported.
                </p>

                {/* Formatting Toolbar */}
                <div className="rounded-t-lg bg-surface-container-low p-1.5 flex flex-wrap items-center gap-1">
                  <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Bold (Ctrl+B)" type="button">
                    <span className="material-symbols-outlined text-[18px]">format_bold</span>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Italic (Ctrl+I)" type="button">
                    <span className="material-symbols-outlined text-[18px]">format_italic</span>
                  </button>
                  <span className="w-px h-4 bg-outline-variant mx-1"></span>
                  <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center font-label-sm" title="Code Block" type="button">
                    <span className="material-symbols-outlined text-[18px]">code</span>
                  </button>
                  <button className="px-2 py-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md tracking-wider" title="LaTeX Formula" type="button">
                    $$ \LaTeX $$
                  </button>
                  <span className="w-px h-4 bg-outline-variant mx-1"></span>
                  <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Bulleted List" type="button">
                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Numbered List" type="button">
                    <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Insert Quote" type="button">
                    <span className="material-symbols-outlined text-[18px]">format_quote</span>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Hyperlink" type="button">
                    <span className="material-symbols-outlined text-[18px]">link</span>
                  </button>
                  <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="Table Layout" type="button">
                    <span className="material-symbols-outlined text-[18px]">table_chart</span>
                  </button>
                  <div className="ml-auto flex items-center gap-1.5 text-on-surface-variant px-2">
                    <span className="material-symbols-outlined text-[16px]">help_outline</span>
                    <span className="font-label-sm text-label-sm">KaTeX Syntax Ready</span>
                  </div>
                </div>

                {/* Textarea or Preview Content */}
                {activeTab === "edit" ? (
                  <textarea
                    className="w-full p-space-md rounded-b-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner leading-relaxed resize-y"
                    id="question-body"
                    rows={9}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                ) : (
                  <div className="w-full p-space-md rounded-b-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-inner leading-relaxed whitespace-pre-wrap min-h-[220px]">
                    {description}
                  </div>
                )}
              </div>

              {/* 4. Tags Section */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-title-sm text-title-sm text-on-surface font-semibold">Scholarly Tags</label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{tags.length} / 5 tags added</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Add up to 5 tags to describe what your question is about.</p>
                <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-surface-container-low min-h-[46px]">
                  {tags.map((t, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-lowest text-primary shadow-sm font-label-md text-label-md">
                      <span>{t}</span>
                      <button className="hover:text-error transition-colors leading-none" type="button" onClick={() => handleRemoveTag(t)}>
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                  {tags.length < 5 && (
                    <div className="flex-1 min-w-[120px]">
                      <input
                        className="w-full bg-transparent px-2 py-1 text-on-surface font-body-sm text-body-sm focus:outline-none placeholder:text-outline"
                        placeholder="+ Add Tag"
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDownTag}
                      />
                    </div>
                  )}
                </div>
                {/* Tag suggestions */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Recommended:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors"
                      type="button"
                      onClick={() => handleAddTag("concurrency")}
                    >
                      + concurrency
                    </button>
                    <button
                      className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors"
                      type="button"
                      onClick={() => handleAddTag("algorithms")}
                    >
                      + algorithms
                    </button>
                    <button
                      className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors"
                      type="button"
                      onClick={() => handleAddTag("formal-verification")}
                    >
                      + formal-verification
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Attachments / Artifacts / Proof */}
              <ProofFileUpload
                files={attachments}
                onFilesChange={setAttachments}
                maxFiles={5}
                label="Attachments, Proof Screenshots & Code Repositories"
                helperText="Upload Wireshark captures, proof images, mathematical appendixes, or log traces for peer reproduction."
              />

              {/* 6. Identity & Institutional Privacy Controls */}
              <div className="p-space-md sm:p-space-lg rounded-xl bg-surface-container-low/70 space-y-space-md shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">shield_person</span>
                  <h2 className="font-title-md text-title-md text-primary font-semibold">Identity &amp; Institutional Privacy Controls</h2>
                </div>
                {/* Checkbox 1: Anonymous */}
                <label className="flex items-start gap-space-sm cursor-pointer group">
                  <div className="pt-0.5">
                    <input
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      type="checkbox"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm text-title-sm text-on-surface group-hover:text-primary transition-colors font-medium">
                        Post anonymously
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                        Node Privacy Active
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Your legal name and student ID will be masked as <span className="font-semibold text-on-surface">"Anonymous Scholar ({currentUser?.college || 'IIT Delhi'} Node)"</span>. Cryptographic institution verification remains intact to uphold academic integrity.
                    </p>
                  </div>
                </label>
                {/* Checkbox 2: Staff Response */}
                <label className="flex items-start gap-space-sm cursor-pointer group">
                  <div className="pt-0.5">
                    <input
                      checked={requestStaffResponse}
                      onChange={(e) => setRequestStaffResponse(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      type="checkbox"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-title-sm text-title-sm text-on-surface group-hover:text-primary transition-colors font-medium">
                      Request staff response
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Routes this question with priority queue to verified faculty members, teaching assistants, and accredited research fellows in the Distributed Systems domain.
                    </p>
                  </div>
                </label>
              </div>

              {/* 7. Actions Bar */}
              <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm w-full sm:w-auto">
                  {/* Primary Button */}
                  <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 bg-primary-container text-on-primary hover:bg-primary px-space-lg py-2.5 rounded font-label-lg text-label-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full sm:w-auto"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Publish Question</span>
                  </button>
                  {/* Secondary Button */}
                  <button
                    onClick={() => setDraftSavedTime("just now")}
                    className="flex items-center justify-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface px-space-md py-2.5 rounded font-label-lg text-label-lg shadow-sm transition-all w-full sm:w-auto"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">save</span>
                    <span>Save Draft</span>
                  </button>
                </div>
                {/* Auto-save timestamp & Discard */}
                <div className="flex items-center justify-between sm:justify-end gap-space-md w-full sm:w-auto">
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Draft saved {draftSavedTime}
                  </span>
                  <button
                    onClick={() => navigate("/questions")}
                    className="font-label-lg text-label-lg text-outline hover:text-error transition-colors"
                    type="button"
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right Sidebar Column: Helper & Live Similar Questions Rail (4 cols) */}
          <aside className="lg:col-span-4 space-y-space-lg">
            {/* 1. "Similar questions" Compact Live Panel */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md space-y-space-md">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-1.5 font-serif">
                    <span className="material-symbols-outlined text-primary text-[18px]">find_in_page</span>
                    Similar questions
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-label-sm text-label-sm font-semibold">
                    3 matches
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Review these existing consortium answers before publishing to get faster solutions and avoid duplicate inquiries.
                </p>
              </div>

              {/* Similar Cards Stack */}
              <div className="space-y-space-sm">
                {/* Card 1 */}
                <article
                  onClick={() => navigate("/questions/q1")}
                  className="p-space-sm rounded-lg bg-surface-container-low/70 hover:bg-surface-container-high/60 transition-colors space-y-1.5 group cursor-pointer"
                >
                  <a className="font-title-sm text-title-sm text-on-surface group-hover:text-primary transition-colors font-medium leading-snug line-clamp-2 block" href="#" onClick={(e) => e.preventDefault()}>
                    How to handle cascading split-brain in Raft consensus with asymmetric network partitions?
                  </a>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="font-semibold text-primary">24 votes</span>
                    <span>•</span>
                    <span className="text-secondary font-medium flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">school</span> 6 answers (1 faculty)
                    </span>
                    <span>•</span>
                    <span>IIT Bombay</span>
                  </div>
                  <div className="pt-0.5">
                    <span className="font-label-sm text-label-sm text-primary font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View solution <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </span>
                  </div>
                </article>

                {/* Card 2 */}
                <article
                  onClick={() => navigate("/questions/q2")}
                  className="p-space-sm rounded-lg bg-surface-container-low/70 hover:bg-surface-container-high/60 transition-colors space-y-1.5 group cursor-pointer"
                >
                  <a className="font-title-sm text-title-sm text-on-surface group-hover:text-primary transition-colors font-medium leading-snug line-clamp-2 block" href="#" onClick={(e) => e.preventDefault()}>
                    Pre-vote protocol edge cases when nodes rejoin after Byzantine network split
                  </a>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="font-semibold text-primary">18 votes</span>
                    <span>•</span>
                    <span>3 answers</span>
                    <span>•</span>
                    <span>IISc Bangalore</span>
                  </div>
                  <div className="pt-0.5">
                    <span className="font-label-sm text-label-sm text-primary font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View solution <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </span>
                  </div>
                </article>

                {/* Card 3 */}
                <article
                  onClick={() => navigate("/questions/q3")}
                  className="p-space-sm rounded-lg bg-surface-container-low/70 hover:bg-surface-container-high/60 transition-colors space-y-1.5 group cursor-pointer"
                >
                  <a className="font-title-sm text-title-sm text-on-surface group-hover:text-primary transition-colors font-medium leading-snug line-clamp-2 block" href="#" onClick={(e) => e.preventDefault()}>
                    Formal TLA+ specifications for lease read safety in Paxos and Raft
                  </a>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="font-semibold text-primary">31 votes</span>
                    <span>•</span>
                    <span>8 answers</span>
                    <span>•</span>
                    <span>BITS Pilani</span>
                  </div>
                  <div className="pt-0.5">
                    <span className="font-label-sm text-label-sm text-primary font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View solution <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </span>
                  </div>
                </article>
              </div>
            </div>

            {/* 2. "Writing an Effective Academic Inquiry" Reassurance Guide */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md space-y-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">lightbulb</span>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold font-serif">Writing an Effective Inquiry</h2>
              </div>
              <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant pt-1">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <span>Search existing literature and consortium archive first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <span>State your hypothesis and what you have already attempted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <span>Provide minimal reproducible environment details (OS, toolchain, seed logs).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                  <span>Anonymous inquiries undergo identical peer review without identity disclosure.</span>
                </li>
              </ul>
            </div>

            {/* 3. Institutional Support & Code of Conduct Note */}
            <div className="bg-surface-container-low p-space-md rounded-xl space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">policy</span>
                <span className="font-label-md text-label-md font-semibold tracking-wide">CampusLink Academic Integrity</span>
              </div>
              <p className="font-body-sm text-[11px] leading-relaxed text-on-surface-variant">
                Under CC BY-NC 4.0 academic integrity framework. Plagiarism and automated LLM regurgitation strictly prohibited across all university nodes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
