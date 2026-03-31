'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { NAV_LINKS } from '@/constants';

export default function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header>
      <div className="nav-shell">
        <div className="logo">
          <Link href="/" className="logo" aria-label="Cara home">
            <Image src="/extra-img/logo.webp" alt="Cara Store" width={120} height={40} priority />
          </Link>
        </div>
        <div className="navigations">
          <nav className={`navbar${navOpen ? ' show' : ''}`} id="navbar" aria-label="Primary">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={isActive(href) ? 'active' : ''} onClick={() => setNavOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="icons">
            {session?.user ? (
              <div className="auth-links">
                <Link href="/orders" className="icon-btn" aria-label="My orders" title="My orders">
                  <i className="fas fa-box" />
                </Link>
                <button
                  className="icon-btn"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  type="button"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <i className="fas fa-sign-out-alt" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="icon-btn" aria-label="Sign in" title="Sign in">
                <i className="fas fa-user" />
              </Link>
            )}
            <button className="icon-btn" onClick={openCart} aria-label="Open cart" type="button">
              <i className="fas fa-shopping-bag" />
              <span className="cart-badge" aria-live="polite">{itemCount}</span>
            </button>
            <button
              className="icon-btn menu-toggle"
              id="menu"
              onClick={() => setNavOpen((v) => !v)}
              type="button"
              aria-expanded={navOpen}
              aria-label="Toggle navigation"
            >
              <i className={`fas ${navOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
