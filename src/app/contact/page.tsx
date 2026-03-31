import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Connect with Cara Studio for support, partnerships, wholesale inquiries, and customer care.',
  openGraph: {
    title: 'Contact Cara Studio',
    description: 'Reach out to the Cara team and we will respond within one business day.',
    images: ['/about-img/banner.png'],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
