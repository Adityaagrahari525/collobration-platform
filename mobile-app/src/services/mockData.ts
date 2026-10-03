/**
 * CampusLink Academic Seed Data
 * Mirrors and enriches the web platform mock dataset
 */

import { User, Question, Project, Community, MentorshipSlot, NotificationItem } from "../types";

export const INITIAL_USERS: User[] = [
  {
    id: "usr-1",
    name: "Aditya Sharma",
    institution: "IIT Delhi",
    department: "Computer Science & Engineering",
    degree: "B.Tech CSE '25",
    role: "student",
    verified: true,
    verificationCode: "#IN-9042-DL",
    email: "aditya.sharma@iitd.ac.in",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    bio: "Systems researcher working on high-throughput distributed consensus, mesh networks, and IoT flood telemetry.",
    contributionScore: 1420,
    xpPoints: 1420,
    currentStreak: 12,
    lastActiveDate: new Date().toISOString(),
    answersCount: 34,
    acceptedAnswersCount: 28,
    projectsCount: 5,
    skills: ["Distributed Systems", "C++20", "Go", "Rust", "NKN Protocol", "Kafka", "React Native"],
    interests: ["Mesh Networks", "Distributed Consensus", "Edge Computing", "Disaster Telemetry"],
    availability: "Weekends",
    experience: "Advanced",
    badges: ["Top Contributor", "Solution Architect", "Peer Helper", "Weekly Active Scholar", "Campus Verified"],
    endorsements: [
      { id: "end-1", by: "Dr. Rajesh K. Varma", role: "Professor, IIT Delhi", note: "Outstanding implementation of consensus primitives." },
      { id: "end-2", by: "Dr. Ananya Roy", role: "Associate Dean, IISc", note: "Peer-validated response on Raft log replication optimization." }
    ],
    contributions: [
      { id: "cnt-1", type: "ANSWER_ACCEPTED", description: "Answer accepted on 'BFT Consensus in Low Latency Mesh Nodes'", points: 10, date: "2 hours ago" },
      { id: "cnt-2", type: "PROJECT_JOINED", description: "Joined FloodSense IoT Sensor Network Project", points: 20, date: "Yesterday" },
      { id: "cnt-3", type: "FACULTY_ENDORSED", description: "Endorsed by Dr. Rajesh K. Varma for Systems Architecture", points: 15, date: "3 days ago" },
      { id: "cnt-4", type: "QUESTION_CREATED", description: "Posted technical query on eBPF packet tracing performance", points: 2, date: "4 days ago" }
    ]
  },
  {
    id: "usr-2",
    name: "Dr. Rajesh K. Varma",
    institution: "IIT Delhi",
    department: "Computer Science & Engineering",
    degree: "Professor & Lab Director",
    role: "faculty",
    verified: true,
    verificationCode: "#FAC-0192-DL",
    email: "rajesh.varma@iitd.ac.in",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    bio: "Head of Distributed Systems & Cloud Infrastructure Research Group at IIT Delhi.",
    contributionScore: 4890,
    xpPoints: 4890,
    currentStreak: 25,
    lastActiveDate: new Date().toISOString(),
    answersCount: 142,
    acceptedAnswersCount: 119,
    projectsCount: 12,
    skills: ["Distributed Systems", "Fault Tolerance", "Operating Systems", "Cloud Computing"],
    interests: ["Consensus Protocols", "Kernel Subsystems", "Cloud Reliability"],
    availability: "Part-time",
    experience: "Advanced",
    badges: ["Top Contributor", "Solution Architect", "Verified Mentor", "Campus Verified"],
    endorsements: [],
    contributions: []
  },
  {
    id: "usr-3",
    name: "Priya Sundaram",
    institution: "IISc Bangalore",
    department: "Electrical Engineering",
    degree: "Ph.D. Scholar '24",
    role: "student",
    verified: true,
    verificationCode: "#IN-4481-BLR",
    email: "priya.sundaram@iisc.ac.in",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    bio: "Researching edge AI acceleration, FPGA neural synthesis, and real-time signal processing.",
    contributionScore: 1980,
    xpPoints: 1980,
    currentStreak: 8,
    lastActiveDate: new Date().toISOString(),
    answersCount: 52,
    acceptedAnswersCount: 44,
    projectsCount: 7,
    skills: ["Edge AI", "PyTorch", "Verilog", "FPGA", "Embedded Systems"],
    interests: ["Hardware Acceleration", "Neural Compilers", "DSP"],
    availability: "Full-time",
    experience: "Advanced",
    badges: ["Top Contributor", "Solution Architect", "Campus Verified"],
    endorsements: [],
    contributions: []
  },
  {
    id: "usr-4",
    name: "Rohan Kulkarni",
    institution: "IIT Bombay",
    department: "Mechanical & Robotics",
    degree: "M.Tech Robotics '25",
    role: "student",
    verified: true,
    verificationCode: "#IN-8820-BOM",
    email: "rohan.kulkarni@iitb.ac.in",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    bio: "Autonomous aerial robotics, ROS2 controller architecture, and SLAM navigation.",
    contributionScore: 1150,
    xpPoints: 1150,
    currentStreak: 5,
    lastActiveDate: new Date().toISOString(),
    answersCount: 22,
    acceptedAnswersCount: 18,
    projectsCount: 4,
    skills: ["ROS2", "SLAM", "C++", "Drone Controllers", "Computer Vision"],
    interests: ["Swarm Robotics", "Autonomous Flight", "Kinematics"],
    availability: "Weekends",
    experience: "Intermediate",
    badges: ["Peer Helper", "Campus Verified"],
    endorsements: [],
    contributions: []
  },
  {
    id: "usr-5",
    name: "Dr. Meera Nambiar",
    institution: "BITS Pilani",
    department: "Biotechnology & Bioinformatics",
    degree: "Associate Professor",
    role: "faculty",
    verified: true,
    verificationCode: "#FAC-3301-PIL",
    email: "meera.nambiar@pilani.bits-pilani.ac.in",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    bio: "Genomic sequence alignment algorithms and AlphaFold structural docking pipelines.",
    contributionScore: 3420,
    xpPoints: 3420,
    currentStreak: 18,
    lastActiveDate: new Date().toISOString(),
    answersCount: 88,
    acceptedAnswersCount: 76,
    projectsCount: 9,
    skills: ["Bioinformatics", "Genomics", "Python", "AlphaFold", "Structural Biology"],
    interests: ["Computational Biology", "Protein Folding", "Drug Discovery"],
    availability: "Part-time",
    experience: "Advanced",
    badges: ["Verified Mentor", "Campus Verified", "Solution Architect"],
    endorsements: [],
    contributions: []
  },
  {
    id: "usr-6",
    name: "Kavya Menon",
    institution: "NIT Trichy",
    department: "Electronics & Communication",
    degree: "B.Tech ECE '26",
    role: "student",
    verified: true,
    verificationCode: "#IN-1290-TR",
    email: "kavya.menon@nitt.edu",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    bio: "Sub-GHz RF telemetry protocols, LoRa mesh gateways, and environmental sensing.",
    contributionScore: 890,
    xpPoints: 890,
    currentStreak: 6,
    lastActiveDate: new Date().toISOString(),
    answersCount: 16,
    acceptedAnswersCount: 12,
    projectsCount: 3,
    skills: ["LoRaWAN", "RF Circuit Design", "Microcontrollers", "Python", "MQTT"],
    interests: ["IoT Telemetry", "Wireless Propagation", "Embedded Sensors"],
    availability: "Weekends",
    experience: "Intermediate",
    badges: ["Campus Verified", "Peer Helper"],
    endorsements: [],
    contributions: []
  },
  {
    id: "usr-7",
    name: "Vikram Das",
    institution: "IIIT Hyderabad",
    department: "Computer Science & AI",
    degree: "Ph.D. Scholar '26",
    role: "student",
    verified: true,
    verificationCode: "#IN-7712-HYD",
    email: "vikram.das@research.iiit.ac.in",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80",
    bio: "Large Multimodal Models for Indic language translation and zero-shot reasoning.",
    contributionScore: 2310,
    xpPoints: 2310,
    currentStreak: 14,
    lastActiveDate: new Date().toISOString(),
    answersCount: 61,
    acceptedAnswersCount: 50,
    projectsCount: 6,
    skills: ["NLP", "Transformers", "LLMs", "PyTorch", "CUDA", "Indic Languages"],
    interests: ["Multimodal AI", "Low-Resource Translation", "Attention Mechanisms"],
    availability: "Full-time",
    experience: "Advanced",
    badges: ["Top Contributor", "Solution Architect", "Campus Verified"],
    endorsements: [],
    contributions: []
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q-101",
    authorId: "usr-1",
    authorName: "Aditya Sharma",
    authorRole: "Student, IIT Delhi",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    title: "How to minimize tail latency in raft consensus log replication over high-loss sub-GHz mesh networks?",
    description: "We are deploying an edge sensor node cluster (FloodSense project) using 868MHz sub-GHz radios across river basins. Under high packet loss conditions (>12%), standard Raft leader heartbeats time out prematurely, triggering unnecessary leader re-elections and spiking tail latency. Has anyone modified heartbeat timeout dynamics or implemented piggybacked TCP-like selective ACKs for Raft in embedded C++ environment?",
    department: "Computer Science & Engineering",
    subject: "Distributed Systems",
    year: "2026",
    tags: ["Distributed Systems", "Raft", "Embedded C++", "Mesh Networks", "FloodSense"],
    votes: 42,
    userVoted: false,
    saved: true,
    staffVerified: true,
    isAnonymous: false,
    createdAt: "3 hours ago",
    answers: [
      {
        id: "ans-201",
        questionId: "q-101",
        authorId: "usr-2",
        authorName: "Dr. Rajesh K. Varma",
        authorRole: "Professor, IIT Delhi",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
        content: "Great inquiry Aditya. For high packet loss mesh networks, rigid timer-based heartbeat timeouts cause election storms. Instead of reducing timeout windows, introduce an adaptive exponential window based on current RSSI and SNR readings. Additionally, batching log entries into a sliding window protocol reduces ACK packet frequency by 65%. You can inspect our lab's open implementation on NKN Grid.",
        votes: 24,
        isAccepted: true,
        createdAt: "2 hours ago"
      },
      {
        id: "ans-202",
        questionId: "q-101",
        authorId: "usr-3",
        authorName: "Priya Sundaram",
        authorRole: "Ph.D. Scholar, IISc",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
        content: "Have you considered using EPFD (Eventually Perfect Failure Detector) semantics with a Gossip sub-layer? We ran a benchmark on 802.15.4 nodes and saw 40% lower election overhead compared to naive Raft implementation.",
        votes: 11,
        isAccepted: false,
        createdAt: "1 hour ago"
      }
    ]
  },
  {
    id: "q-102",
    authorId: "usr-7",
    authorName: "Vikram Das",
    authorRole: "Ph.D. Scholar, IIIT Hyderabad",
    authorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80",
    title: "Optimizing PyTorch CUDA memory allocator fragmentation in 7B Parameter Model fine-tuning",
    description: "When running LoRA fine-tuning on dual RTX 4090 GPUs, out-of-memory errors occur despite tensor memory total remaining below 18GB. `torch.cuda.memory_summary()` shows 6GB allocated in inactive fragments. How do we tune `max_split_size_mb` or custom memory pools for transformer multi-head attention blocks without degrading throughput?",
    department: "Computer Science & AI",
    subject: "Machine Learning / Systems",
    year: "2026",
    tags: ["PyTorch", "CUDA", "LLM", "LoRA", "GPU Memory"],
    votes: 35,
    userVoted: true,
    saved: false,
    staffVerified: false,
    isAnonymous: false,
    createdAt: "5 hours ago",
    answers: [
      {
        id: "ans-203",
        questionId: "q-102",
        authorId: "usr-1",
        authorName: "Aditya Sharma",
        authorRole: "B.Tech CSE '25, IIT Delhi",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        content: "Set `PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128,expandable_segments:True`. `expandable_segments` allows PyTorch to request virtual memory address space contiguous mapping, avoiding hard fragmentation when memory is freed during backward activation sweeps.",
        votes: 18,
        isAccepted: true,
        createdAt: "4 hours ago"
      }
    ]
  },
  {
    id: "q-103",
    authorId: "usr-6",
    authorName: "Anonymous Scholar",
    authorRole: "Student, NIT Trichy",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    title: "Recommended setup for real-time sub-surface water level pressure sensor calibration?",
    description: "Asking on behalf of my research group studying Yamuna basin flood telemetry. We noticed baseline drift in piezometric pressure sensors under temperature swings between 18°C and 42°C. Does anyone have polynomial temperature compensation coefficients or calibration scripts?",
    department: "Electronics & Communication",
    subject: "Sensors & Telemetry",
    year: "2025",
    tags: ["Sensors", "Calibration", "Telemetry", "Hydrology", "Anonymous"],
    votes: 19,
    userVoted: false,
    saved: false,
    staffVerified: true,
    isAnonymous: true,
    createdAt: "1 day ago",
    answers: []
  },
  {
    id: "q-104",
    authorId: "usr-4",
    authorName: "Rohan Kulkarni",
    authorRole: "M.Tech Robotics, IIT Bombay",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    title: "ROS2 Humble vs ROS2 Iron: Micro-XRCE-DDS performance comparison on STM32 H7?",
    description: "We are migrating robot telemetry controllers to STM32 H7 microcontrollers using Micro-ROS. Looking for benchmark data comparing throughput and packet drops between XRCE-DDS middleware in Humble vs Iron distributions.",
    department: "Mechanical & Robotics",
    subject: "Robotics",
    year: "2025",
    tags: ["ROS2", "Robotics", "Embedded", "STM32", "Micro-ROS"],
    votes: 28,
    userVoted: false,
    saved: true,
    staffVerified: false,
    isAnonymous: false,
    createdAt: "2 days ago",
    answers: []
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-826",
    title: "FloodSense — Sub-GHz IoT Flood Telemetry Mesh Network",
    tagline: "Real-time river basin monitoring using sub-GHz LoRa mesh and distributed consensus for early flash-flood prediction.",
    description: "FloodSense is an inter-institutional research initiative building zero-infrastructure flood monitoring node clusters across vulnerable floodplains in India. The system utilizes low-power sub-GHz RF mesh topology combined with lightweight Raft consensus to process sensor telemetry locally before uplinking to central disaster response hubs.",
    institution: "IIT Delhi · IISc Bangalore Consortium",
    department: "CSE / ECE / Hydrology",
    status: "Recruiting",
    lead: "Aditya Sharma (IIT Delhi)",
    leadId: "usr-1",
    team: [
      { name: "Aditya Sharma", role: "Project Lead / Systems", institution: "IIT Delhi", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" },
      { name: "Kavya Menon", role: "Hardware & RF Design", institution: "NIT Trichy", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80" },
      { name: "Priya Sundaram", role: "Signal Processing & Edge AI", institution: "IISc Bangalore", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80" }
    ],
    skillsRequired: ["Embedded C++", "Sub-GHz LoRaWAN", "Raft Consensus", "PostGIS", "Edge AI"],
    openRoles: ["Firmware Engineer", "GIS Data Analyst", "Embedded Systems Developer"],
    metrics: {
      nodesDeployed: 48,
      latencyMs: 142,
      accuracyPct: 99.4,
      dataProcessedMB: 4800
    },
    milestones: [
      { title: "Sub-GHz RF Mesh Driver Implementation", status: "Completed", date: "Aug 2026" },
      { title: "Embedded Raft Consensus Engine Integration", status: "Completed", date: "Sep 2026" },
      { title: "Field Deployment Test — Yamuna Basin Node Cluster", status: "In Progress", date: "Oct 2026" },
      { title: "NDRF Telemetry Gateway API Verification", status: "Upcoming", date: "Nov 2026" }
    ],
    createdAt: "1 month ago"
  },
  {
    id: "proj-827",
    title: "BharatLLM — Multimodal Foundation Model for Indic Languages",
    tagline: "7B parameter open research LLM optimized for 14 Indian languages with low resource fine-tuning.",
    description: "An open academic collaboration between IIIT Hyderabad, IIT Bombay, and IISc developing high-fidelity Indic NLP benchmarks, tokenizers, and instruction datasets.",
    institution: "IIIT Hyderabad · IIT Bombay",
    department: "Computer Science & AI",
    status: "In Progress",
    lead: "Vikram Das (IIIT Hyderabad)",
    leadId: "usr-7",
    team: [
      { name: "Vikram Das", role: "Lead Architect", institution: "IIIT Hyderabad", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80" }
    ],
    skillsRequired: ["PyTorch", "CUDA", "Transformers", "Dataset Curation", "Indic Languages"],
    openRoles: ["Evaluation Benchmark Lead", "Low-Resource Tokenizer Specialist"],
    metrics: {
      tokensBillion: 120,
      languagesCount: 14,
      accuracyPct: 94.2,
      modelSizeGB: 14.8
    },
    milestones: [
      { title: "Tokenization Pipeline for 14 Languages", status: "Completed", date: "Jul 2026" },
      { title: "Pre-training Phase on NKN Supercomputer", status: "In Progress", date: "Oct 2026" }
    ],
    createdAt: "2 months ago"
  },
  {
    id: "proj-828",
    title: "AeroROS — Autonomous Aerial Swarm Navigation ROS2 Stack",
    tagline: "Swarm robotics controller for decentralized aerial search and rescue operations.",
    description: "Developing fault-tolerant, ROS2-native swarm formation protocols and obstacle avoidance for UAV fleets.",
    institution: "IIT Bombay · NIT Trichy",
    department: "Robotics & Aerospace",
    status: "Recruiting",
    lead: "Rohan Kulkarni (IIT Bombay)",
    leadId: "usr-4",
    team: [
      { name: "Rohan Kulkarni", role: "Swarm Lead", institution: "IIT Bombay", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80" }
    ],
    skillsRequired: ["ROS2", "C++", "Gazebo", "Drone Controllers", "Computer Vision"],
    openRoles: ["Perception Engineer", "Flight Control Algorithm Specialist"],
    metrics: {
      dronesSupported: 16,
      latencyMs: 18,
      accuracyPct: 98.7,
      simHours: 1200
    },
    milestones: [
      { title: "Gazebo Swarm World Simulation", status: "Completed", date: "Aug 2026" }
    ],
    createdAt: "3 weeks ago"
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: "comm-1",
    name: "Distributed Systems & Mesh Computing Consortium",
    description: "Inter-IIT and IISc research group focused on fault tolerant consensus, edge compute, and peer-to-peer telemetry.",
    membersCount: 420,
    institution: "National Knowledge Network (NKN)",
    topics: ["Consensus Protocols", "Raft/PBFT", "Mesh RF", "eBPF", "Kubernetes"],
    icon: "layers",
    joined: true
  },
  {
    id: "comm-2",
    name: "AI & Machine Learning Research India",
    description: "National consortium exploring Indic NLP, model quantization, edge inference, and synthetic data generation.",
    membersCount: 1240,
    institution: "IIIT Hyderabad / IISc",
    topics: ["Transformers", "PyTorch", "LLMs", "Quantization", "Vision"],
    icon: "cpu",
    joined: false
  },
  {
    id: "comm-3",
    name: "Autonomous Robotics & Drone Systems Lab",
    description: "Multi-campus robotics collective sharing ROS2 packages, trajectory planning benchmarks, and hardware schematics.",
    membersCount: 310,
    institution: "IIT Bombay / NIT Trichy",
    topics: ["ROS2", "SLAM", "Gazebo", "Micro-ROS", "UAVs"],
    icon: "navigation",
    joined: true
  }
];

export const INITIAL_MENTORSHIP_SLOTS: MentorshipSlot[] = [
  {
    id: "slot-1",
    facultyId: "usr-2",
    facultyName: "Dr. Rajesh K. Varma",
    facultyRole: "Professor & Lab Director",
    facultyAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    institution: "IIT Delhi",
    department: "Computer Science & Engineering",
    topic: "Distributed Consensus & Peer-to-Peer Telemetry Architecture",
    availableDate: "Tomorrow at 4:00 PM IST",
    durationMinutes: 45,
    maxCapacity: 3,
    bookedCount: 1,
    meetingLink: "https://meet.google.com/iitd-cs-research"
  },
  {
    id: "slot-2",
    facultyId: "usr-5",
    facultyName: "Dr. Meera Nambiar",
    facultyRole: "Associate Professor",
    facultyAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    institution: "BITS Pilani",
    department: "Biotechnology & Bioinformatics",
    topic: "AlphaFold Structural Docking & Computational Biology Roadmaps",
    availableDate: "Friday at 2:30 PM IST",
    durationMinutes: 30,
    maxCapacity: 2,
    bookedCount: 0,
    meetingLink: "https://meet.google.com/bits-bio-lab"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "answer_accepted",
    title: "Answer Accepted!",
    message: "Your answer on 'Optimizing PyTorch CUDA memory allocator' was marked as the accepted solution (+10 pts).",
    read: false,
    timestamp: "2 hours ago",
    targetScreen: "QuestionDetail",
    targetId: "q-102"
  },
  {
    id: "notif-2",
    type: "endorsement",
    title: "Faculty Endorsement Received",
    message: "Dr. Rajesh K. Varma endorsed your skill 'Systems Architecture' (+15 pts).",
    read: false,
    timestamp: "3 days ago",
    targetScreen: "Profile",
    targetId: "usr-1"
  },
  {
    id: "notif-3",
    type: "mentorship_confirmed",
    title: "Mentorship Office Hours Confirmed",
    message: "Your research advisory session with Dr. Rajesh K. Varma is scheduled for tomorrow at 4:00 PM.",
    read: true,
    timestamp: "1 day ago",
    targetScreen: "Mentorship",
    targetId: "slot-1"
  }
];
