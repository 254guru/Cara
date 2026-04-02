import Image from 'next/image';
import Newsletter from '@/components/sections/Newsletter';
import FeaturesSection from '@/components/sections/FeaturesSection';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Cara Stores: a mobile-first fashion brand blending editorial storytelling with practical everyday wear.',
  openGraph: {
    title: 'About Cara Stores',
    description: 'Learn the vision, craft, and culture behind Cara Stores.',
    images: ['/about-img/a6.webp'],
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="about-banner">
        <div className="banner">
          <div className="content">
            <span className="pill">Inside Cara</span>
            <h1>Built by people who live in motion</h1>
            <p>We design with one goal: premium style that feels effortless from morning commute to late-night plans.</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="box-container">
          <div className="box image">
            <Image src="/about-img/a6.webp" alt="About Cara Stores" width={500} height={400} />
          </div>
          <div className="box text">
            <h1>Who we are</h1>
            <p>
              Cara started as a small design collective focused on one challenge: making quality pieces that perform
              on mobile-first lifestyles. We build limited capsules that balance comfort, durability, and elevated cuts.
            </p>
            <p>
              Every release is tested by our in-house team across fit sessions, wash cycles, and real-day wear,
              ensuring each product feels intentional from first try-on to final delivery.
            </p>
            <div className="cta-row">
              <Link href="/shop" className="btn-primary">Shop the latest drop</Link>
              <Link href="/contact" className="btn-secondary">Partner with us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="video">
        <div className="video-desc">
          <div className="section-heading">
            <span className="pill">Behind the scenes</span>
            <h2>From sketch to street</h2>
            <p>Take a quick look at our creative process and how each collection comes to life.</p>
          </div>
        </div>
        <div className="video-play">
          <video src="/about-img/1.mp4" autoPlay loop muted playsInline />
        </div>
      </section>

      <FeaturesSection />
      <Newsletter />
    </>
  );
}
