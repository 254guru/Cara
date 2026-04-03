'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { NAV_LINKS } from '@/constants';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCart } = useCart();
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Avoid triggering state updates on every scroll frame when already closed.
      setNavOpen((prev) => (prev ? false : prev));
      setSearchOpen((prev) => (prev ? false : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  }

  return (
    <header>
      <div className="nav-shell">
        <div className="logo">
          <Link href="/" className="logo" aria-label="Cara home">
            <Image src="/extra-img/logo.webp" alt="Cara Stores" width={120} height={40} priority />
          </Link>
        </div>
        {/* Desktop search bar */}
        <form className="header-search" onSubmit={handleSearch} role="search">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands, categories…"
            aria-label="Search products"
          />
          <button type="submit" aria-label="Submit search">
            <i className="fas fa-search" aria-hidden />
          </button>
        </form>
        <div className="navigations">
          <nav className={`navbar${navOpen ? ' show' : ''}`} id="navbar" aria-label="Primary">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={isActive(href) ? 'active' : ''} onClick={() => setNavOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="icons">
            {/* Mobile search toggle */}
            <button
              className="icon-btn search-toggle"
              onClick={() => setSearchOpen((v) => !v)}
              type="button"
              aria-label="Toggle search"
              aria-expanded={searchOpen}
            >
              <i className={`fas ${searchOpen ? 'fa-times' : 'fa-search'}`} aria-hidden />
            </button>
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
      {/* Mobile search bar */}
      <form
        className={`mobile-search${searchOpen ? ' mobile-search-open' : ''}`}
        onSubmit={handleSearch}
        role="search"
        aria-hidden={!searchOpen}
      >
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          tabIndex={searchOpen ? 0 : -1}
        />
        <button type="submit" aria-label="Search">
          <i className="fas fa-search" aria-hidden />
        </button>
      </form>
    </header>
  );
}
