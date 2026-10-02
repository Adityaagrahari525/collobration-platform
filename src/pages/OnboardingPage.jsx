import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser, completeOnboarding } = useApp();

  const [step, setStep] = useState(3);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Aditya Sharma",
    institution: currentUser?.institution || "Indian Institute of Technology Delhi (IITD)",
    department: currentUser?.department || "Department of Computer Science & Engineering",
    degree: currentUser?.degree || "3rd Year Undergraduate (B.Tech 2022-2026)",
    role: currentUser?.role || "student",
    skills: ["Distributed Systems", "C++20", "Raft Consensus", "eBPF", "Edge AI", "PyTorch"],
    bio: currentUser?.bio || "Systems researcher working on high-throughput distributed consensus, mesh networks, and IoT flood detection.",
  });

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      completeOnboarding(formData);
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high">
        <div className="h-20 max-w-[1280px] mx-auto px-6 flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md min-w-0">
            <div onClick={() => navigate("/")} className="flex items-center gap-space-sm cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none font-serif">CampusLink</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mt-1">Academic Consortium</span>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 px-space-sm py-1 bg-surface-container rounded">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">SAML 2.0 / Eduroam Active Verification Node</span>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <span onClick={() => navigate("/help")} className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer hidden sm:inline-flex items-center">
              Consortium Help
            </span>
            <button onClick={() => navigate("/dashboard")} className="inline-flex items-center justify-center px-space-md py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-colors font-medium">
              Save & Exit
            </button>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 min-h-[calc(100vh-80px)] bg-surface">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto w-full bg-surface-container-lowest rounded-xl shadow-sm p-6 sm:p-8 md:p-10 border border-surface-container-high">
            {/* Top Meta & Title Block */}
            <div className="space-y-space-sm mb-space-lg">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-primary tracking-wider uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Verified Academic Directory Onboarding
                </span>
                <span className="text-on-surface-variant font-label-sm text-label-sm hidden sm:inline-block">• Tier 1 NREN Node</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight font-serif">
                  Complete Your Academic Profile
                </h1>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Step {step} of 6</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Establish your scholarly credentials, research competencies, and cross-campus collaboration objectives within the secure INFLIBNET-federated registry.
              </p>
            </div>

            {/* Stepper Navigation */}
            <div className="mb-8 p-4 bg-surface-container-low rounded-lg border border-surface-container-high">
              <div className="relative flex items-center justify-between">
                {/* Step 1 */}
                <div onClick={() => setStep(1)} className="relative z-10 flex flex-col items-center cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${step >= 1 ? "bg-secondary text-on-secondary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                    {step > 1 ? <span className="material-symbols-outlined text-[18px]">check</span> : "1"}
                  </div>
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant mt-1.5">1. Basic</span>
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${step > 1 ? "bg-secondary" : "bg-surface-container-highest"}`}></div>

                {/* Step 2 */}
                <div onClick={() => setStep(2)} className="relative z-10 flex flex-col items-center cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${step >= 2 ? "bg-secondary text-on-secondary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                    {step > 2 ? <span className="material-symbols-outlined text-[18px]">check</span> : "2"}
                  </div>
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant mt-1.5">2. Institution</span>
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${step > 2 ? "bg-secondary" : "bg-surface-container-highest"}`}></div>

                {/* Step 3 */}
                <div onClick={() => setStep(3)} className="relative z-10 flex flex-col items-center cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${step === 3 ? "bg-surface-container-lowest text-secondary ring-2 ring-secondary" : step > 3 ? "bg-secondary text-on-secondary" : "bg-surface-container-highest"}`}>
                    {step > 3 ? <span className="material-symbols-outlined text-[18px]">check</span> : "3"}
                  </div>
                  <span className="font-label-sm text-label-sm font-bold text-secondary mt-1.5">3. Academic</span>
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${step > 3 ? "bg-secondary" : "bg-surface-container-highest"}`}></div>

                {/* Step 4 */}
                <div onClick={() => setStep(4)} className="relative z-10 flex flex-col items-center cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-secondary text-on-secondary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                    4
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-1.5">4. Skills</span>
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${step > 4 ? "bg-secondary" : "bg-surface-container-highest"}`}></div>

                {/* Step 5 */}
                <div onClick={() => setStep(5)} className="relative z-10 flex flex-col items-center cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 5 ? "bg-secondary text-on-secondary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                    5
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-1.5">5. Interests</span>
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${step > 5 ? "bg-secondary" : "bg-surface-container-highest"}`}></div>

                {/* Step 6 */}
                <div onClick={() => setStep(6)} className="relative z-10 flex flex-col items-center cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 6 ? "bg-secondary text-on-secondary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                    6
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-1.5">6. Collab</span>
                </div>
              </div>
            </div>

            {/* Active Form Section */}
            <div className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 bg-surface-container-low px-3 py-2 rounded-t-lg border border-surface-container-high">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-serif">Academic Identity & Credentials</h2>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Section 01</span>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-lg border border-surface-container-high">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">verified_user</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-sm text-body-sm text-on-surface font-medium leading-snug">
                      Institutional SAML 2.0 handshake verified via IITD Central Authentication Service.
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                      Identity signature: <span className="font-mono text-on-surface">SHA256:4f8e...9bc2</span> • Affiliated node: <span className="text-secondary font-semibold">iitd.ac.in</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-surface-container-lowest text-secondary font-label-sm text-label-sm rounded shadow-xs shrink-0 font-semibold border border-secondary-container">Active Node</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-title-sm text-title-sm text-on-surface font-semibold">Full Legal / Academic Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg border border-surface-container-high focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-title-sm text-title-sm text-on-surface font-semibold">Affiliated Institution</label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg border border-surface-container-high"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-title-sm text-title-sm text-on-surface font-semibold">Department / Faculty School</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg border border-surface-container-high"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-title-sm text-title-sm text-on-surface font-semibold">Academic Cohort / Year of Study</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg border border-surface-container-high"
                    />
                  </div>
                </div>

                {/* Primary Role Selector */}
                <div className="space-y-2 pt-2">
                  <label className="block font-title-sm text-title-sm text-on-surface font-semibold">Primary Role in Consortium Node</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-surface-container rounded-lg border border-surface-container-high">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "student" })}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-label-lg text-label-lg font-bold transition-all ${
                        formData.role === "student" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">school</span>
                      Student Researcher
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "postgrad" })}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-label-lg text-label-lg font-bold transition-all ${
                        formData.role === "postgrad" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">psychology</span>
                      Postgraduate Scholar
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "faculty" })}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-label-lg text-label-lg font-bold transition-all ${
                        formData.role === "faculty" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">science</span>
                      Faculty / PI
                    </button>
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-5 py-2.5 rounded-lg border border-surface-container-high text-on-surface font-title-sm font-semibold disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-title-sm font-semibold shadow hover:bg-primary/90 flex items-center gap-2"
                >
                  <span>{step === 6 ? "Finish & Go to Dashboard" : `Continue to Step ${step + 1} →`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
