import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/sections/Newsletter';
import { getBlogPosts } from '@/services/blogService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Read Cara Studio journal stories on styling, trends, fit tips, and seasonal collections.',
  openGraph: {
    title: 'Cara Studio Journal',
    description: 'Styling insights and behind-the-scenes stories from the Cara team.',
    images: ['/blog-img/b1.webp'],
  },
};

export default function BlogPage() {
  const blogPosts = getBlogPosts();

  return (
    <>
      <section className="blog-banner">
        <div className="banner">
          <div className="content">
            <span className="pill">Editorial</span>
            <h1>Stories from the studio</h1>
            <p>Style notes, trend breakdowns, and practical guides for building your everyday wardrobe.</p>
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
                <Link href="#" className="btn-2">Continue reading</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
