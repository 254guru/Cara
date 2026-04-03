'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AIAssistantWidget = dynamic(() => import('@/components/ai/AIAssistantWidget'), {
  ssr: false,
});

export default function DeferredAIAssistant() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | null = null;
    let timerId: number | null = null;

    const show = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof (window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }).requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(show, { timeout: 2000 });
    } else {
      timerId = window.setTimeout(show, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  if (!ready) return null;
  return <AIAssistantWidget />;
}
