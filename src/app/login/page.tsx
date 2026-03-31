'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <>
      <section className="auth-banner">
        <div className="banner">
          <div className="content">
            <span className="pill">Account</span>
            <h1>Welcome back</h1>
            <p>Sign in to access your cart, orders, and personalized recommendations.</p>
          </div>
        </div>
      </section>

      <section className="auth-form">
        <div className="form-container">
          <h2>Sign in</h2>
          {error && <p className="form-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email or phone number"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="form-footer">
            Don&apos;t have an account? <Link href="/register">Create one</Link>
          </p>
        </div>
      </section>
    </>
  );
}
