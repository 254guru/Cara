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
      <Image src="/extra-img/giphy.webp" alt="Loading..." width={80} height={80} unoptimized />
    </div>
  );
}
