export const profile = {
  name: 'Lê Đức Anh',
  latinName: 'Duc Anh Le',
  pronunciation: '/duːk æŋ lɛ/',
  role: 'Software Engineer',
  jobTitle: 'Software Developer',
  location: 'Kokkola, Finland',
  company: 'Vitec ALMA Oy',
  tagline: 'Thoughtful interfaces. Reliable systems.',
  avatar: 'https://avatars.githubusercontent.com/u/20279679?v=4',
  links: {
    github: 'https://github.com/DucAnhLe1992',
    linkedin: 'https://linkedin.com/in/ducanhle92',
  },
  email: 'gerald.duc.anh.le@gmail.com' as string | null,
  cvUrl: null as string | null,
  siteUrl: null as string | null,
};

export type Experience = {
  role: string;
  org: string;
  period: string;
  location: string;
  points: string[];
  current?: boolean;
};

export const experience: Experience[] = [
  {
    role: profile.jobTitle,
    org: profile.company,
    period: 'Dec 2022 – Present',
    location: 'Kokkola, Finland',
    current: true,
    points: [
      'Own end-to-end delivery of complex enterprise frontend features: multi-step wizards and data-heavy schedulers (Gantt, Kanban) in React and TypeScript, including state management and performance work.',
      'Implement JDBC queries and GraphQL data fetchers in the existing Java 21 / Undertow backend to support new UI data requirements.',
      'Add Vitest suites for frontend components and maintain Docker and GitHub Actions workflows for the platform’s CI/CD.',
      'Use AI coding assistants for planning, test generation and refactoring, reviewing and testing every change before merging.',
    ],
  },
  {
    role: 'Full Stack Development Trainee',
    org: 'Integrify Oy',
    period: 'Apr 2022 – Aug 2022',
    location: 'Helsinki, Finland',
    points: [
      'Built team-based full-stack applications with React, TypeScript and Node.js/Express.',
      'Practised API development, testing, Git, code review and Docker in an agile international team.',
    ],
  },
  {
    role: 'Software Development Trainee',
    org: 'Devatus Oy (Gofore group)',
    period: 'Jun 2021 – Sep 2021',
    location: 'Vaasa, Finland',
    points: [
      'Developed cross-platform mobile features with TypeScript, Angular and Ionic for energy-sector customers.',
      'Worked with designers and backend engineers on customer-specific functionality focused on usability and performance.',
    ],
  },
];

export const education = [
  {
    title: 'Master of Science in Artificial Intelligence',
    org: 'University of Lübeck (online)',
    period: 'Oct 2025 – Present',
    status: 'In progress',
    note: 'Coursework in machine learning, natural language processing, deep learning and intelligent agents.',
  },
  {
    title: 'Bachelor of Engineering, Information Technology',
    org: 'Vaasan ammattikorkeakoulu (VAMK)',
    period: 'Sep 2017 – Jun 2023',
    note: 'Major in software engineering. Coursework included embedded systems, telecommunications and advanced mathematics.',
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
    title: 'Integrify FS10 coursework',
    org: 'Integrify',
    note: 'Front-end and full-stack projects from the traineeship, built with TypeScript.',
    repo: 'https://github.com/DucAnhLe1992/Integrify-FS10-FullStackProject',
  },
];

export const skills = [
  {
    area: 'Frontend',
    items: ['TypeScript', 'JavaScript', 'React', 'SPA architecture', 'Zustand', 'Redux', 'Material UI'],
    evidence: 'Enterprise schedulers and wizards at Vitec ALMA; Car Rental and Code Notebook clients',
  },
  {
    area: 'Backend & APIs',
    items: ['Java 21', 'Undertow', 'JDBC', 'GraphQL', 'REST', 'MariaDB'],
    evidence: 'GraphQL data fetchers and JDBC queries at Vitec ALMA',
  },
  {
    area: 'Project backends & data',
    items: ['Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM', 'MongoDB', 'Redis'],
    evidence: 'Car Rental API, Ticket Booking services',
  },
  {
    area: 'Testing & delivery',
    items: ['Vitest', 'Git', 'GitHub Actions', 'Docker', 'Kubernetes', 'Skaffold', 'AWS fundamentals'],
    evidence: 'Test suites and CI/CD at Vitec ALMA; Kubernetes in the Ticket Booking project',
  },
];
