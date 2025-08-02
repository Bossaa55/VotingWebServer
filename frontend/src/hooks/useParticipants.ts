import { useState } from 'react';
import type { Participant } from '@/interface/Participant';

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[] | null>(null);
  const [totalVotes, setTotalVotes] = useState(-1);

  const fetchParticipantsStatus = async () => {
    try {
      const response = await fetch(`/api/admin/vote-results`);
      if (response.ok) {
        const data = await response.json();
        const participants = data.participants || [];
        setParticipants(participants);
        setTotalVotes(
          participants.reduce(
            (sum: any, p: { votes: any }) => sum + (p.votes || 0),
            0
          )
        );
      } else if (response.status === 401) {
        window.location.href = '/admin/login';
      } else {
        console.error("Failed to fetch vote results");
        setParticipants([]);
      }
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    }
  };

  const resetVotes = async () => {
    try {
      const response = await fetch(`/api/admin/reset-votes`, {
        method: "POST",
      });
      if (response.ok) {
        await fetchParticipantsStatus();
        return true;
      } else if (response.status === 401) {
        window.location.href = '/admin/login';
        return false;
      } else {
        console.error("Failed to reset votes");
        return false;
      }
    } catch (error) {
      console.error("Failed to reset votes:", error);
      return false;
    }
  };

  return {
    participants,
    totalVotes,
    setParticipants,
    setTotalVotes,
    fetchParticipantsStatus,
    resetVotes,
  };
};