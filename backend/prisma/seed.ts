import {
  PrismaClient,
  Role,
  Proficiency,
  CollaborationMode,
  ProjectStatus,
  ApplicationStatus,
  MembershipStatus,
  MentorshipSlotStatus,
  BookingStatus,
  NotificationType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CampusLink Phase 1A Canonical Database Seed...");

  // 1. Clean existing records in referential order
  await prisma.auditLog.deleteMany();
  await prisma.aIRequest.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.communityMember.deleteMany();
  await prisma.community.deleteMany();
  await prisma.mentorshipBooking.deleteMany();
  await prisma.mentorshipSlot.deleteMany();
  await prisma.questionBookmark.deleteMany();
  await prisma.answerVote.deleteMany();
  await prisma.questionVote.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.projectApplication.deleteMany();
  await prisma.projectRole.deleteMany();
  await prisma.project.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  console.log("🧹 Cleaned existing tables.");

  // 2. Create Institutions
  const instIITD = await prisma.institution.create({
    data: {
      name: "Indian Institute of Technology Delhi",
      code: "IITD",
      emailDomain: "iitd.ac.in",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      isVerified: true,
    },
  });

  const instIITB = await prisma.institution.create({
    data: {
      name: "Indian Institute of Technology Bombay",
      code: "IITB",
      emailDomain: "iitb.ac.in",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      isVerified: true,
    },
  });

  const instIISc = await prisma.institution.create({
    data: {
      name: "Indian Institute of Science Bangalore",
      code: "IISC",
      emailDomain: "iisc.ac.in",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      isVerified: true,
    },
  });

  const instBITS = await prisma.institution.create({
    data: {
      name: "BITS Pilani",
      code: "BITS",
      emailDomain: "pilani.bits-pilani.ac.in",
      city: "Pilani",
      state: "Rajasthan",
      country: "India",
      isVerified: true,
    },
  });

  const instIITR = await prisma.institution.create({
    data: {
      name: "Indian Institute of Technology Roorkee",
      code: "IITR",
      emailDomain: "iitr.ac.in",
      city: "Roorkee",
      state: "Uttarakhand",
      country: "India",
      isVerified: true,
    },
  });

  const instIIITH = await prisma.institution.create({
    data: {
      name: "IIIT Hyderabad",
      code: "IIITH",
      emailDomain: "iiit.ac.in",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      isVerified: true,
    },
  });

  const instNITT = await prisma.institution.create({
    data: {
      name: "National Institute of Technology Tiruchirappalli",
      code: "NITT",
      emailDomain: "nitt.edu",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      country: "India",
      isVerified: true,
    },
  });

  console.log("✅ Created 7 Indian Academic Institutions");

  // 3. Create Skills
  const skillsData = [
    { name: "Python", category: "Programming" },
    { name: "React", category: "Web Development" },
    { name: "Node.js", category: "Backend" },
    { name: "FastAPI", category: "Backend" },
    { name: "TypeScript", category: "Programming" },
    { name: "PyTorch", category: "Machine Learning" },
    { name: "TensorFlow", category: "Machine Learning" },
    { name: "Computer Vision", category: "Machine Learning" },
    { name: "NLP", category: "Machine Learning" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Docker", category: "DevOps" },
    { name: "Kubernetes", category: "DevOps" },
    { name: "Go", category: "Systems" },
    { name: "Rust", category: "Systems" },
    { name: "Distributed Systems", category: "Systems" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "GraphQL", category: "Web Development" },
    { name: "Prisma ORM", category: "Database" },
  ];

  const skillMap: Record<string, string> = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap[s.name] = created.id;
  }
  console.log(`✅ Seeded ${skillsData.length} core skills`);

  // 4. Create Badges
  const badgesData = [
    { code: "FOUNDING_SCHOLAR", name: "Founding Scholar", description: "Early pioneer of the CampusLink network", icon: "Award" },
    { code: "TOP_COLLABORATOR", name: "Top Collaborator", description: "Successfully contributed to 3+ inter-institutional projects", icon: "Users" },
    { code: "CODE_MENTOR", name: "Verified Mentor", description: "Completed 5+ academic mentorship office hours", icon: "GraduationCap" },
    { code: "SOLVER_PRO", name: "Master Problem Solver", description: "Answer endorsed by verified faculty", icon: "CheckCircle" },
  ];

  const badgeMap: Record<string, string> = {};
  for (const b of badgesData) {
    const created = await prisma.badge.create({ data: b });
    badgeMap[b.code] = created.id;
  }
  console.log(`✅ Seeded ${badgesData.length} achievement badges`);

  // 5. Password Hashes
  const defaultPasswordHash = await bcrypt.hash("Password@123", 10);
  const adminPasswordHash = await bcrypt.hash("AdminPassword@123", 10);

  // 6. Create Demo Users
  // Account 1: Student A (Lead) - Rahul Sharma
  const studentRahul = await prisma.user.create({
    data: {
      email: "rahul.sharma@iitd.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Rahul",
      lastName: "Sharma",
      role: Role.STUDENT,
      institutionId: instIITD.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Pre-final B.Tech CSE | AI & Flood Prediction Researcher",
          department: "Computer Science & Engineering",
          academicYear: "B.Tech '26",
          degree: "Bachelor of Technology",
          bio: "Undergraduate researcher at IIT Delhi focusing on hydrological ML forecasting and sensor telemetry.",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80",
          availability: "15 hrs/week",
          city: "New Delhi",
          state: "Delhi",
          preferredCollaborationMode: CollaborationMode.HYBRID,
          contributionScore: 1250,
          xpPoints: 3400,
          currentStreak: 12,
          isProfileComplete: true,
        },
      },
    },
  });

  // Account 2: Student B (Applicant) - Ananya Iyer
  const studentAnanya = await prisma.user.create({
    data: {
      email: "ananya.iyer@iitb.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Ananya",
      lastName: "Iyer",
      role: Role.STUDENT,
      institutionId: instIITB.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "M.Tech AI Candidate | Computer Vision & Edge Systems",
          department: "Centre of Studies in Resources Engineering",
          academicYear: "M.Tech '25",
          degree: "Master of Technology",
          bio: "Passionate about geospatial remote sensing, PyTorch models, and real-time inference on edge devices.",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
          availability: "Weekends & Evenings",
          city: "Mumbai",
          state: "Maharashtra",
          preferredCollaborationMode: CollaborationMode.REMOTE,
          contributionScore: 980,
          xpPoints: 2850,
          currentStreak: 7,
          isProfileComplete: true,
        },
      },
    },
  });

  // Account 3: Student C - Rohan Verma
  const studentRohan = await prisma.user.create({
    data: {
      email: "rohan.verma@iiit.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Rohan",
      lastName: "Verma",
      role: Role.STUDENT,
      institutionId: instIIITH.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Full Stack Engineer | React, Node.js & Distributed DBs",
          department: "Computer Science",
          academicYear: "Dual Degree '25",
          degree: "B.Tech + MS by Research",
          bio: "Building performant web applications, distributed consensus algorithms, and open source developer tooling.",
          avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80",
          availability: "10 hrs/week",
          city: "Hyderabad",
          state: "Telangana",
          preferredCollaborationMode: CollaborationMode.REMOTE,
          contributionScore: 820,
          xpPoints: 1950,
          currentStreak: 4,
          isProfileComplete: true,
        },
      },
    },
  });

  // Account 4: Faculty Mentor - Dr. Rajesh Sharma
  const facultySharma = await prisma.user.create({
    data: {
      email: "prof.sharma@cse.iitd.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Rajesh",
      lastName: "Sharma",
      role: Role.FACULTY,
      institutionId: instIITD.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Professor & Lab Director, Distributed & Environmental AI Lab",
          department: "Computer Science & Engineering",
          academicYear: "Faculty",
          degree: "Ph.D. UIUC",
          bio: "Advisor to national urban resilience missions. Research in edge sensors, telemetry networks, and distributed systems.",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80",
          availability: "Office Hours: Tue/Thu 3-5 PM",
          city: "New Delhi",
          state: "Delhi",
          preferredCollaborationMode: CollaborationMode.HYBRID,
          contributionScore: 2450,
          xpPoints: 7200,
          currentStreak: 25,
          isProfileComplete: true,
        },
      },
    },
  });

  // Account 5: System Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@campuslink.ac.in",
      passwordHash: adminPasswordHash,
      firstName: "CampusLink",
      lastName: "SuperAdmin",
      role: Role.ADMIN,
      institutionId: instIITD.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Platform Operations & Academic Verification Lead",
          department: "Academic Affairs",
          bio: "Central administrator for inter-institutional partnerships and cross-campus project moderation.",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
          isProfileComplete: true,
        },
      },
    },
  });

  console.log("✅ Seeded Core Demo Users (Student Lead, Applicant, Peer, Faculty Mentor, Admin)");

  // 7. Assign User Skills
  await prisma.userSkill.createMany({
    data: [
      { userId: studentRahul.id, skillId: skillMap["Python"], proficiency: Proficiency.ADVANCED },
      { userId: studentRahul.id, skillId: skillMap["FastAPI"], proficiency: Proficiency.ADVANCED },
      { userId: studentRahul.id, skillId: skillMap["Docker"], proficiency: Proficiency.INTERMEDIATE },
      { userId: studentRahul.id, skillId: skillMap["PostgreSQL"], proficiency: Proficiency.ADVANCED },
      { userId: studentAnanya.id, skillId: skillMap["Python"], proficiency: Proficiency.ADVANCED },
      { userId: studentAnanya.id, skillId: skillMap["PyTorch"], proficiency: Proficiency.ADVANCED },
      { userId: studentAnanya.id, skillId: skillMap["Computer Vision"], proficiency: Proficiency.ADVANCED },
      { userId: studentAnanya.id, skillId: skillMap["Docker"], proficiency: Proficiency.INTERMEDIATE },
      { userId: studentRohan.id, skillId: skillMap["React"], proficiency: Proficiency.ADVANCED },
      { userId: studentRohan.id, skillId: skillMap["TypeScript"], proficiency: Proficiency.ADVANCED },
      { userId: studentRohan.id, skillId: skillMap["Node.js"], proficiency: Proficiency.ADVANCED },
      { userId: studentRohan.id, skillId: skillMap["Tailwind CSS"], proficiency: Proficiency.ADVANCED },
      { userId: facultySharma.id, skillId: skillMap["Distributed Systems"], proficiency: Proficiency.ADVANCED },
      { userId: facultySharma.id, skillId: skillMap["Python"], proficiency: Proficiency.ADVANCED },
    ],
  });

  // Assign Badges
  await prisma.userBadge.createMany({
    data: [
      { userId: studentRahul.id, badgeId: badgeMap["FOUNDING_SCHOLAR"] },
      { userId: studentRahul.id, badgeId: badgeMap["TOP_COLLABORATOR"] },
      { userId: studentAnanya.id, badgeId: badgeMap["FOUNDING_SCHOLAR"] },
      { userId: facultySharma.id, badgeId: badgeMap["CODE_MENTOR"] },
      { userId: facultySharma.id, badgeId: badgeMap["SOLVER_PRO"] },
    ],
  });

  // 8. Create Projects with Roles and Applications
  // Project 1: FloodSense AI (Rahul's flagship project)
  const projectFloodSense = await prisma.project.create({
    data: {
      title: "FloodSense AI: Urban Inundation Forecasting",
      description: "Collaborative inter-campus platform using LoRaWAN stream gauges and multimodal satellite vision models to predict flash flooding in metropolitan drain basins with 45-minute advance lead times.",
      ownerId: studentRahul.id,
      institutionId: instIITD.id,
      collaboratingInstitutions: ["IIT Bombay", "IIIT Hyderabad"],
      status: ProjectStatus.RECRUITING,
      sprintPhase: "Phase 2: Hydrological CNN Validation",
      domain: "Climate & Environmental AI",
      teamSizeLimit: 4,
      roles: {
        create: [
          {
            title: "Computer Vision & Remote Sensing Engineer",
            description: "Train spatio-temporal segmentation models on Sentinel-2 and drone imagery to quantify surface inundation polygons.",
            requiredSkills: ["Python", "PyTorch", "Computer Vision"],
            slots: 1,
          },
          {
            title: "Full Stack Dashboard Developer",
            description: "Build real-time alerting map dashboard with Mapbox, React, and WebSocket live flood-level telemetry.",
            requiredSkills: ["React", "TypeScript", "Tailwind CSS"],
            slots: 1,
          },
          {
            title: "Embedded IoT & Telemetry Specialist",
            description: "Optimize LoRaWAN edge gateway ingestion and sensor battery power consumption across drain nodes.",
            requiredSkills: ["Python", "Docker", "FastAPI"],
            slots: 1,
          },
        ],
      },
    },
    include: {
      roles: true,
    },
  });

  // Project 2: Smart Campus Energy Grid
  const projectEnergy = await prisma.project.create({
    data: {
      title: "CampusGrid: Autonomous Microgrid Optimization",
      description: "Distributed reinforcement learning agents for solar battery load scheduling across residential hostels and academic department buildings.",
      ownerId: studentRohan.id,
      institutionId: instIIITH.id,
      collaboratingInstitutions: ["BITS Pilani"],
      status: ProjectStatus.IN_PROGRESS,
      domain: "Clean Energy & IoT",
      teamSizeLimit: 3,
      roles: {
        create: [
          {
            title: "RL Algorithm Engineer",
            description: "Formulate Markov decision process for multi-battery energy arbitration.",
            requiredSkills: ["Python", "PyTorch"],
            slots: 1,
          },
        ],
      },
    },
  });

  console.log("✅ Seeded Projects & Defined Specialized Roles");

  // 9. Create Project Memberships & Applications
  // Rahul is Lead/Member of FloodSense
  await prisma.projectMember.create({
    data: {
      projectId: projectFloodSense.id,
      userId: studentRahul.id,
      status: MembershipStatus.ACTIVE,
    },
  });

  // Ananya applies to the Computer Vision role on FloodSense (Demonstration ready!)
  const cvRole = projectFloodSense.roles.find((r) => r.title.includes("Vision"));
  if (cvRole) {
    await prisma.projectApplication.create({
      data: {
        projectId: projectFloodSense.id,
        roleId: cvRole.id,
        applicantId: studentAnanya.id,
        pitch: "Hi Rahul! I have 2 years of experience with satellite imagery segmentation using PyTorch and UNet architectures at IIT Bombay. I would love to build the hydrological CNN validation pipeline for FloodSense.",
        matchScore: 94.5,
        status: ApplicationStatus.PENDING,
      },
    });

    // Create a real notification for Rahul
    await prisma.notification.create({
      data: {
        userId: studentRahul.id,
        type: NotificationType.PROJECT_APPLICATION,
        title: "New Project Application",
        message: "Ananya Iyer applied for the Computer Vision & Remote Sensing Engineer role on FloodSense AI.",
        link: `/projects/${projectFloodSense.id}`,
        entityType: "ProjectApplication",
      },
    });
  }

  // 10. Q&A Forum Threads
  const question1 = await prisma.question.create({
    data: {
      title: "How to handle out-of-order sensor packets in low-latency hydrological stream processing?",
      description: "We are receiving LoRaWAN telemetry from 24 drain sensors. When cellular backhaul fluctuates, batches arrive with timestamps skewed by up to 3 minutes. What is the recommended deduplication and windowing strategy without blocking real-time alerts?",
      authorId: studentRahul.id,
      institutionId: instIITD.id,
      department: "Computer Science & Engineering",
      subject: "Distributed Systems & IoT",
      tags: ["Distributed Systems", "Python", "FastAPI"],
      viewsCount: 142,
      answers: {
        create: [
          {
            content: "You should use sliding event-time windows with watermarking rather than processing-time ingestion. If you set a watermark lag of 3 minutes with an append-only in-memory ring buffer (e.g., Redis Streams or sorted set by timestamp), you can publish preliminary alert thresholds immediately and emit finalized aggregates once watermark advances.",
            authorId: facultySharma.id,
            isFacultyEndorsed: true,
            endorsedByFacultyId: facultySharma.id,
            isAccepted: true,
            proofDetails: "Verified in IIT Delhi Distributed Telemetry Testbed 2025",
          },
        ],
      },
    },
    include: {
      answers: true,
    },
  });

  // Votes for Question & Answer
  await prisma.questionVote.create({
    data: {
      questionId: question1.id,
      userId: studentAnanya.id,
    },
  });

  if (question1.answers[0]) {
    await prisma.answerVote.create({
      data: {
        answerId: question1.answers[0].id,
        userId: studentRahul.id,
      },
    });
  }

  // 11. Faculty Mentorship Slots & Bookings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  tomorrow.setHours(15, 0, 0, 0);

  const slotEndTime = new Date(tomorrow);
  slotEndTime.setMinutes(slotEndTime.getMinutes() + 45);

  const slot1 = await prisma.mentorshipSlot.create({
    data: {
      mentorId: facultySharma.id,
      topic: "Research Methodology, Inter-Campus Grants & Paper Publication",
      startAt: tomorrow,
      endAt: slotEndTime,
      durationMinutes: 45,
      capacity: 1,
      status: MentorshipSlotStatus.AVAILABLE,
      meetingLink: "https://meet.google.com/iitd-cse-research",
    },
  });

  console.log("✅ Seeded Q&A Threads, Faculty Endorsements & Mentorship Slots");

  // 12. Communities
  const commAI = await prisma.community.create({
    data: {
      name: "Indian Climate & Environmental AI Consortium",
      description: "Inter-institutional group of students and faculty researching flood prediction, heat stress, and agricultural telemetry.",
      institutionId: instIITD.id,
      category: "Artificial Intelligence",
      members: {
        create: [
          { userId: studentRahul.id, role: "OWNER" },
          { userId: studentAnanya.id, role: "MEMBER" },
          { userId: facultySharma.id, role: "MODERATOR" },
        ],
      },
    },
  });

  const commCyber = await prisma.community.create({
    data: {
      name: "Cybersecurity & Cryptographic Verification Hub",
      description: "Post-quantum lattice primitives, formal software verification, zero-knowledge systems, and hardware-enforced isolation.",
      institutionId: instIISc.id,
      category: "Cybersecurity",
      members: {
        create: [
          { userId: facultySharma.id, role: "MODERATOR" },
          { userId: studentRohan.id, role: "MEMBER" },
        ],
      },
    },
  });

  const commDist = await prisma.community.create({
    data: {
      name: "Distributed Systems & Cloud Architecture Guild",
      description: "Theoretical and systems research on Raft/Paxos consensus, event-driven stream processing, and multi-node container orchestrations.",
      institutionId: instIIITH.id,
      category: "Computer Science",
      members: {
        create: [
          { userId: studentRohan.id, role: "OWNER" },
          { userId: studentRahul.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("✅ Seeded Communities and Memberships");
  console.log("🎉 CampusLink Canonical Seed Complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
