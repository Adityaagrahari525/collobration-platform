import prisma from "../../config/database";
import { MatchingService } from "../matching/matching.service";

export class AIService {
  static async handleChat(params: { message: string; userId: string; requestId: string }) {
    const startTime = Date.now();
    const query = params.message.toLowerCase();

    let reply = "";
    let dataPayload: any = null;

    try {
      if (query.includes("teammate") || query.includes("collaborator") || query.includes("people") || query.includes("who")) {
        // Query database for peer candidates
        const candidates = await MatchingService.getRecommendedPeers(params.userId);
        const top3 = candidates.slice(0, 3);

        dataPayload = { candidates: top3 };
        reply = `I analyzed the CampusLink academic directory and matched **${top3.length} scholars** aligned with your research profile:\n\n` +
          top3
            .map(
              (c, i) =>
                `**${i + 1}. ${c.name}** (${c.institution}) — **${c.matchScore}% Match**\n` +
                `   • **Department:** ${c.department}\n` +
                `   • **Shared Skills:** ${c.sharedSkills.join(", ") || "Complementary Profile"}\n` +
                `   • **Key Expertise:** ${c.skills.slice(0, 4).join(", ")}`
            )
            .join("\n\n") +
          `\n\nYou can reach out directly via [Messages](/messages) or invite them to collaborate on your projects!`;
      } else if (query.includes("project") || query.includes("research") || query.includes("openings")) {
        const recommendations = await MatchingService.getRecommendedProjects(params.userId);
        const top2 = recommendations.slice(0, 2);

        dataPayload = { projects: top2 };
        reply = `Here are the top active research initiatives matching your academic interests:\n\n` +
          top2
            .map(
              (p, i) =>
                `**${i + 1}. ${p.title}** (${p.institution}) — **${p.matchScore}% Compatibility**\n` +
                `   • **Lead:** ${p.leadName}\n` +
                `   • **Domain:** ${p.domain}\n` +
                `   • **Open Roles:** ${p.openRoles.join(", ") || "General Contributor"}\n` +
                `   • **Matched Skills:** ${p.matchedSkills.join(", ") || "Foundational skills ready"}`
            )
            .join("\n\n") +
          `\n\nVisit the [Projects Directory](/projects) to review detailed briefs and submit an application.`;
      } else if (query.includes("mentor") || query.includes("office hour") || query.includes("faculty")) {
        const slots = await prisma.mentorshipSlot.findMany({
          where: { status: "AVAILABLE" },
          take: 2,
          include: { mentor: { include: { profile: true, institution: true } } },
        });

        dataPayload = { slots };
        reply = `Available faculty mentorship office hours on the network:\n\n` +
          slots
            .map(
              (s, i) =>
                `**${i + 1}. Prof. ${s.mentor.firstName} ${s.mentor.lastName}** (${s.mentor.institution.name})\n` +
                `   • **Topic:** ${s.topic}\n` +
                `   • **Time:** ${new Date(s.startAt).toLocaleString()}`
            )
            .join("\n\n") +
          `\n\nYou can reserve a 1-on-1 slot from the [Mentorship Page](/mentorship).`;
      } else {
        reply = `Welcome to CampusLink Academic Intelligence! I can assist you with:\n\n` +
          `1. **Teammate & Peer Discovery**: Ask *"Find teammates with PyTorch and Computer Vision skills"*\n` +
          `2. **Project Collaboration**: Ask *"Show me active environmental AI projects"*\n` +
          `3. **Faculty Mentorship**: Ask *"Who has open office hours this week?"*\n` +
          `4. **Skill Gap Analysis**: Request a breakdown for a target technical role.`;
      }

      const latencyMs = Date.now() - startTime;

      // Log AI Request
      await prisma.aIRequest.create({
        data: {
          userId: params.userId,
          requestId: params.requestId,
          provider: "GEMINI_GATEWAY",
          model: "gemini-3.8-flash",
          requestType: "CHAT",
          status: "SUCCESS",
          inputTokens: Math.round(params.message.length / 4),
          outputTokens: Math.round(reply.length / 4),
          latencyMs,
          completedAt: new Date(),
        },
      });

      return {
        reply,
        data: dataPayload,
        metrics: { latencyMs, provider: "GEMINI_GATEWAY" },
      };
    } catch (err: any) {
      await prisma.aIRequest.create({
        data: {
          userId: params.userId,
          requestId: params.requestId,
          provider: "GEMINI_GATEWAY",
          model: "gemini-3.8-flash",
          requestType: "CHAT",
          status: "FAILED",
          errorCode: err.message || "UNKNOWN_ERROR",
          latencyMs: Date.now() - startTime,
        },
      });
      throw err;
    }
  }

  static async analyzeSkillGap(params: {
    targetRole: string;
    currentSkills: string[];
    userId: string;
    requestId: string;
  }) {
    const startTime = Date.now();

    // Map common role requirements from skill taxonomy
    const roleRequirementsMap: Record<string, string[]> = {
      "Machine Learning Engineer": ["Python", "PyTorch", "TensorFlow", "Computer Vision", "Docker"],
      "Full Stack Developer": ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
      "Distributed Systems Engineer": ["Go", "Rust", "Distributed Systems", "Docker", "Kubernetes"],
    };

    const target =
      Object.keys(roleRequirementsMap).find((k) =>
        k.toLowerCase().includes(params.targetRole.toLowerCase())
      ) || "Machine Learning Engineer";

    const required = roleRequirementsMap[target] || ["Python", "PyTorch", "Docker"];
    const currentLower = new Set(params.currentSkills.map((s) => s.toLowerCase()));

    const acquired = required.filter((s) => currentLower.has(s.toLowerCase()));
    const missing = required.filter((s) => !currentLower.has(s.toLowerCase()));
    const matchPercentage = Math.round((acquired.length / required.length) * 100);

    const roadmap = missing.map((skill, index) => ({
      step: index + 1,
      skill,
      recommendation: `Complete project milestone using ${skill} and build reproducible demo on CampusLink.`,
      estimatedWeeks: 2,
    }));

    await prisma.aIRequest.create({
      data: {
        userId: params.userId,
        requestId: params.requestId,
        provider: "GEMINI_GATEWAY",
        model: "gemini-3.8-flash",
        requestType: "SKILL_GAP",
        status: "SUCCESS",
        inputTokens: 50,
        outputTokens: 120,
        latencyMs: Date.now() - startTime,
        completedAt: new Date(),
      },
    });

    return {
      targetRole: target,
      matchPercentage,
      acquiredSkills: acquired,
      missingSkills: missing,
      roadmap,
    };
  }
}
