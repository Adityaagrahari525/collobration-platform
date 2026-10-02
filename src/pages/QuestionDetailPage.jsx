import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    questions,
    voteQuestion,
    toggleSaveQuestion,
    submitAnswer,
    acceptAnswer,
    users,
    currentUser,
  } = useApp();

  const [answerText, setAnswerText] = useState("");

  const question = questions.find((q) => q.id === id) || questions[0];

  if (!question) {
    return (
      <div className="p-12 text-center bg-surface-container-lowest rounded-xl border border-surface-container-high">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Question Not Found</h2>
        <button
          onClick={() => navigate("/questions")}
          className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg font-title-sm"
        >
          Return to Questions Feed
        </button>
      </div>
    );
  }

  const author = users.find((u) => u.id === question.authorId);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    submitAnswer(question.id, answerText);
    setAnswerText("");
  };

  const relatedQuestions = questions.filter((q) => q.id !== question.id).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
      {/* Left 2 Cols: Question Detail & Answers */}
      <div className="lg:col-span-2 space-y-space-lg">
        {/* Question Card */}
        <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-secondary-container/40 text-on-secondary-container font-mono text-label-sm font-semibold">
                {question.subject}
              </span>
              {question.staffVerified && (
                <span className="px-3 py-1 rounded-md bg-primary-container text-on-primary font-mono text-label-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Staff Verified
                </span>
              )}
            </div>
            <span className="text-outline text-label-sm font-mono">{question.createdAt}</span>
          </div>

          <h1 className="font-headline-md text-headline-md text-on-surface font-serif font-bold leading-tight">
            {question.title}
          </h1>

          {/* Author Strip */}
          <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              {question.isAnonymous ? (
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold">
                  <span className="material-symbols-outlined">visibility_off</span>
                </div>
              ) : (
                <img
                  src={author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
                  alt={author?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                />
              )}
              <div>
                <div className="font-title-sm text-title-sm font-semibold text-on-surface">
                  {question.isAnonymous ? "Anonymous Student" : author?.name || "Academic Scholar"}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  {question.isAnonymous ? "Identity hidden for peer accountability" : `${author?.degree} · ${author?.institution}`}
                </div>
              </div>
            </div>

            {!question.isAnonymous && author && (
              <button
                onClick={() => navigate(`/people/${author.id}`)}
                className="px-3 py-1.5 rounded-lg border border-primary text-primary font-title-sm font-semibold hover:bg-primary-container/10"
              >
                View Scholar
              </button>
            )}
          </div>

          <p className="font-body-lg text-body-lg text-on-surface leading-relaxed whitespace-pre-line">
            {question.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {question.tags.map((t, idx) => (
              <span key={idx} className="px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-lg font-label-sm font-mono">
                #{t}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-surface-container-low">
            <div className="flex items-center gap-3">
              <button
                onClick={() => voteQuestion(question.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-medium transition-all ${
                  question.userVoted
                    ? "bg-primary-container text-on-primary border-primary"
                    : "bg-surface-container-low text-on-surface border-surface-container-high hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                <span>{question.votes} Votes</span>
              </button>

              <button
                onClick={() => toggleSaveQuestion(question.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  question.saved
                    ? "bg-secondary-container/40 text-secondary border-secondary"
                    : "text-outline border-surface-container-high hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {question.saved ? "bookmark" : "bookmark_border"}
                </span>
              </button>
            </div>

            <div className="font-mono text-label-sm text-outline">
              Question ID #{question.id}
            </div>
          </div>
        </div>

        {/* Answer Input Section */}
        <form onSubmit={handleAnswerSubmit} className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm space-y-space-sm">
          <h3 className="font-title-md text-title-md text-primary font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined">edit_note</span>
            <span>Submit Your Technical Answer</span>
          </h3>
          <textarea
            rows={4}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write a clear, peer-validated response with technical rationale or open-source citations..."
            className="w-full p-4 bg-surface-container-low border border-surface-container-high rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex items-center justify-between">
            <span className="text-label-sm text-secondary font-mono">
              Accepted answers earn +10 contribution points
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-title-sm font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <span>Submit Answer (+5 pts)</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </form>

        {/* Answers List */}
        <div className="space-y-space-md">
          <h2 className="font-headline-sm text-headline-sm text-primary font-serif">
            Answers ({question.answers.length})
          </h2>

          {question.answers.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-xl border border-surface-container-high text-on-surface-variant">
              No answers yet. Be the first scholar to respond!
            </div>
          ) : (
            question.answers.map((ans) => (
              <div
                key={ans.id}
                className={`p-space-lg bg-surface-container-lowest rounded-2xl border shadow-sm space-y-space-sm transition-all ${
                  ans.isAccepted ? "border-secondary ring-2 ring-secondary/20" : "border-surface-container-high"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={ans.authorAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"}
                      alt={ans.authorName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-title-sm text-title-sm font-semibold text-on-surface flex items-center gap-1.5">
                        <span>{ans.authorName}</span>
                        {ans.isAccepted && (
                          <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono text-[11px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Accepted Answer
                          </span>
                        )}
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{ans.authorRole}</div>
                    </div>
                  </div>
                  <span className="text-outline text-label-sm font-mono">{ans.createdAt}</span>
                </div>

                <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                  {ans.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-surface-container-low rounded-lg font-mono text-label-sm text-on-surface-variant">
                      {ans.votes} Upvotes
                    </span>
                  </div>

                  {!ans.isAccepted && (currentUser.id === question.authorId || currentUser.role === "faculty") && (
                    <button
                      onClick={() => acceptAnswer(question.id, ans.id)}
                      className="px-4 py-1.5 bg-secondary text-on-secondary rounded-lg font-title-sm font-semibold shadow hover:bg-secondary/90 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      <span>Mark as Accepted Answer</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right 1 Col: Related Questions & Guidelines */}
      <div className="space-y-space-lg">
        <div className="p-space-md bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm space-y-space-sm">
          <h3 className="font-title-md text-title-md text-primary font-semibold font-serif">Related Questions</h3>
          <div className="space-y-3">
            {relatedQuestions.map((rq) => (
              <div
                key={rq.id}
                onClick={() => navigate(`/questions/${rq.id}`)}
                className="p-3 bg-surface-container-low hover:bg-surface-container-high rounded-xl cursor-pointer transition-all space-y-1"
              >
                <div className="font-title-sm text-body-sm font-semibold text-on-surface line-clamp-2">
                  {rq.title}
                </div>
                <div className="flex items-center justify-between text-label-sm text-outline">
                  <span>{rq.subject}</span>
                  <span>{rq.answers.length} ans</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
