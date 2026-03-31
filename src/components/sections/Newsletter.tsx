'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  }

  return (
    <section className="newsletter" id="newsletter">
      <div className="content">
        <div className="news">
          <h1>sign up for newsletters</h1>
          <p>get e-mail updates about our latest shop and <span>special offers.</span></p>
        </div>
        <form className="input" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn">sign up</button>
        </form>
      </div>
    </section>
  );
}
