import { useState, useEffect } from 'react';

export const useCountdown = () => {
  const [isRunning, setIsRunning] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(-1);

  const fetchCountdownTime = async () => {
    try {
      const response = await fetch(`/api/admin/countdown-time`);
      if (response.ok) {
        const data = await response.json();
        setTimeLeft(data.countdown_time);
      } else {
        console.error("Failed to fetch countdown time");
        setTimeLeft(120);
      }
    } catch (error) {
      console.error("Failed to fetch countdown time:", error);
    }
  };

  const fetchCountdownStatus = async () => {
    try {
      const response = await fetch(`/api/admin/contdown-status`);
      if (response.ok) {
        const data = await response.json();
        setIsRunning(data.is_countdown_on);
        setTimeLeft(data.countdown_time);
      } else {
        console.error("Failed to fetch countdown status");
      }
    } catch (error) {
      console.error("Failed to fetch countdown status:", error);
    }
  };

  const updateCountdownTime = async (seconds: number) => {
    try {
      const formData = new FormData();
      formData.append("seconds", seconds.toString());

      const response = await fetch(`/api/admin/set-countdown`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTimeLeft(seconds);
        return true;
      } else {
        console.error("Failed to update countdown time");
        return false;
      }
    } catch (error) {
      console.error("Failed to update countdown time:", error);
      return false;
    }
  };

  const toggleCountdown = async () => {
    try {
      const response = await fetch(`/api/admin/toggle-countdown`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setIsRunning(data.is_countdown_on);
        setTimeLeft(data.countdown_time);
        return true;
      } else {
        console.error("Failed to toggle countdown");
        return false;
      }
    } catch (error) {
      console.error("Failed to toggle countdown:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      fetchCountdownTime();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return {
    isRunning,
    timeLeft,
    setTimeLeft,
    fetchCountdownTime,
    fetchCountdownStatus,
    updateCountdownTime,
    toggleCountdown,
  };
};