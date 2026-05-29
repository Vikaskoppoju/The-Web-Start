export interface PostFrontmatter {
  title: string;
  excerpt: string;
  coverUrl?: string;
  tags?: string[];
  author?: string;
  publishedAt: string;    // ISO date string
  metaTitle?: string;
  metaDesc?: string;
  readingTime?: number;
}
