import { blogPosts } from '@/data/blogPosts';
import { BlogPost } from '@/types';

export function getBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostById(id: number): BlogPost | undefined {
  return blogPosts.find((p) => p.id === id);
}
