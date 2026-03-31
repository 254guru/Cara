'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-container">
      <div className="loader-ring" aria-label="Loading">
        <Image src="/extra-img/giphy.webp" alt="Loading" width={54} height={54} unoptimized />
      </div>
    </div>
  );
}
