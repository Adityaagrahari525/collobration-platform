import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ShieldCheck, AlertCircle, Eye, EyeOff, ArrowRight, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/apiService";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState("rahul.sharma@iitd.ac.in");
  const [password, setPassword] = useState("Password@123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        switch (err) {
          case "access_denied":
            setErrorMsg("Google Sign-In was cancelled or access was denied.");
            break;
          case "invalid_state":
            setErrorMsg("Authentication session expired or security verification failed. Please try again.");
            break;
          case "unsupported_institution":
            setErrorMsg("Your Google email domain is not registered as a supported academic institution in the consortium. Please use your official university Google account (e.g. @iitd.ac.in, @iitb.ac.in).");
            break;
          case "email_not_verified":
            setErrorMsg("Your Google account email has not been verified. Please verify your email with Google first.");
            break;
          case "account_link_conflict":
            setErrorMsg("Account linking error: This institutional email is already associated with a different Google account. Please contact campus support.");
            break;
          case "google_configuration_missing":
            setErrorMsg("Google authentication service is currently unconfigured. Please sign in with your institutional password.");
            break;
          case "redirect_uri_mismatch":
            setErrorMsg("OAuth redirect URI configuration error. Please contact system administrator.");
            break;
          case "invalid_grant":
            setErrorMsg("Google authorization code has expired or was already redeemed. Please try again.");
            break;
          case "wrong_issuer":
            setErrorMsg("Untrusted identity provider received during Google Sign-In.");
            break;
          case "wrong_audience":
            setErrorMsg("Google client ID mismatch. Authentication rejected.");
            break;
          case "expired_token":
            setErrorMsg("Google ID token has expired. Please sign in again.");
            break;
          case "account_deactivated":
            setErrorMsg("This user account has been deactivated. Please contact campus administrator.");
            break;
          default:
            setErrorMsg("Google authentication failed. Please try again or use your password.");
        }
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("error");
        window.history.replaceState({}, document.title, cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : ""));
      }
    }
  }, []);

  const handleGoogleLogin = () => {
    setErrorMsg("");
    const authUrl = apiService.getGoogleAuthUrl ? apiService.getGoogleAuthUrl() : "/api/auth/google";
    window.location.href = authUrl;
  };

  const setDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg("");
  };

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
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-xl mx-auto">
        <div className="flex flex-col w-full items-center justify-center py-6">
          <div className="w-full max-w-[440px] mx-auto flex flex-col gap-6">
            {/* CampusLink Architectural Brand Anchor */}
            <header className="flex flex-col items-center text-center gap-2.5">
              <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-primary text-on-primary flex items-center justify-center rounded-xl shadow-xs">
                  <GraduationCap className="w-5 h-5 text-on-primary" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-serif text-2xl font-bold tracking-tight text-primary leading-none">CampusLink</span>
                  <span className="text-[10px] font-semibold text-on-surface-variant tracking-wider uppercase mt-1">Academic Consortium</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest border border-surface-container-high shadow-xs text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="text-[11px] font-medium tracking-wide">Federated Inter-University Registry</span>
              </div>
            </header>

            {/* Main Authentication Workstation Card */}
            <div className="w-full bg-surface-container-lowest border border-surface-container-high rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
              <div className="flex flex-col gap-1 text-left">
                <h1 className="font-serif text-[26px] leading-tight font-semibold text-on-surface tracking-tight">Welcome back</h1>
                <p className="text-[13px] leading-relaxed text-on-surface-variant">Sign in with your verified institutional credentials</p>
              </div>

              {/* Demo Account Quick-Fill Buttons */}
              <div className="p-3.5 bg-surface-container-low border border-surface-container-high rounded-xl text-left">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-outline block mb-2">
                  Demo Accounts (Click to autofill):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDemoAccount("rahul.sharma@iitd.ac.in", "Password@123")}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      email === "rahul.sharma@iitd.ac.in"
                        ? "bg-primary-container/20 border-primary text-primary font-semibold shadow-xs"
                        : "bg-surface-container-lowest border-surface-container-high text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="font-medium truncate">Rahul (Lead)</div>
                    <div className="text-[10px] text-outline font-mono">IIT Delhi</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoAccount("ananya.iyer@iitb.ac.in", "Password@123")}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      email === "ananya.iyer@iitb.ac.in"
                        ? "bg-primary-container/20 border-primary text-primary font-semibold shadow-xs"
                        : "bg-surface-container-lowest border-surface-container-high text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="font-medium truncate">Ananya (Candidate)</div>
                    <div className="text-[10px] text-outline font-mono">IIT Bombay</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoAccount("prof.sharma@cse.iitd.ac.in", "Password@123")}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      email === "prof.sharma@cse.iitd.ac.in"
                        ? "bg-primary-container/20 border-primary text-primary font-semibold shadow-xs"
                        : "bg-surface-container-lowest border-surface-container-high text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="font-medium truncate">Prof. Sharma</div>
                    <div className="text-[10px] text-outline font-mono">Faculty Mentor</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoAccount("admin@campuslink.ac.in", "AdminPassword@123")}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      email === "admin@campuslink.ac.in"
                        ? "bg-primary-container/20 border-primary text-primary font-semibold shadow-xs"
                        : "bg-surface-container-lowest border-surface-container-high text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <div className="font-medium truncate">Consortium Admin</div>
                    <div className="text-[10px] text-outline font-mono">System Admin</div>
                  </button>
                </div>
              </div>

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {errorMsg && (
                  <div className="p-3 bg-error-container/30 border border-error-container rounded-xl text-[13px] text-error text-left font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-error" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[13px] font-semibold text-on-surface flex items-center justify-between" htmlFor="institutionEmail">
                    <span>College email</span>
                    <span className="text-[11px] font-mono text-outline bg-surface-container-low px-1.5 py-0.5 rounded border border-surface-container-high">ac.in / edu</span>
                  </label>
                  <input
                    id="institutionEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@institution.ac.in or .edu"
                    className="w-full h-10 px-3 bg-surface-container-lowest text-on-surface placeholder:text-outline text-[13px] rounded-lg border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-on-surface" htmlFor="accountPassword">Password</label>
                    <span onClick={() => alert("Password reset link sent to your institutional email.")} className="text-[12px] font-medium text-primary hover:underline transition-colors cursor-pointer">Forgot password?</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="accountPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-10 pl-3 pr-10 bg-surface-container-lowest text-on-surface placeholder:text-outline text-[13px] rounded-lg border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 text-outline hover:text-on-surface flex items-center justify-center p-1 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 mt-1 bg-primary hover:bg-primary/90 text-on-primary text-[13px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                >
                  <span>{isSubmitting ? "Signing in..." : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Clean Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full h-[1px] bg-surface-container-high"></div>
                <span className="absolute px-3 bg-surface-container-lowest text-[11px] font-semibold text-outline uppercase tracking-wider">or</span>
              </div>

              {/* Federated Auth & Routing */}
              <div className="flex flex-col gap-3.5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-10 px-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface text-[13px] font-medium rounded-lg border border-surface-container-high transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
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
                  <span className="text-[13px] text-on-surface-variant">New to CampusLink?</span>
                  <span onClick={() => navigate("/register")} className="text-[13px] text-primary font-semibold hover:underline cursor-pointer">Create account</span>
                </div>
              </div>

              {/* Academic Identity Verification Callout */}
              <div className="bg-surface-container-low border border-surface-container-high p-3.5 rounded-xl flex items-start gap-3 text-left">
                <div className="flex-shrink-0 mt-0.5 text-primary">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[12px] font-medium text-on-surface leading-snug">Use your institutional email to verify your student or staff identity.</p>
                  <p className="text-[11px] text-on-surface-variant leading-normal">Automated validation across accredited Indian university domains</p>
                </div>
              </div>
            </div>

            {/* Institutional Footer */}
            <footer className="flex flex-col items-center gap-2.5 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-3 text-[12px] text-on-surface-variant">
                <span onClick={() => navigate("/help")} className="hover:text-on-surface cursor-pointer">Federation Policy</span>
                <span className="text-outline/50">•</span>
                <span onClick={() => navigate("/settings")} className="hover:text-on-surface cursor-pointer">Privacy Protocol</span>
                <span className="text-outline/50">•</span>
                <span onClick={() => navigate("/people")} className="hover:text-on-surface cursor-pointer">Accredited Nodes</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant">
                <span>sys_status:</span>
                <span className="inline-flex items-center gap-1 font-medium text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
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

