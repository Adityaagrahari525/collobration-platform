/**
 * Rule-Based Skill Gap & Learning Path Recommendation Engine
 * Analyzes target role skill requirements against current user skills,
 * identifies missing skill sets, and generates a structured learning path.
 */

import { SkillGapAnalysis } from "../types";

export const ROLE_SKILL_MAP: Record<string, string[]> = {
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
    "React Native", "TypeScript", "Expo", "Mobile UI/UX", "State Management",
    "AsyncStorage", "Push Notifications", "Android SDK", "REST APIs"
  ],
  "Robotics & Embedded Engineer": [
    "ROS2", "C++", "Python", "Embedded Systems", "STM32", "Microcontrollers",
    "SLAM", "Computer Vision", "Sensors", "Gazebo"
  ],
  "Distributed Systems Engineer": [
    "C++20", "Go", "Rust", "Distributed Systems", "Kafka", "Raft Consensus",
    "eBPF", "Operating Systems", "Cloud Infrastructure", "Fault Tolerance"
  ]
};

export function analyzeSkillGap(
  currentSkills: string[] = [],
  targetRole: string = "Full Stack Developer"
): SkillGapAnalysis {
  const requiredSkills = ROLE_SKILL_MAP[targetRole] || ROLE_SKILL_MAP["Full Stack Developer"];
  const userSkillSet = new Set(currentSkills.map(s => String(s).toLowerCase().trim()));

  const missingSkills = requiredSkills.filter(
    skill => !userSkillSet.has(skill.toLowerCase().trim())
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

function generateLearningPath(missingSkills: string[] = [], role: string = ""): string[] {
  const path: string[] = [];
  const foundational = ["JavaScript", "Python", "HTML", "CSS", "Git", "SQL", "C++"];

  const missingFoundational = missingSkills.filter(s => foundational.includes(s));
  if (missingFoundational.length > 0) {
    path.push(`Phase 1 — Core Foundations: Master ${missingFoundational.slice(0, 2).join(" & ")} fundamentals.`);
  } else {
    path.push(`Phase 1 — Core Foundations: Solid base established in foundational languages.`);
  }

  const missingFrameworks = missingSkills.filter(
    s => !foundational.includes(s) && (s.includes("React") || s.includes("Node") || s.includes("PyTorch") || s.includes("Docker") || s.includes("ROS2") || s.includes("Expo"))
  );
  if (missingFrameworks.length > 0) {
    path.push(`Phase 2 — Frameworks & Tooling: Practice building architectural modules with ${missingFrameworks.slice(0, 2).join(" & ")}.`);
  } else {
    path.push(`Phase 2 — Frameworks & Tooling: Core framework competencies verified.`);
  }

  const remaining = missingSkills.filter(s => !missingFoundational.includes(s) && !missingFrameworks.includes(s));
  if (remaining.length > 0) {
    path.push(`Phase 3 — Specialization & Scalability: Deep dive into ${remaining.slice(0, 2).join(" & ")}.`);
  } else {
    path.push(`Phase 3 — Specialization: Ready for advanced research and optimization.`);
  }

  path.push(`Phase 4 — Capstone & Publication: Build a collaborative ${role} research project on CampusLink.`);

  return path;
}
