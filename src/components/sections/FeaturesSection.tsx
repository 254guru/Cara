import Image from 'next/image';

const features = [
  { img: '/features-img/f1.png', label: '1-click ordering', cls: 'img-1' },
  { img: '/features-img/f2.png', label: 'same-day dispatch', cls: 'img-2' },
  { img: '/features-img/f3.png', label: 'member pricing', cls: 'img-3' },
  { img: '/features-img/f4.png', label: 'weekly drops', cls: 'img-4' },
  { img: '/features-img/f5.png', label: 'reward points', cls: 'img-5' },
  { img: '/features-img/f6.png', label: '24/7 concierge', cls: 'img-6' },
];

export default function FeaturesSection() {
  return (
    <section className="features">
      <div className="section-heading">
        <span className="pill">Why Cara</span>
        <h2>Mobile-first shopping, designed for speed</h2>
        <p>From checkout to support, every touchpoint is optimized for smaller screens without sacrificing depth.</p>
      </div>
      <div className="contents">
        {features.map((f) => (
          <div key={f.cls} className={`image ${f.cls}`}>
            <Image src={f.img} alt={f.label} width={60} height={60} />
            <h6>{f.label}</h6>
          </div>
        ))}
      </div>
    </section>
  );
}
