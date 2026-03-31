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
            <h1>Visit our NYC studio or reach out digitally</h1>
            <h4>Head office</h4>
            <div className="location"><i className="fas fa-map" /><span>54 Prince Street, Manhattan, New York, USA</span></div>
            <div className="location"><i className="fas fa-envelope" /><span>support@carastudio.com</span></div>
            <div className="location"><i className="fas fa-phone" /><span>+1 (212) 555-0184</span></div>
            <div className="location"><i className="fas fa-clock" /><span>Monday to Sunday, 9:00 AM - 8:00 PM</span></div>
          </div>
          <div className="box map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.0361088591!2d-74.30933493197234!3d40.69753995657043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sng!4v1708628091313!5m2!1sen!2sng"
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
                  <p>Phone: +1 (212) 555-0184</p>
                  <p>Email: hello@carastudio.com</p>
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
