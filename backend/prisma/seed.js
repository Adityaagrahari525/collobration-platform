"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting CampusLink database seed...");
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
    // 3. Create Skills
    const skillNames = [
        "Distributed Systems",
        "Machine Learning",
        "VLSI & Architecture",
        "Quantum Computing",
        "Natural Language Processing",
        "Cryptography & Consensus",
        "Bioinformatics & Genomics",
        "Rust",
        "C++20",
        "PyTorch Geometric",
        "LoRaWAN & IoT",
    ];
    const skillMap = {};
    for (const sName of skillNames) {
        const s = await prisma.skill.create({ data: { name: sName } });
        skillMap[sName] = s.id;
    }
    console.log(`✅ Created ${skillNames.length} Research Skills`);
    // Default password hash: "password123"
    const defaultPasswordHash = await bcryptjs_1.default.hash("password123", 10);
    // 4. Seed Users
    // User 1: Student (Aditya Sharma)
    const u1 = await prisma.user.create({
        data: {
            email: "scholar@iitd.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Aditya",
            lastName: "Sharma",
            role: client_1.Role.STUDENT,
            institutionId: instIITD.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Department of Computer Science & Engineering",
                    academicYear: "B.Tech CSE '25",
                    bio: "Systems researcher working on high-throughput distributed consensus, mesh networks, and IoT flood detection.",
                    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
                    availability: "15 hrs/wk for Consortium Sprints",
                },
            },
        },
    });
    // User 2: Faculty (Dr. Rajesh K. Varma)
    const u2 = await prisma.user.create({
        data: {
            email: "rajesh.varma@iitd.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Dr. Rajesh K.",
            lastName: "Varma",
            role: client_1.Role.FACULTY,
            institutionId: instIITD.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Department of Computer Science & Engineering",
                    academicYear: "Professor & Lab Director",
                    bio: "Head of Distributed Systems & Cloud Infrastructure Research Group at IIT Delhi.",
                    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
                },
            },
        },
    });
    // User 3: Admin (Consortium Node Admin)
    const uAdmin = await prisma.user.create({
        data: {
            email: "admin@iitd.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Consortium",
            lastName: "Admin",
            role: client_1.Role.ADMIN,
            institutionId: instIITD.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Consortium NKN Infrastructure Node",
                    academicYear: "Tier-1 Admin",
                    bio: "Administrator for NKN Consortium Node #04",
                },
            },
        },
    });
    // User 4: Priya Patel (IIT Bombay)
    const u4 = await prisma.user.create({
        data: {
            email: "priya.patel@iitb.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Priya",
            lastName: "Patel",
            role: client_1.Role.STUDENT,
            institutionId: instIITB.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Department of Computer Science & Engineering",
                    academicYear: "M.Tech CSE '24",
                    bio: "Distributed systems, Raft consensus, and BFT protocol research.",
                    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
                },
            },
        },
    });
    // User 5: Dr. Rohini Ramanathan (IIT Madras / IISc affiliate)
    const u5 = await prisma.user.create({
        data: {
            email: "rohini.r@iisc.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Dr. Rohini",
            lastName: "Ramanathan",
            role: client_1.Role.FACULTY,
            institutionId: instIISc.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Center for Hydrology & AI Systems",
                    academicYear: "Faculty PI",
                    bio: "Principal Investigator for Physics-Informed GNN Watershed Modeling.",
                },
            },
        },
    });
    // User 6: Devavrat Saxena (IIT Bombay)
    const u6 = await prisma.user.create({
        data: {
            email: "devavrat@iitb.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Devavrat",
            lastName: "Saxena",
            role: client_1.Role.STUDENT,
            institutionId: instIITB.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Vision & Deep Learning Lab",
                    academicYear: "Ph.D. Candidate",
                    bio: "Self-supervised vision transformers and edge sensors.",
                },
            },
        },
    });
    // User 7: Neha Deshmukh (IIIT Hyderabad)
    const u7 = await prisma.user.create({
        data: {
            email: "neha.deshmukh@iiit.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Neha",
            lastName: "Deshmukh",
            role: client_1.Role.STUDENT,
            institutionId: instIIITH.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Language Technologies Research Center",
                    academicYear: "M.Tech AI/ML",
                    bio: "Indic NLP, LLM quantization, and speech models.",
                },
            },
        },
    });
    // User 8: Kabir Sen (BITS Pilani)
    const u8 = await prisma.user.create({
        data: {
            email: "kabir.sen@pilani.bits-pilani.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Kabir",
            lastName: "Sen",
            role: client_1.Role.STUDENT,
            institutionId: instBITS.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Department of Computer Science",
                    academicYear: "4th Year B.E.",
                    bio: "P2P network protocols, NAT traversal, and Rust.",
                },
            },
        },
    });
    // User 9: Ananya Chakraborty (IISc Bangalore)
    const u9 = await prisma.user.create({
        data: {
            email: "ananya.c@iisc.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Ananya",
            lastName: "Chakraborty",
            role: client_1.Role.STUDENT,
            institutionId: instIISc.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "NLP & AI Group",
                    academicYear: "Postdoc Fellow",
                    bio: "Bhashini pipeline integration and low-resource Indian LLMs.",
                },
            },
        },
    });
    // User 10: Vikramaditya Rao (IIIT Hyderabad)
    const u10 = await prisma.user.create({
        data: {
            email: "vikram.rao@iiit.ac.in",
            passwordHash: defaultPasswordHash,
            firstName: "Vikramaditya",
            lastName: "Rao",
            role: client_1.Role.STUDENT,
            institutionId: instIIITH.id,
            isEmailVerified: true,
            profile: {
                create: {
                    department: "Robotics Research Center",
                    academicYear: "4th Year Dual Degree",
                    bio: "Reinforcement learning with verifiable bounds.",
                },
            },
        },
    });
    console.log("✅ Seeded 10 Users across Students, Faculty, and Admin");
    // 5. Assign Skills to Users
    const userSkillPairs = [
        { uId: u1.id, sName: "Distributed Systems", prof: client_1.Proficiency.ADVANCED },
        { uId: u1.id, sName: "Rust", prof: client_1.Proficiency.ADVANCED },
        { uId: u1.id, sName: "C++20", prof: client_1.Proficiency.ADVANCED },
        { uId: u1.id, sName: "Cryptography & Consensus", prof: client_1.Proficiency.ADVANCED },
        { uId: u2.id, sName: "Distributed Systems", prof: client_1.Proficiency.ADVANCED },
        { uId: u4.id, sName: "Cryptography & Consensus", prof: client_1.Proficiency.ADVANCED },
        { uId: u5.id, sName: "PyTorch Geometric", prof: client_1.Proficiency.ADVANCED },
        { uId: u5.id, sName: "LoRaWAN & IoT", prof: client_1.Proficiency.ADVANCED },
        { uId: u6.id, sName: "Machine Learning", prof: client_1.Proficiency.ADVANCED },
        { uId: u7.id, sName: "Natural Language Processing", prof: client_1.Proficiency.ADVANCED },
        { uId: u8.id, sName: "Rust", prof: client_1.Proficiency.INTERMEDIATE },
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
