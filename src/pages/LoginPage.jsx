import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState("scholar@iitd.ac.in");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Invalid institutional credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] font-['Public_Sans'] text-[#131b2e] antialiased min-h-screen flex items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-xl mx-auto">
        <div className="flex flex-col w-full items-center justify-center py-6">
          <div className="w-full max-w-[420px] mx-auto flex flex-col gap-6">
            {/* CampusLink Architectural Brand Anchor */}
            <header className="flex flex-col items-center text-center gap-2.5">
              <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-[#1e3a8a] text-white flex items-center justify-center rounded-lg shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                    <path d="M6 6h10"></path>
                    <path d="M6 10h10"></path>
                    <path d="M6 14h6"></path>
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#0f172a] leading-none">CampusLink</span>
                  <span className="text-[10px] font-semibold text-[#64748b] tracking-wider uppercase mt-1">Academic Consortium</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#e2e8f0] shadow-xs text-[#475569]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                <span className="text-[11px] font-medium tracking-wide">Federated Inter-University Registry</span>
              </div>
            </header>

            {/* Main Authentication Workstation Card */}
            <div className="w-full bg-white border border-[#e2e8f0] rounded-lg p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex flex-col gap-1 text-left">
                <h1 className="font-serif text-[26px] leading-tight font-semibold text-[#0f172a] tracking-tight">Welcome back</h1>
                <p className="text-[13px] leading-relaxed text-[#64748b]">Sign in to access your institutional workstation</p>
              </div>

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {errorMsg && (
                  <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded text-[13px] text-[#b91c1c] text-left font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMsg}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[13px] font-semibold text-[#1e293b] flex items-center justify-between" htmlFor="institutionEmail">
                    <span>College email</span>
                    <span className="text-[11px] font-mono text-[#64748b] bg-[#f1f5f9] px-1.5 py-0.5 rounded border border-[#e2e8f0]">ac.in / edu</span>
                  </label>
                  <input
                    id="institutionEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@institution.ac.in or .edu"
                    className="w-full h-10 px-3 bg-white text-[#0f172a] placeholder:text-[#94a3b8] text-[13px] rounded border border-[#cbd5e1] focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[#1e293b]" htmlFor="accountPassword">Password</label>
                    <span onClick={() => alert("Password reset link sent to your institutional email.")} className="text-[12px] font-medium text-[#1e3a8a] hover:text-[#00236f] hover:underline transition-colors cursor-pointer">Forgot password?</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="accountPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-10 pl-3 pr-10 bg-white text-[#0f172a] placeholder:text-[#94a3b8] text-[13px] rounded border border-[#cbd5e1] focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 text-[#64748b] hover:text-[#0f172a] flex items-center justify-center p-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[19px] leading-none">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full h-10 mt-1 bg-[#1e3a8a] hover:bg-[#172554] text-white text-[13px] font-semibold rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </form>

              {/* Clean Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full h-[1px] bg-[#e2e8f0]"></div>
                <span className="absolute px-3 bg-white text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">or</span>
              </div>

              {/* Federated Auth & Routing */}
              <div className="flex flex-col gap-3.5">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full h-10 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0f172a] text-[13px] font-medium rounded border border-[#cbd5e1] transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 5c1.54 0 2.93.56 4.02 1.48l3.01-3.01C17.21 1.83 14.81 1 12 1 7.42 1 3.53 3.61 1.66 7.42l3.66 2.84C6.2 7.37 8.87 5 12 5z" fill="#EA4335"></path>
                    <path d="M23.49 12.28c0-.79-.07-1.54-.19-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.69 2.86c2.16-1.99 3.41-4.92 3.41-8.67z" fill="#4285F4"></path>
                    <path d="M5.32 14.74A7.054 7.054 0 0 1 4.93 12c0-.96.17-1.88.47-2.74L1.74 6.42A11.96 11.96 0 0 0 .07 12c0 1.92.45 3.74 1.25 5.36l4-2.62z" fill="#FBBC05"></path>
                    <path d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.69-2.86c-1.07.72-2.45 1.16-4.24 1.16-3.13 0-5.8-2.37-6.68-5.26l-3.7 2.86C3.53 20.39 7.42 23 12 23z" fill="#34A853"></path>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 pt-0.5">
                  <span className="text-[13px] text-[#64748b]">New to CampusLink?</span>
                  <span onClick={() => navigate("/register")} className="text-[13px] text-[#1e3a8a] font-semibold hover:underline cursor-pointer">Create account</span>
                </div>
              </div>

              {/* Academic Identity Verification Callout */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3.5 rounded-lg flex items-start gap-3 text-left">
                <div className="flex-shrink-0 mt-0.5 text-[#1e3a8a]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[12px] font-medium text-[#1e293b] leading-snug">Use your institutional email to verify your student or staff identity.</p>
                  <p className="text-[11px] text-[#64748b] leading-normal">Automated validation across accredited Indian university domains</p>
                </div>
              </div>
            </div>

            {/* Institutional Footer */}
            <footer className="flex flex-col items-center gap-2.5 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-3 text-[12px] text-[#64748b]">
                <span onClick={() => navigate("/help")} className="hover:text-[#0f172a] cursor-pointer">Federation Policy</span>
                <span className="text-[#cbd5e1]">•</span>
                <span onClick={() => navigate("/settings")} className="hover:text-[#0f172a] cursor-pointer">Privacy Protocol</span>
                <span className="text-[#cbd5e1]">•</span>
                <span onClick={() => navigate("/people")} className="hover:text-[#0f172a] cursor-pointer">Accredited Nodes</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#64748b]">
                <span>sys_status:</span>
                <span className="inline-flex items-center gap-1 font-medium text-[#006c4a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                  all systems operational
                </span>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};
