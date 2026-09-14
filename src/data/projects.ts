export interface Project {
  number: string;
  category: string;
  name: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    number: '01',
    category: 'Machine Learning',
    name: 'PatentLens',
    description:
      'A patent similarity search engine that uses NLP (TF-IDF and cosine similarity) to find the prior art most similar to a given invention description.',
    tags: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    githubUrl: 'https://github.com/SadbhavKattel/PatentLens',
    image: 'https://opengraph.githubassets.com/1/SadbhavKattel/PatentLens',
  },
  {
    number: '02',
    category: 'Full-Stack Web',
    name: 'Akaran',
    description:
      'A full-stack skincare e-commerce site for a Nepali brand, with real product data, NPR currency support, and a custom product-shelf hero.',
    tags: ['React', 'Vite', 'TypeScript'],
  },
  {
    number: '03',
    category: 'Full-Stack Web',
    name: 'Amplixia',
    description:
      'A production-grade marketing and lead-generation site with a hardened lead-capture pipeline: validation, rate limiting, bot protection, email, and database.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'],
    githubUrl: 'https://github.com/SadbhavKattel/amplixia-web',
    image: 'https://opengraph.githubassets.com/1/SadbhavKattel/amplixia-web',
  },
  {
    number: '04',
    category: 'Mobile + Backend',
    name: 'Sortify',
    description:
      'An Android app and home-screen widget that connects to Gmail, filters out routine notifications, and surfaces only truly urgent emails.',
    tags: ['React Native', 'Spring Boot', 'Java'],
    githubUrl: 'https://github.com/SadbhavKattel/sortify',
    image: 'https://opengraph.githubassets.com/1/SadbhavKattel/sortify',
  },
];
