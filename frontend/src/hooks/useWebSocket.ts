import { useEffect } from 'react';
import type { Participant } from '@/interface/Participant';

export const useWebSocket = (
  setParticipants: (participants: Participant[]) => void,
  setTimeLeft: (time: number) => void,
  setTotalVotes: (votes: number) => void
) => {
  useEffect(() => {
    const subscribeToParticipants = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const backendHost = "localhost:8000";
      const wsUrl = `${protocol}//${backendHost}/api/admin/subscribe-participants`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setParticipants(data.participants || []);
        if (data.countdown_time) setTimeLeft(data.countdown_time);
        setTotalVotes(
          data.participants.reduce(
            (sum: any, p: { votes: any }) => sum + (p.votes || 0),
            0
          )
        );
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      return () => {
        ws.close();
      };
    };

    return subscribeToParticipants();
  }, [setParticipants, setTimeLeft, setTotalVotes]);
};