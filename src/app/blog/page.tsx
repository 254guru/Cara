import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import { blogPosts } from '@/data/blogPosts';

export const metadata = {
  title: 'Cara Store - Blog',
  description: 'Read all case studies about our products',
};

export default function BlogPage() {
  return (
    <>
      <section className="blog-banner">
        <div className="banner">
          <div className="content">
            <h1>#readmore</h1>
            <p>read all case studies about our products!</p>
          </div>
        </div>
      </section>

      <section className="blog" id="blog">
        <div className="box-container">
          {blogPosts.map((post) => (
            <div className="box-wrapper" key={post.id}>
              <div className="box image">
                <h3>{post.date}</h3>
                <Image src={post.image} alt={post.title} width={300} height={200} />
              </div>
              <div className="box blog">
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <Link href="#" className="btn-2">continue reading</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
