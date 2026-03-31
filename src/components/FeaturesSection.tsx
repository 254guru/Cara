import Image from 'next/image';

const features = [
  { img: '/features-img/f1.png', label: 'online order',  cls: 'img-1' },
  { img: '/features-img/f2.png', label: 'fast delivery', cls: 'img-2' },
  { img: '/features-img/f3.png', label: 'save money',    cls: 'img-3' },
  { img: '/features-img/f4.png', label: 'promotions',    cls: 'img-4' },
  { img: '/features-img/f5.png', label: 'happy sales',   cls: 'img-5' },
  { img: '/features-img/f6.png', label: '24/7 support',  cls: 'img-6' },
];

export default function FeaturesSection() {
  return (
    <section className="features">
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
