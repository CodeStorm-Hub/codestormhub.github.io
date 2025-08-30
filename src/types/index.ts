export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: ProjectCategory;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  completedAt: string;
  status: "completed" | "in-progress" | "planning";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  skills: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  pricing?: {
    basic?: number;
    premium?: number;
    enterprise?: number;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-100
  category: SkillCategory;
  icon?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
}

export type ProjectCategory = 
  | "web-development"
  | "mobile-app"
  | "desktop-app"
  | "api-backend"
  | "ui-ux-design"
  | "devops"
  | "data-science"
  | "blockchain"
  | "ai-ml"
  | "open-source";

export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "mobile"
  | "design"
  | "tools"
  | "soft-skills";

export type Theme = "light" | "dark";

export interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileSystemItem[];
  content?: string;
  language?: string;
  icon?: string;
}

export interface Tab {
  id: string;
  title: string;
  path: string;
  content?: React.ReactNode;
  isActive: boolean;
  isDirty?: boolean;
  isUnsaved?: boolean;
  language?: string;
}

export interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  type: "info" | "error" | "success" | "warning";
}

export interface Animation {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
}
