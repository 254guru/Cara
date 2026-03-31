'use client';

import Image from 'next/image';
import { useState } from 'react';
import Newsletter from '@/components/sections/Newsletter';

const managers = [
  { img: '/people-img/1.png', name: 'Jordan Ellis', role: 'Client success lead' },
  { img: '/people-img/2.png', name: 'Amara King', role: 'Partnership manager' },
  { img: '/people-img/3.png', name: 'Noah Cruz', role: 'Store experience specialist' },
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert('Message received. A Cara specialist will respond shortly.');
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <>
      <section className="contact-banner">
        <div className="banner">
          <div className="content">
            <span className="pill">Contact</span>
            <h1>Let&apos;s build your best shopping experience</h1>
            <p>Need support, order help, or a partnership? Our team is ready to help.</p>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="box-container">
          <div className="box text">
            <h3>Get in touch</h3>
            <h1>Visit our Nairobi studio or reach out digitally</h1>
            <h4>Head office</h4>
            <div className="location"><i className="fas fa-map" /><span>Westlands, Nairobi, Kenya</span></div>
            <div className="location"><i className="fas fa-envelope" /><span>support@carastudio.co.ke</span></div>
            <div className="location"><i className="fas fa-phone" /><span>+254 712 345 678</span></div>
            <div className="location"><i className="fas fa-clock" /><span>Monday to Sunday, 9:00 AM - 8:00 PM</span></div>
          </div>
          <div className="box map">
            <iframe
              src="https://www.google.com/maps?q=Nairobi%2C%20Kenya&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office location map"
            />
          </div>
        </div>
      </section>

      <section className="form">
        <div className="box-container">
          <div className="box form">
            <h3>Leave a message</h3>
            <h1>Tell us how we can help</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
              <textarea name="message" placeholder="Your message" value={form.message} onChange={handleChange} required />
              <input type="submit" value="Send message" className="btn" />
            </form>
          </div>
          <div className="box CEO">
            {managers.map((person, i) => (
              <div className="managers" key={i}>
                <div className="image">
                  <Image src={person.img} alt={person.name} width={80} height={80} />
                </div>
                <div className="text">
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                  <p>Phone: +254 712 345 678</p>
                  <p>Email: hello@carastudio.co.ke</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
