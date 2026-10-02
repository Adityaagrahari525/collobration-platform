import React from "react";
import { useApp } from "../context/AppContext";

export const SettingsPage = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-space-lg max-w-4xl mx-auto">
      <div className="border-b border-surface-container-high pb-space-xs">
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">Account & Consortium Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage your verified institutional identity, NKN mesh keys, and security preferences.
        </p>
      </div>

      <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm space-y-4">
        <h2 className="font-headline-sm text-headline-sm text-primary font-serif">Institutional Verification Data</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl font-body-md">
            <span className="font-semibold text-on-surface">Verified Name</span>
            <span className="font-mono text-on-surface-variant">{currentUser?.name}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl font-body-md">
            <span className="font-semibold text-on-surface">Federated Institution</span>
            <span className="font-mono text-on-surface-variant">{currentUser?.institution}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl font-body-md">
            <span className="font-semibold text-on-surface">NKN Token Hash</span>
            <span className="font-mono text-secondary font-bold">{currentUser?.verificationCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HelpPage = () => {
  return (
    <div className="space-y-space-lg max-w-4xl mx-auto">
      <div className="border-b border-surface-container-high pb-space-xs">
        <h1 className="font-headline-lg text-headline-lg text-primary font-serif">Help & Academic Safety Guidelines</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Learn how peer verification, anonymous Q&A accountability, and contribution rankings operate.
        </p>
      </div>

      <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm space-y-4">
        <h2 className="font-headline-sm text-headline-sm text-primary font-serif">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <div className="p-4 bg-surface-container-low rounded-xl space-y-1">
            <div className="font-title-sm text-title-sm font-semibold text-on-surface">How does Anonymous posting work?</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              When you post anonymously, your name and photo are hidden from peers as "Anonymous Student". However, the post remains linked internally to your verified account for academic integrity.
            </p>
          </div>
          <div className="p-4 bg-surface-container-low rounded-xl space-y-1">
            <div className="font-title-sm text-title-sm font-semibold text-on-surface">How are contribution points calculated?</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Points are awarded for creating questions (+2), answering questions (+5), having your answer accepted (+10), faculty endorsements (+15), and joining research projects (+20).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
