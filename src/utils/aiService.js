/**
 * Rule-Based Skill Gap & Learning Path Recommendation Engine
 * Analyzes target role skill requirements against current user skills,
 * identifies missing skill sets, and generates a structured learning path.
 */

const ROLE_SKILL_MAP = {
  "Frontend Developer": [
    "React", "TypeScript", "HTML", "CSS", "JavaScript", "Tailwind CSS",
    "Next.js", "State Management", "Responsive Design", "Web Performance"
  ],
  "Backend Developer": [
    "Node.js", "Python", "SQL", "REST API", "Express", "PostgreSQL",
    "Authentication", "Security", "Microservices", "Docker"
  ],
  "Full Stack Developer": [
    "React", "Node.js", "TypeScript", "SQL", "REST API", "Git",
    "Docker", "AWS", "Testing", "CI/CD"
  ],
  "AI/ML Engineer": [
    "Python", "Machine Learning", "TensorFlow", "PyTorch", "Deep Learning",
    "NLP", "Computer Vision", "Data Science", "NumPy", "Pandas"
  ],
  "Mobile Developer": [
    "React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX",
    "Firebase", "Push Notifications", "App Store Deployment", "APIs"
  ],
  "DevOps Engineer": [
    "Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Linux",
    "Terraform", "Monitoring", "Security", "Automation"
  ],
  "Distributed Systems Engineer": [
    "C++20", "Go", "Rust", "Distributed Systems", "Kafka", "Raft Consensus",
    "eBPF", "Operating Systems", "Cloud Infrastructure", "Fault Tolerance"
  ]
};

export function analyzeSkillGap(currentSkills = [], targetRole = "Full Stack Developer") {
  const requiredSkills = ROLE_SKILL_MAP[targetRole] || ROLE_SKILL_MAP["Full Stack Developer"];
  const userSkillSet = new Set(currentSkills.map(s => String(s).toLowerCase()));

  const missingSkills = requiredSkills.filter(
    skill => !userSkillSet.has(skill.toLowerCase())
  );

  const matchedCount = requiredSkills.length - missingSkills.length;
  const progressPercentage = Math.round((matchedCount / requiredSkills.length) * 100);

  const recommendedPath = generateLearningPath(missingSkills, targetRole);

  return {
    role: targetRole,
    currentSkills,
    requiredSkills,
    missingSkills,
    progress: progressPercentage,
    recommendedPath
  };
}

function generateLearningPath(missingSkills = [], role = "") {
  const path = [];
  const foundational = ["JavaScript", "Python", "HTML", "CSS", "Git", "SQL"];

  const missingFoundational = missingSkills.filter(s => foundational.includes(s));
  if (missingFoundational.length > 0) {
    path.push(`Phase 1 - Master Core Fundamentals: Focus on ${missingFoundational.slice(0, 2).join(" & ")}.`);
  }

  const missingFrameworks = missingSkills.filter(
    s => !foundational.includes(s) && (s.includes("React") || s.includes("Node") || s.includes("TensorFlow") || s.includes("Docker"))
  );
  if (missingFrameworks.length > 0) {
    path.push(`Phase 2 - Frameworks & Tools: Practice building modules using ${missingFrameworks.slice(0, 2).join(" & ")}.`);
  }

  const remaining = missingSkills.filter(s => !missingFoundational.includes(s) && !missingFrameworks.includes(s));
  if (remaining.length > 0) {
    path.push(`Phase 3 - Specialization & Infrastructure: Learn ${remaining.slice(0, 2).join(" & ")}.`);
  }

  path.push(`Phase 4 - Practical Capstone: Build a real-world ${role} portfolio project on CampusLink.`);

  return path;
}
