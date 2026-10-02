import React, { useState } from "react";
import Editor from "@monaco-editor/react";

export const CodeEditorModal = ({ isOpen, onClose, projectTitle = "Project Workspace" }) => {
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(`// CampusLink Embedded Monaco Code Workspace
// Project: ${projectTitle}

function calculateConsensusQuorum(totalNodes, activeNodes) {
  const requiredQuorum = Math.floor(totalNodes / 2) + 1;
  const isQuorumReached = activeNodes >= requiredQuorum;

  return {
    totalNodes,
    activeNodes,
    requiredQuorum,
    isQuorumReached,
    status: isQuorumReached ? "QUORUM_HEALTHY" : "QUORUM_DEGRADED"
  };
}

console.log(calculateConsensusQuorum(5, 3));
`);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-space-md">
      <div className="bg-surface-container-lowest w-full max-w-5xl h-[80vh] rounded-2xl border border-surface-container-high shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-space-md py-3 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px]">code</span>
            <div>
              <h3 className="font-title-md text-title-md font-serif text-on-surface font-semibold">
                Code Workspace: {projectTitle}
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Single-user embedded Monaco editor snippet playground.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1 bg-surface-container-lowest border border-surface-container-high rounded text-label-md font-mono text-on-surface"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
              <option value="html">HTML</option>
            </select>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-1 bg-surface-container-lowest border border-surface-container-high rounded text-label-md font-mono text-on-surface"
            >
              <option value="vs-dark">Dark Theme</option>
              <option value="light">Light Theme</option>
            </select>

            <button
              onClick={onClose}
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor Body */}
        <div className="flex-1 w-full bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={language}
            theme={theme}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>

        {/* Footer */}
        <div className="px-space-md py-2.5 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between font-mono text-label-sm text-on-surface-variant">
          <span>Language: {language.toUpperCase()} | Theme: {theme}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-primary text-on-primary rounded font-label-md font-medium hover:bg-primary/90 transition-colors"
          >
            Save Snippet &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
