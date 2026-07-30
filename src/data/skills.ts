export interface Skill {
  number: string;
  name: string;
  description: string;
}

export const skills: Skill[] = [
  {
    number: '01',
    name: 'Full-Stack Development',
    description:
      'Building end-to-end web applications with React, Next.js, TypeScript, and backend frameworks like Spring Boot.',
  },
  {
    number: '02',
    name: 'Machine Learning',
    description:
      'Applying NLP and classical ML with scikit-learn, pandas, and NumPy to real problems like patent search and sonar classification.',
  },
  {
    number: '03',
    name: 'Data Analysis',
    description:
      'Processing and visualizing data with Python, pandas, and Jupyter to surface insights and drive decisions.',
  },
];
