export const CONTRIBUTION_VALUES = {
  QUESTION_CREATED: 2,
  HELPFUL_ANSWER: 5,
  ANSWER_ACCEPTED: 10,
  PROJECT_JOINED: 20,
  PROJECT_COMPLETED: 30,
  MENTORSHIP_COMPLETED: 10,
  RESOURCE_SHARED: 5,
  FACULTY_ENDORSED: 15,
};

export const calculateContributionScore = (events = []) => {
  return events.reduce((acc, evt) => {
    const points = CONTRIBUTION_VALUES[evt.type] || evt.points || 0;
    return acc + points;
  }, 0);
};

export const getReputationTier = (score) => {
  if (score >= 2000) return { title: "Distinguished Scholar", badge: "Tier 1 Node", color: "text-amber-600" };
  if (score >= 1000) return { title: "Lead Contributor", badge: "Senior Scholar", color: "text-secondary" };
  if (score >= 500) return { title: "Active Scholar", badge: "Peer Evaluated", color: "text-primary" };
  return { title: "Emerging Researcher", badge: "Verified Student", color: "text-outline" };
};
