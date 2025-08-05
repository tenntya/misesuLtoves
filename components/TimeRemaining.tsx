'use client';

import { useEffect, useState } from 'react';

interface TimeRemainingProps {
  expiresAt: string;
}

export default function TimeRemaining({ expiresAt }: TimeRemainingProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft('期限切れ');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeLeft(`残り ${hours}時間${minutes}分`);
      } else {
        setTimeLeft(`残り ${minutes}分`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <span className="text-sm text-gray-500">
      {timeLeft}
    </span>
  );
}