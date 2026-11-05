export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'code'; code: string; lang?: string; caption?: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'callout'; tone: 'note' | 'caution'; title: string; text: string }
  | { type: 'h3'; text: string };

export type SourceLink = { label: string; href: string };

export type Section = { id: string; title: string; blocks: Block[]; sources?: SourceLink[] };

export type Decision = { title: string; choice: string; alternative: string; why: string };

export type ProjectMeta = {
  slug: string;
  title: string;
  label: string;
  summary: string;
  hardProblem: string;
  kind: 'personal' | 'course-derived' | 'professional';
  role: string;
  stack: string[];
  featured: boolean;
  status: 'maintained' | 'experimental' | 'archived';
  visual: 'state-machine' | 'pipeline' | 'services';
  evidence: { repository?: string; demo?: string; recording?: string; package?: string };
  relatedWriting?: string[];
};

export type Project = ProjectMeta & {
  overview: string;
  sections: Section[];
  decisions: Decision[];
  limitations: string[];
  hasExplainer?: boolean;
};

export type Article = {
  slug: string;
  title: string;
  summary: string;
  published: string;
  updated?: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  relatedProject?: string;
  sections: Section[];
};
