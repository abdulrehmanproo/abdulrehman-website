export interface Project {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  tags: string[];
  features: string[];
  metrics?: { label: string; value: string }[];
  accentColor: 'cyan' | 'purple';
  icon: string;
  demoUrl?: string;
  repoUrl?: string;
  highlights?: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'languages' | 'tools';
  icon: string;
  color: 'cyan' | 'purple';
  description: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  year: string;
  credentialId: string;
  status: string;
  description: string;
  skillsAcquired: string[];
  imageUrl?: string;
}

export interface MessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
