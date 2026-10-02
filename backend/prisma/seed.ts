import { PrismaClient, Role, Proficiency, CollaborationMode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CampusLink Phase 2 database seed...");

  // 1. Clean existing records
  await prisma.emailVerificationToken.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  // 2. Create Institutions
  const instIITD = await prisma.institution.create({
    data: {
      name: "Indian Institute of Technology Delhi (IIT Delhi)",
      emailDomain: "iitd.ac.in",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      isVerified: true,
    },
  });

  const instIITB = await prisma.institution.create({
    data: {
      name: "Indian Institute of Technology Bombay (IIT Bombay)",
      emailDomain: "iitb.ac.in",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      isVerified: true,
    },
  });

  const instIISc = await prisma.institution.create({
    data: {
      name: "Indian Institute of Science Bangalore (IISc)",
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
      emailDomain: "pilani.bits-pilani.ac.in",
      city: "Pilani",
      state: "Rajasthan",
      country: "India",
      isVerified: true,
    },
  });

  const instIITR = await prisma.institution.create({
    data: {
      name: "Indian Institute of Technology Roorkee (IIT Roorkee)",
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
      emailDomain: "iiit.ac.in",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      isVerified: true,
    },
  });

  const instNITT = await prisma.institution.create({
    data: {
      name: "National Institute of Technology Tiruchirappalli (NIT Trichy)",
      emailDomain: "nitt.edu",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      country: "India",
      isVerified: true,
    },
  });

  console.log("✅ Created 7 Indian Academic Institutions");

  // 3. Create Skills with Categories
  const skillsData = [
    { name: "Distributed Systems", category: "Systems & Architecture" },
    { name: "Machine Learning", category: "AI & Data Science" },
    { name: "VLSI & Architecture", category: "Hardware & Electronics" },
    { name: "Quantum Computing", category: "Physics & Computing" },
    { name: "Natural Language Processing", category: "AI & Data Science" },
    { name: "Cryptography & Consensus", category: "Security & Protocols" },
    { name: "Bioinformatics & Genomics", category: "Bio-Engineering" },
    { name: "Rust", category: "Software Engineering" },
    { name: "C++20", category: "Software Engineering" },
    { name: "PyTorch Geometric", category: "AI & Data Science" },
    { name: "LoRaWAN & IoT", category: "Robotics & Embedded" },
    { name: "React / Web Architecture", category: "Software Engineering" },
    { name: "Solidity & Consensus", category: "Security & Protocols" },
    { name: "LaTeX & Proof Writing", category: "Research & Mathematics" },
    { name: "ROS2 & Robotics", category: "Robotics & Embedded" },
  ];

  const skillMap: Record<string, string> = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap[s.name] = created.id;
  }
  console.log(`✅ Created ${skillsData.length} Categorized Research Skills`);

  // Default password hash: "Password123!"
  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  // 4. Seed Users
  // User 1: Student (Aditya Sharma - Primary test student)
  const u1 = await prisma.user.create({
    data: {
      email: "aditya@iitd.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Aditya",
      lastName: "Sharma",
      role: Role.STUDENT,
      institutionId: instIITD.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Distributed Systems & Edge Mesh Researcher",
          department: "Computer Science & Engineering",
          academicYear: "B.Tech CSE '25",
          bio: "Systems researcher working on high-throughput distributed consensus, Raft overlays, mesh networks, and sub-GHz IoT flood detection.",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
          availability: "15 hrs/wk for Consortium Sprints",
          city: "New Delhi",
          state: "Delhi",
          preferredCollaborationMode: CollaborationMode.HYBRID,
          isProfileComplete: true,
        },
      },
    },
  });

  // User 2: Faculty (Dr. Rajesh K. Varma)
  const u2 = await prisma.user.create({
    data: {
      email: "prof.varma@iitd.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Dr. Rajesh K.",
      lastName: "Varma",
      role: Role.FACULTY,
      institutionId: instIITD.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Professor & Lab Director • Distributed Systems Group",
          department: "Computer Science & Engineering",
          academicYear: "Professor & Lab Director",
          bio: "Head of Distributed Systems & Cloud Infrastructure Research Group at IIT Delhi. Researching Byzantine fault tolerance and federated consensus.",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
          availability: "Office Hours: Tue/Thu 14:00 - 16:00 IST",
          city: "New Delhi",
          state: "Delhi",
          preferredCollaborationMode: CollaborationMode.ON_CAMPUS,
          isProfileComplete: true,
        },
      },
    },
  });

  // User 3: Admin (Consortium Node Admin)
  const uAdmin = await prisma.user.create({
    data: {
      email: "admin@campuslink.edu",
      passwordHash: defaultPasswordHash,
      firstName: "Consortium",
      lastName: "Admin",
      role: Role.ADMIN,
      institutionId: instIITD.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "National Academic Consortium Node Administrator",
          department: "Consortium NKN Infrastructure Node",
          academicYear: "Tier-1 Admin",
          bio: "Administrator for National Consortium Infrastructure Node #04",
          city: "New Delhi",
          state: "Delhi",
          isProfileComplete: true,
        },
      },
    },
  });

  // User 4: Priya Nair (IISc Bangalore)
  const u4 = await prisma.user.create({
    data: {
      email: "priya.nair@iisc.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Priya",
      lastName: "Nair",
      role: Role.STUDENT,
      institutionId: instIISc.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Quantum Circuit Simulation & Graph Neural Networks Scholar",
          department: "Computational Data Sciences",
          academicYear: "M.Tech AI '24",
          bio: "Graph Neural Networks, quantum circuit benchmarks, and lattice Monte Carlo simulation.",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
          availability: "20 hrs/wk for open research",
          city: "Bengaluru",
          state: "Karnataka",
          preferredCollaborationMode: CollaborationMode.REMOTE,
          isProfileComplete: true,
        },
      },
    },
  });

  // User 5: Dev Patel (BITS Pilani)
  const u5 = await prisma.user.create({
    data: {
      email: "dev.patel@pilani.bits-pilani.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Dev",
      lastName: "Patel",
      role: Role.STUDENT,
      institutionId: instBITS.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Sub-GHz LoRaWAN & Micro-Rover Embedded Systems Lead",
          department: "Electrical & Electronics Engineering",
          academicYear: "B.E. EEE '26",
          bio: "Embedded C++, ROS2 node development, and Sub-GHz telemetry hardware design.",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
          availability: "10 hrs/wk for robotics sprint",
          city: "Pilani",
          state: "Rajasthan",
          preferredCollaborationMode: CollaborationMode.HYBRID,
          isProfileComplete: true,
        },
      },
    },
  });

  // User 6: Dr. Ananya Mehta (IIT Bombay)
  const u6 = await prisma.user.create({
    data: {
      email: "prof.mehta@iitb.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Dr. Ananya",
      lastName: "Mehta",
      role: Role.FACULTY,
      institutionId: instIITB.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Assoc. Professor • Vision & Deep Learning Lab",
          department: "Computer Science & Engineering",
          academicYear: "Associate Professor",
          bio: "Self-supervised vision transformers, edge robotics perception, and multimodal AI.",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
          availability: "Accepting thesis advisees",
          city: "Mumbai",
          state: "Maharashtra",
          preferredCollaborationMode: CollaborationMode.HYBRID,
          isProfileComplete: true,
        },
      },
    },
  });

  // User 7: Rohan Gupta (IIT Roorkee)
  const u7 = await prisma.user.create({
    data: {
      email: "rohan.gupta@iitr.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Rohan",
      lastName: "Gupta",
      role: Role.STUDENT,
      institutionId: instIITR.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "VLSI & FPGA Accelerator Design Scholar",
          department: "Electronics & Communication Engineering",
          academicYear: "B.Tech ECE '25",
          bio: "Verilog, FPGA accelerators for neural networks, and RISC-V co-processors.",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
          city: "Roorkee",
          state: "Uttarakhand",
          isProfileComplete: true,
        },
      },
    },
  });

  // User 8: Sanya Rao (IIIT Hyderabad)
  const u8 = await prisma.user.create({
    data: {
      email: "sanya.rao@iiit.ac.in",
      passwordHash: defaultPasswordHash,
      firstName: "Sanya",
      lastName: "Rao",
      role: Role.STUDENT,
      institutionId: instIIITH.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Indic NLP & Low-Resource Speech Modeling Researcher",
          department: "Language Technologies Research Center",
          academicYear: "M.S. CS '25",
          bio: "Indic NLP benchmarking, Bhashini pipeline integration, and speech translation models.",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
          city: "Hyderabad",
          state: "Telangana",
          isProfileComplete: true,
        },
      },
    },
  });

  // User 9: Karthik Sundaram (NIT Trichy)
  const u9 = await prisma.user.create({
    data: {
      email: "karthik.s@nitt.edu",
      passwordHash: defaultPasswordHash,
      firstName: "Karthik",
      lastName: "Sundaram",
      role: Role.STUDENT,
      institutionId: instNITT.id,
      isEmailVerified: true,
      profile: {
        create: {
          headline: "Robotics Control Systems & Autonomous Micro-Rovers",
          department: "Mechanical Engineering",
          academicYear: "B.Tech Mech '26",
          bio: "Kinematic control loops, Extended Kalman Filtering, and autonomous rover chassis.",
          avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80",
          city: "Tiruchirappalli",
          state: "Tamil Nadu",
          isProfileComplete: true,
        },
      },
    },
  });

  console.log("✅ Seeded 9 Users across Students, Faculty, and Admin");

  // 5. Assign Skills to Users
  const userSkillPairs = [
    { uId: u1.id, sName: "Distributed Systems", prof: Proficiency.ADVANCED },
    { uId: u1.id, sName: "Rust", prof: Proficiency.ADVANCED },
    { uId: u1.id, sName: "C++20", prof: Proficiency.ADVANCED },
    { uId: u1.id, sName: "Cryptography & Consensus", prof: Proficiency.ADVANCED },
    { uId: u2.id, sName: "Distributed Systems", prof: Proficiency.ADVANCED },
    { uId: u2.id, sName: "Cryptography & Consensus", prof: Proficiency.ADVANCED },
    { uId: u4.id, sName: "Machine Learning", prof: Proficiency.ADVANCED },
    { uId: u4.id, sName: "PyTorch Geometric", prof: Proficiency.ADVANCED },
    { uId: u4.id, sName: "Quantum Computing", prof: Proficiency.INTERMEDIATE },
    { uId: u5.id, sName: "LoRaWAN & IoT", prof: Proficiency.ADVANCED },
    { uId: u5.id, sName: "ROS2 & Robotics", prof: Proficiency.ADVANCED },
    { uId: u5.id, sName: "C++20", prof: Proficiency.INTERMEDIATE },
    { uId: u6.id, sName: "Machine Learning", prof: Proficiency.ADVANCED },
    { uId: u6.id, sName: "ROS2 & Robotics", prof: Proficiency.ADVANCED },
    { uId: u7.id, sName: "VLSI & Architecture", prof: Proficiency.ADVANCED },
    { uId: u8.id, sName: "Natural Language Processing", prof: Proficiency.ADVANCED },
    { uId: u9.id, sName: "ROS2 & Robotics", prof: Proficiency.INTERMEDIATE },
  ];

  for (const pair of userSkillPairs) {
    await prisma.userSkill.create({
      data: {
        userId: pair.uId,
        skillId: skillMap[pair.sName],
        proficiency: pair.prof,
      },
    });
  }

  console.log("✅ Seeded User Skill Relationships");
  console.log("🎉 Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
