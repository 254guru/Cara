'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

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
          <Link className={pathname === '/' ? 'active' : ''} href="/">home</Link>
          <Link className={pathname.startsWith('/shop') ? 'active' : ''} href="/shop">shop</Link>
          <Link className={pathname === '/blog' ? 'active' : ''} href="/blog">blog</Link>
          <Link className={pathname === '/about' ? 'active' : ''} href="/about">about</Link>
          <Link className={pathname === '/contact' ? 'active' : ''} href="/contact">contact</Link>
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
