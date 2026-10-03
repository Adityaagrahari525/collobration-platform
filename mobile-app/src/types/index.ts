/**
 * Core Data Models & TypeScript Interfaces for CampusLink Mobile
 */

export type UserRole = "student" | "faculty" | "admin";

export interface Endorsement {
  id: string;
  by: string;
  role: string;
  note: string;
}

export interface Contribution {
  id: string;
  type: "ANSWER_ACCEPTED" | "PROJECT_JOINED" | "FACULTY_ENDORSED" | "QUESTION_CREATED" | "MENTORSHIP_COMPLETED";
  description: string;
  points: number;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  department: string;
  degree?: string;
  verified: boolean;
  verificationCode?: string;
  avatar?: string;
  bio?: string;
  contributionScore: number;
  xpPoints?: number;
  currentStreak?: number;
  lastActiveDate?: string;
  badges?: string[];
  skills: string[];
  interests?: string[];
  availability?: "Weekends" | "Part-time" | "Full-time" | string;
  experience?: "Beginner" | "Intermediate" | "Advanced";
  answersCount?: number;
  acceptedAnswersCount?: number;
  projectsCount?: number;
  endorsements?: Endorsement[];
  contributions?: Contribution[];
}

export interface Answer {
  id: string;
  questionId?: string;
  authorId: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  userVoted?: boolean;
}

export interface Question {
  id: string;
  authorId: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  title: string;
  description: string;
  content?: string;
  department: string;
  subject: string;
  year?: string;
  tags: string[];
  votes: number;
  userVoted?: boolean;
  saved?: boolean;
  staffVerified?: boolean;
  isAnonymous?: boolean;
  createdAt: string;
  answers: Answer[];
}

export interface ProjectTeamMember {
  id?: string;
  name: string;
  role: string;
  institution: string;
  avatar?: string;
}

export interface ProjectMilestone {
  title: string;
  status: "Completed" | "In Progress" | "Upcoming";
  date: string;
}

export interface ProjectMetrics {
  nodesDeployed?: number;
  latencyMs?: number;
  accuracyPct?: number;
  dataProcessedMB?: number;
  tokensBillion?: number;
  languagesCount?: number;
  modelSizeGB?: number;
  dronesSupported?: number;
  simHours?: number;
}

export interface Project {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  institution: string;
  department: string;
  status: "Recruiting" | "In Progress" | "Completed" | string;
  lead: string;
  leadId: string;
  team: ProjectTeamMember[];
  skillsRequired: string[];
  openRoles?: string[];
  recruitingRoles?: string[];
  metrics?: ProjectMetrics;
  milestones?: ProjectMilestone[];
  createdAt?: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  applicantId: string;
  applicantName: string;
  roleApplied: string;
  pitch: string;
  status: "Pending" | "Accepted" | "Rejected";
  matchScore: number;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  institution: string;
  topics: string[];
  icon: string;
  joined?: boolean;
}

export interface MentorshipSlot {
  id: string;
  facultyId: string;
  facultyName: string;
  facultyRole: string;
  facultyAvatar: string;
  institution: string;
  department: string;
  topic: string;
  availableDate: string;
  durationMinutes: number;
  maxCapacity: number;
  bookedCount: number;
  meetingLink?: string;
}

export interface MentorshipBooking {
  id: string;
  slotId: string;
  studentId: string;
  studentName: string;
  purpose: string;
  status: "Confirmed" | "Cancelled" | "Completed";
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole?: string;
  participantInstitution?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  type: "answer_accepted" | "project_invite" | "endorsement" | "mentorship_confirmed" | "upvote" | "system";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  targetScreen?: string;
  targetId?: string;
}

export interface SkillGapAnalysis {
  role: string;
  currentSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  progress: number;
  recommendedPath: string[];
}

export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  nextLevelName: string;
  xpToNext: number;
  progressPercent: number;
}
