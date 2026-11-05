export const profile = {
  name: 'Lê Đức Anh',
  latinName: 'Duc Anh Le',
  pronunciation: '/duːk æŋ lɛ/',
  role: 'Software Engineer',
  location: 'Kokkola, Finland',
  company: 'Vitec ALMA Oy',
  tagline: 'Thoughtful interfaces. Reliable systems.',
  avatar: 'https://avatars.githubusercontent.com/u/20279679?v=4',
  links: {
    github: 'https://github.com/DucAnhLe1992',
    linkedin: 'https://linkedin.com/in/ducanhle92',
  },
  email: null as string | null,
  cvUrl: null as string | null,
  siteUrl: null as string | null,
};

export const experience: { role: string; org: string; period: string; location: string; note?: string }[] = [
  {
    role: profile.role,
    org: profile.company,
    period: 'Current',
    location: profile.location,
  },
];

export const skills = [
  {
    area: 'Interfaces',
    items: ['React', 'TypeScript', 'Next.js', 'Redux', 'Vite', 'Tailwind CSS', 'MUI'],
    evidence: 'Code Notebook client, Car Rental frontend, Ticket Booking client',
  },
  {
    area: 'Services',
    items: ['Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM', 'MongoDB', 'Stripe'],
    evidence: 'Car Rental API, Ticket Booking services',
  },
  {
    area: 'Systems & delivery',
    items: ['Docker', 'Kubernetes', 'NATS Streaming', 'Skaffold', 'GitHub Actions', 'Lerna'],
    evidence: 'Ticket Booking infrastructure, Code Notebook monorepo',
  },
];

export const learning = [
  {
    title: 'Full Stack Open',
    org: 'University of Helsinki',
    note: 'Coursework across React, Node.js, testing, containers, CI/CD and React Native.',
    repo: 'https://github.com/DucAnhLe1992/FullStackOpen-LeDucAnh',
  },
  {
    title: 'Full-stack programme (FS10)',
    org: 'Integrify',
    note: 'Front-end and full-stack projects built with TypeScript.',
    repo: 'https://github.com/DucAnhLe1992/Integrify-FS10-FullStackProject',
  },
  {
    title: 'Independent study',
    org: 'Self-directed',
    note: 'Distributed systems, developer tooling, and currently exploring applied AI.',
  },
];
