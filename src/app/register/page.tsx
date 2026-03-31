'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        password: form.password,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    const result = await signIn('credentials', {
      redirect: false,
      email: form.email || form.phone,
      password: form.password,
    });

    setLoading(false);

    if (result?.error) {
      setError('Account created but auto sign-in failed. Please sign in manually.');
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
            <span className="pill">Join Cara</span>
            <h1>Create your account</h1>
            <p>Sign up to save your cart, track orders, and unlock personalized styling.</p>
          </div>
        </div>
      </section>

      <section className="auth-form">
        <div className="form-container">
          <h2>Create account</h2>
          {error && <p className="form-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              autoComplete="name"
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />
            <input
              type="tel"
              placeholder="Phone (e.g. 0712345678)"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              autoComplete="tel"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={form.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
              required
              autoComplete="new-password"
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="form-footer">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </>
  );
}
