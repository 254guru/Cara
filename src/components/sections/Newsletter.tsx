'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    alert(`You are on the list, ${email}. Watch your inbox for launch drops.`);
    setEmail('');
  }

  return (
    <section className="newsletter" id="newsletter">
      <div className="content">
        <div className="news">
          <span className="pill">VIP Access</span>
          <h1>Get early access to every collection</h1>
          <p>Join 20,000+ shoppers receiving drop alerts, product stories, and <span>members-only offers.</span></p>
        </div>
        <form className="input" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />
          <button type="submit" className="btn">Join free</button>
        </form>
      </div>
    </section>
  );
}
