import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/apiService";

export const PersonProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, sendConnectionRequest, connections } = useApp();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchPerson() {
      setLoading(true);
      try {
        const res = await apiService.getPersonById(id);
        if (res.success && res.data && isMounted) {
          setPerson(res.data);
        }
      } catch (err) {
        // Fallback to local dataset user if available
        const local = users.find((u) => u.id === id);
        if (local && isMounted) setPerson(local);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPerson();
    return () => {
      isMounted = false;
    };
  }, [id, users]);

  const fallbackUser = users.find((u) => u.id === id) || users[0];
  const activePerson = person || fallbackUser;
  const isConnected = connections.includes(activePerson.id);

  if (loading && !activePerson) {
    return (
      <div className="p-space-lg text-center font-mono text-on-surface-variant">
        Fetching scholar profile context...
      </div>
    );
  }

  return (
    <div className="space-y-space-lg max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-serif font-bold text-primary text-xl shadow-xs">
              {activePerson.avatarUrl ? (
                <img
                  src={activePerson.avatarUrl}
                  alt={activePerson.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                `${activePerson.firstName?.[0] || 'A'}${activePerson.lastName?.[0] || 'S'}`
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-md text-headline-md text-primary font-serif font-bold">
                  {activePerson.name || `${activePerson.firstName} ${activePerson.lastName}`}
                </h1>
                <span className="material-symbols-outlined text-[20px] text-secondary">verified</span>
              </div>
              <div className="font-title-sm text-title-sm text-on-surface-variant">
                {activePerson.department || activePerson.degree} · {typeof activePerson.institution === "string" ? activePerson.institution : activePerson.institutionDetail?.name}
              </div>
              <div className="font-mono text-label-sm text-outline mt-0.5">
                {activePerson.headline || `${activePerson.role} · ${activePerson.institutionDetail?.city || "India"}`}
              </div>
            </div>
          </div>

          <button
            onClick={() => sendConnectionRequest(activePerson.id)}
            disabled={isConnected}
            className={`px-6 py-2.5 rounded-xl font-title-sm font-semibold shadow transition-all ${
              isConnected
                ? "bg-secondary-container text-on-secondary-container opacity-80"
                : "bg-primary text-on-primary hover:bg-primary/90"
            }`}
          >
            {isConnected ? "Request Sent" : "Connect & Collaborate"}
          </button>
        </div>

        <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
          {activePerson.bio || "Verified scholar research profile in CampusLink Academic Network."}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-surface-container-low text-center font-mono">
          <div className="p-3 bg-surface-container-low rounded-xl">
            <div className="text-headline-sm font-bold text-primary">{activePerson.contributionScore || 2840}</div>
            <div className="text-label-sm text-outline uppercase">Contribution Points</div>
          </div>
          <div className="p-3 bg-surface-container-low rounded-xl">
            <div className="text-headline-sm font-bold text-secondary">{activePerson.answersCount || 142}</div>
            <div className="text-label-sm text-outline uppercase">Answers Given</div>
          </div>
          <div className="p-3 bg-surface-container-low rounded-xl">
            <div className="text-headline-sm font-bold text-on-surface">{activePerson.acceptedAnswersCount || 89}</div>
            <div className="text-label-sm text-outline uppercase">Accepted Answers</div>
          </div>
          <div className="p-3 bg-surface-container-low rounded-xl">
            <div className="text-headline-sm font-bold text-tertiary-container">{activePerson.projectsCount || 4}</div>
            <div className="text-label-sm text-outline uppercase">Projects</div>
          </div>
        </div>
      </div>

      {/* Skills & Endorsements */}
      <div className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm space-y-4">
        <h2 className="font-headline-sm text-headline-sm text-primary font-serif">Verified Skills & Faculty Endorsements</h2>
        <div className="flex flex-wrap gap-2">
          {activePerson.skills?.map((sk, idx) => (
            <span key={idx} className="px-3.5 py-1.5 bg-primary-container/20 text-primary font-mono font-semibold rounded-lg text-body-sm">
              {typeof sk === "string" ? sk : sk.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
