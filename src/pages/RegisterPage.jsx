import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/apiService";
import {
  Landmark,
  KeyRound,
  LogIn,
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  GitBranch,
  Check,
  Scale,
  ShieldCheck,
  ArrowRight,
  Shield
} from "lucide-react";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useApp();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [institutionsList, setInstitutionsList] = useState([]);
  const [department, setDepartment] = useState("Department of Computer Science & Engineering");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDomains, setSelectedDomains] = useState([
    "Distributed Systems",
    "Machine Learning",
    "VLSI & Architecture",
  ]);

  const [availableSuggestions, setAvailableSuggestions] = useState([
    "Quantum Computing",
    "Natural Language Processing",
    "Cryptography & Consensus",
    "Bioinformatics & Genomics",
  ]);

  const [checkbox1, setCheckbox1] = useState(true);
  const [checkbox2, setCheckbox2] = useState(true);

  useEffect(() => {
    async function loadInstitutions() {
      try {
        const res = await apiService.getInstitutions();
        if (res.success && res.data?.length > 0) {
          setInstitutionsList(res.data);
          setInstitutionId(res.data[0].id);
        }
      } catch (err) {
        // Fallback if backend offline
      }
    }
    loadInstitutions();
  }, []);

  const toggleDomain = (domain) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
      setAvailableSuggestions([...availableSuggestions, domain]);
    } else {
      setSelectedDomains([...selectedDomains, domain]);
      setAvailableSuggestions(availableSuggestions.filter((s) => s !== domain));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Password and Confirm Password do not match.");
      return;
    }

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "Scholar";
    const lastName = nameParts.slice(1).join(" ") || "User";

    setIsSubmitting(true);
    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        role: role.toUpperCase(),
        institutionId: institutionId || (institutionsList[0]?.id || "inst-1"),
        department,
        skills: selectedDomains,
      });
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Please check your institutional email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] font-['Public_Sans',sans-serif] text-[#131b2e] antialiased min-h-screen flex flex-col">
      {/* Top Fixed / Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0] shadow-xs">
        <div className="max-w-[1360px] mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 bg-[#00236f] text-white flex items-center justify-center rounded-lg shadow-xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-xl font-bold tracking-tight text-[#0f172a] leading-none">
                  CampusLink
                </span>
                <span className="text-[10px] font-semibold text-[#64748b] tracking-wider uppercase mt-1">
                  Academic Consortium
                </span>
              </div>
            </div>
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-[11px] font-medium border border-[#e2e8f0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
              <span>SAML 2.0 / Eduroam / INFLIBNET NREN Node</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#64748b] hidden sm:inline">
              Already have an institutional account?
            </span>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1.5 rounded-md bg-[#00236f] hover:bg-[#1e3a8a] text-white text-[13px] font-semibold transition-colors shadow-xs"
              type="button"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Registration Container Canvas */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleRegister} className="bg-white rounded-xl border border-[#e2e7ff] p-6 sm:p-10 shadow-sm space-y-8">
          {/* Header Title Block */}
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fdf2f8] text-[#be185d] text-[11px] font-semibold uppercase tracking-wider">
                • FEDERATED INSTITUTIONAL ONBOARDING
              </span>
              <span className="text-[11px] text-[#64748b] font-medium">• Tier 1 NREN Authentication</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
                Register for CampusLink Academic Network
              </h1>
              <span className="px-2.5 py-1 rounded bg-[#ecfdf5] text-[#047857] text-[11px] font-bold uppercase tracking-wider border border-[#a7f3d0] shrink-0 self-start sm:self-auto">
                INSTITUTIONAL CLEARANCE
              </span>
            </div>

            <p className="text-[13px] sm:text-[14px] text-[#475569] leading-relaxed max-w-3xl">
              Join verified scholars, faculty, and student researchers across 140+ Indian higher education institutions. Access shared supercomputing clusters, computational notebooks, and inter-collegiate research repositories.
            </p>
          </div>

          {/* Stepper Progress Ribbon */}
          <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
            <div className="grid grid-cols-3 gap-2 text-center relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#006c4a] text-[#006c4a] bg-white font-bold flex items-center justify-center text-sm shadow-xs">
                  1
                </div>
                <span className="text-[12px] font-bold text-[#0f172a] mt-1.5">1. Identity &amp; Node</span>
                <span className="text-[10px] font-semibold text-[#006c4a] tracking-wider">ACTIVE</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center opacity-70">
                <div className="w-8 h-8 rounded-full bg-[#e2e8f0] text-[#64748b] font-medium flex items-center justify-center text-sm">
                  2
                </div>
                <span className="text-[12px] font-semibold text-[#64748b] mt-1.5">2. Department &amp; Role</span>
                <span className="text-[10px] text-[#94a3b8]">Step 2</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center opacity-70">
                <div className="w-8 h-8 rounded-full bg-[#e2e8f0] text-[#64748b] font-medium flex items-center justify-center text-sm">
                  3
                </div>
                <span className="text-[12px] font-semibold text-[#64748b] mt-1.5">3. Research Domains</span>
                <span className="text-[10px] text-[#94a3b8]">Step 3</span>
              </div>
            </div>
          </div>

          {/* Eduroam / Shibboleth SSO Banner */}
          <div className="bg-[#f0f4ff] p-4 rounded-lg border border-[#dbeafe] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-[#00236f] flex items-center justify-center shrink-0 shadow-xs border border-[#cbd5e1] mt-0.5 sm:mt-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#0f172a]">Have an active Eduroam or Shibboleth / SAML ID?</h4>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  Instant verification via national academic federated Single Sign-On.
                </p>
              </div>
            </div>
            <button
              onClick={() => alert("Redirecting to INFLIBNET Eduroam SAML Single Sign-On gateway...")}
              type="button"
              className="px-4 py-2 rounded-md bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#00236f] text-[13px] font-semibold transition-colors flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Authenticate via Campus SSO</span>
            </button>
          </div>

          {/* Section 1: 1. Institutional Identity & Clearance */}
          <div className="space-y-4 text-left">
            {errorMsg && (
              <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-[13px] text-[#b91c1c] font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="bg-[#f8fafc] px-4 py-2.5 rounded-lg border border-[#e2e8f0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-[#00236f]" />
                <h3 className="font-serif text-[17px] font-bold text-[#0f172a]">1. Institutional Identity &amp; Clearance</h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider">STEP 01</span>
            </div>

            {/* Form Fields Grid (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Legal Name */}
              <div className="space-y-1">
                <label className="text-[13px] font-bold text-[#1e293b] block">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Prof. / Dr. / Aarav Sharma"
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-md text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] outline-none transition-all"
                />
                <p className="text-[11px] text-[#64748b]">Enter full name as recorded on institutional roster or passport.</p>
              </div>

              {/* Institutional Email Address */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-[#1e293b]">Institutional Email Address</label>
                  <span className="text-[11px] font-semibold text-[#006c4a] bg-[#ecfdf5] px-1.5 py-0.2 rounded border border-[#a7f3d0] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006c4a]" /> Verified Domain Node
                  </span>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@iitd.ac.in"
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-md text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none transition-all"
                />
                <p className="text-[11px] text-[#64748b]">Must end with .ac.in, .edu.in, or affiliated college subdomain.</p>
              </div>

              {/* Select Institution / Consortium Node */}
              <div className="space-y-1">
                <label className="text-[13px] font-bold text-[#1e293b] block">Select Institution / Consortium Node</label>
                <select
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-md text-[13px] text-[#0f172a] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none transition-all"
                >
                  {institutionsList.length > 0 ? (
                    institutionsList.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.emailDomain})
                      </option>
                    ))
                  ) : (
                    <option value="">Indian Institute of Technology Delhi (IIT Delhi)</option>
                  )}
                </select>
              </div>

              {/* Department / Faculty / School */}
              <div className="space-y-1">
                <label className="text-[13px] font-bold text-[#1e293b] block">Department / Faculty / School</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Department of Computer Science & Engineering"
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-md text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none transition-all"
                />
              </div>
            </div>

            {/* Primary Academic Role in Consortium */}
            <div className="space-y-2 pt-2">
              <label className="text-[13px] font-bold text-[#1e293b] block">Primary Academic Role in Consortium</label>
              <div className="bg-[#f1f5f9] p-2 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2 border border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
                    role === "student" ? "bg-white text-[#00236f] shadow-xs border border-[#cbd5e1]" : "text-[#475569] hover:text-[#0f172a]"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${role === "student" ? "border-[#00236f] bg-[#00236f]" : "border-[#94a3b8]"}`}>
                    {role === "student" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                  <span>Student Researcher</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("phd")}
                  className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
                    role === "phd" ? "bg-white text-[#00236f] shadow-xs border border-[#cbd5e1]" : "text-[#475569] hover:text-[#0f172a]"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${role === "phd" ? "border-[#00236f] bg-[#00236f]" : "border-[#94a3b8]"}`}>
                    {role === "phd" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                  <span>Doctoral / Ph.D.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("faculty")}
                  className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
                    role === "faculty" ? "bg-white text-[#00236f] shadow-xs border border-[#cbd5e1]" : "text-[#475569] hover:text-[#0f172a]"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${role === "faculty" ? "border-[#00236f] bg-[#00236f]" : "border-[#94a3b8]"}`}>
                    {role === "faculty" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                  <span>Faculty / PI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("postdoc")}
                  className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
                    role === "postdoc" ? "bg-white text-[#00236f] shadow-xs border border-[#cbd5e1]" : "text-[#475569] hover:text-[#0f172a]"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${role === "postdoc" ? "border-[#00236f] bg-[#00236f]" : "border-[#94a3b8]"}`}>
                    {role === "postdoc" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                  <span>Postdoc Fellow</span>
                </button>
              </div>
            </div>

            {/* Security Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[13px] font-bold text-[#1e293b] block">Security Credential (Password)</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="............"
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-md text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none transition-all"
                />
                <p className="text-[11px] text-[#64748b]">Minimum 12 characters, uppercase letter, digit &amp; symbol.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-bold text-[#1e293b] block">Confirm Security Credential</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="............"
                  className="w-full h-10 px-3 bg-white border border-[#cbd5e1] rounded-md text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none transition-all"
                />
                <p className="text-[11px] text-[#64748b]">Must match institutional password specification.</p>
              </div>
            </div>
          </div>

          {/* Section 2: 2. Research Domains & Collaboration Focus */}
          <div className="space-y-4 text-left">
            <div className="bg-[#f8fafc] px-4 py-2.5 rounded-lg border border-[#e2e8f0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#00236f]" />
                <h3 className="font-serif text-[17px] font-bold text-[#0f172a]">2. Research Domains &amp; Collaboration Focus</h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider">STEP 02</span>
            </div>

            <p className="text-[12px] text-[#64748b]">
              Specify core focus areas to receive automated repository access and cross-institute grant collaboration notices.
            </p>

            {/* Selected Pills */}
            <div className="bg-[#f8fafc] p-3.5 rounded-lg border border-[#e2e8f0] flex flex-wrap items-center gap-2.5">
              {selectedDomains.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => toggleDomain(domain)}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#cbd5e1] text-[#0f172a] text-[13px] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#f1f5f9] transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                  <span>{domain}</span>
                  <Check className="w-3.5 h-3.5 text-[#006c4a]" />
                </button>
              ))}
            </div>

            {/* Quick Add Suggestions */}
            {availableSuggestions.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider block">
                  QUICK ADD SUGGESTIONS:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {availableSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => toggleDomain(suggestion)}
                      className="px-2.5 py-1 rounded bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] text-[12px] font-medium transition-colors flex items-center gap-1"
                    >
                      <span>+ {suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: 3. Academic Conduct & Open Access Declaration */}
          <div className="space-y-4 text-left">
            <div className="bg-[#f8fafc] px-4 py-2.5 rounded-lg border border-[#e2e8f0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#00236f]" />
                <h3 className="font-serif text-[17px] font-bold text-[#0f172a]">3. Academic Conduct &amp; Open Access Declaration</h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider">STEP 03</span>
            </div>

            <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0] space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkbox1}
                  onChange={(e) => setCheckbox1(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#00236f] rounded border-[#cbd5e1] focus:ring-[#00236f]"
                />
                <span className="text-[12px] text-[#334155] leading-relaxed">
                  <strong className="font-semibold text-[#0f172a]">Institutional Identity Verification Authorization:</strong> I authorize CampusLink to cryptographically verify my academic enrollment/employment with the affiliated NREN node via INFLIBNET or Eduroam SAML metadata.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkbox2}
                  onChange={(e) => setCheckbox2(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#00236f] rounded border-[#cbd5e1] focus:ring-[#00236f]"
                />
                <span className="text-[12px] text-[#334155] leading-relaxed">
                  <strong className="font-semibold text-[#0f172a]">Academic Integrity &amp; Non-Commercial Code:</strong> I agree to uphold the National Knowledge Network (NKN) scholarly code of ethics. All computational artifacts shared across nodes remain strictly non-commercial and open-access.
                </span>
              </label>
            </div>
          </div>

          {/* Action Button & Clearance Footer */}
          <div className="pt-4 border-t border-[#e2e8f0] space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#006c4a]">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit federated clearance active</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#00236f] hover:bg-[#1e3a8a] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Verify Institutional Identity &amp; Register</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#f1f5f9] p-3 rounded-lg border border-[#e2e8f0] flex items-center justify-center gap-2 text-center">
              <Shield className="w-4 h-4 text-[#64748b]" />
              <span className="text-[12px] text-[#64748b]">
                CampusLink operates under INFLIBNET / NKN governance. Strict zero-commercialization guarantee. No commercial crawling or advertising profiling
              </span>
            </div>
          </div>
        </form>
      </main>

      {/* Page Footer */}
      <footer className="w-full bg-white border-t border-[#e2e8f0] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#64748b]">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="flex items-center gap-1 font-medium text-[#006c4a]">
              <CheckCircle2 className="w-3.5 h-3.5" /> FedRAMP High In-Process
            </span>
            <span>-</span>
            <span>NIRF Accredited Cluster</span>
            <span>-</span>
            <span>INFLIBNET Inter-University Centre</span>
          </div>

          <div>
            © 2025 CampusLink National Research &amp; Education Network. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
