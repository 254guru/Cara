'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { NAV_LINKS } from '@/constants';

export default function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <div className="logo">
        <Link href="/" className="logo">
          <Image src="/extra-img/logo.png" alt="Cara Store" width={120} height={40} />
        </Link>
      </div>
      <div className="navigations">
        <div className={`navbar${navOpen ? ' show' : ''}`} id="navbar">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                href === '/'
                  ? pathname === '/' ? 'active' : ''
                  : pathname.startsWith(href) ? 'active' : ''
              }
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="icons">
          <i
            className="fas fa-shopping-cart"
            onClick={openCart}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label="Open cart"
          />
          <span>{itemCount}</span>
          <i
            className={`fas ${navOpen ? 'fa-times' : 'fa-outdent'}`}
            id="menu"
            onClick={() => setNavOpen((v) => !v)}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label="Toggle navigation"
          />
        </div>
      </div>
    </header>
  );
}
