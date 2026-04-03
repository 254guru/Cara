import Link from 'next/link';
import { CATEGORY_GROUPS } from '@/lib/deals';

export default function CategoryStrip() {
  return (
    <section className="cat-section">
      <div className="cat-strip">
        <Link href="/shop" className="cat-chip cat-chip-all">
          <span className="cat-icon"><i className="fas fa-th-large" /></span>
          <span>All</span>
        </Link>
        {CATEGORY_GROUPS.map((cat) => (
          <Link key={cat.slug} href={`/shop?cat=${cat.slug}`} className="cat-chip">
            <span className="cat-icon"><i className={`fas ${cat.icon}`} /></span>
            <span>{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
