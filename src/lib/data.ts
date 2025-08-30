import { Project, Service, Skill, TeamMember, Testimonial, FileSystemItem } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    title: "CodeStorm Portfolio",
    description: "Interactive VS Code-themed portfolio website built with Next.js and TypeScript",
    longDescription: "A modern, interactive portfolio website that mimics the Visual Studio Code IDE interface. Features include syntax highlighting, interactive file explorer, terminal emulation, and responsive design. Built using Next.js 15, TypeScript, Tailwind CSS, and Framer Motion for smooth animations.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React", "VS Code Theme"],
    category: "web-development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=entropy&auto=format",
    liveUrl: "https://codestormhub.github.io",
    githubUrl: "https://github.com/CodeStorm-Hub/codestormhub.github.io",
    featured: true,
    completedAt: "2025-01-01",
    status: "completed"
  },
  {
    id: "2",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with payment integration and admin dashboard",
    longDescription: "A comprehensive e-commerce platform featuring user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and an admin dashboard. Built with a modern tech stack focusing on performance and user experience.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT", "Redux"],
    category: "web-development",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=entropy&auto=format",
    liveUrl: "https://demo-ecommerce.codestormhub.dev",
    githubUrl: "https://github.com/CodeStorm-Hub/ecommerce-platform",
    featured: true,
    completedAt: "2024-12-15",
    status: "completed"
  },
  {
    id: "3",
    title: "Task Management App",
    description: "Collaborative task management application with real-time updates",
    longDescription: "A powerful task management application that enables teams to collaborate effectively with real-time updates, drag-and-drop functionality, file attachments, and customizable workflows. Features include project organization, team member assignments, and progress tracking.",
    technologies: ["React", "Socket.io", "Node.js", "PostgreSQL", "Redis", "AWS S3"],
    category: "web-development",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&crop=entropy&auto=format",
    liveUrl: "https://tasks.codestormhub.dev",
    githubUrl: "https://github.com/CodeStorm-Hub/task-manager",
    featured: false,
    completedAt: "2024-11-20",
    status: "completed"
  },
  {
    id: "4",
    title: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication",
    longDescription: "A secure and user-friendly mobile banking application featuring biometric authentication, real-time transaction monitoring, budget tracking, bill payments, and fund transfers. Built with React Native for cross-platform compatibility.",
    technologies: ["React Native", "TypeScript", "Firebase", "Biometric Auth", "Redux Toolkit"],
    category: "mobile-app",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop&crop=entropy&auto=format",
    githubUrl: "https://github.com/CodeStorm-Hub/mobile-banking",
    featured: true,
    completedAt: "2024-10-30",
    status: "completed"
  },
  {
    id: "5",
    title: "API Gateway Service",
    description: "Microservices API gateway with authentication and rate limiting",
    longDescription: "A robust API gateway service that handles authentication, authorization, rate limiting, request routing, and monitoring for microservices architecture. Includes comprehensive logging and analytics dashboard.",
    technologies: ["Node.js", "Express", "Docker", "Redis", "MongoDB", "JWT", "Prometheus"],
    category: "api-backend",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&crop=entropy&auto=format",
    githubUrl: "https://github.com/CodeStorm-Hub/api-gateway",
    featured: false,
    completedAt: "2024-09-15",
    status: "completed"
  },
  {
    id: "6",
    title: "AI Content Generator",
    description: "AI-powered content generation tool with multiple output formats",
    longDescription: "An intelligent content generation platform that leverages AI to create blog posts, social media content, marketing copy, and technical documentation. Features custom templates, SEO optimization, and multi-language support.",
    technologies: ["Python", "FastAPI", "OpenAI API", "PostgreSQL", "React", "Docker"],
    category: "ai-ml",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=entropy&auto=format",
    liveUrl: "https://ai-content.codestormhub.dev",
    githubUrl: "https://github.com/CodeStorm-Hub/ai-content-generator",
    featured: true,
    completedAt: "2024-08-20",
    status: "in-progress"
  }
];

export const services: Service[] = [
  {
    id: "1",
    title: "Web Development",
    description: "Full-stack web applications using modern frameworks and technologies",
    icon: "code2",
    features: [
      "Custom web application development",
      "Responsive design implementation",
      "API development and integration",
      "Database design and optimization",
      "Performance optimization",
      "SEO implementation"
    ],
    pricing: {
      basic: 2500,
      premium: 7500,
      enterprise: 15000
    }
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Cross-platform mobile applications for iOS and Android",
    icon: "smartphone",
    features: [
      "React Native development",
      "Native iOS and Android apps",
      "Cross-platform compatibility",
      "App Store deployment",
      "Push notifications",
      "Offline functionality"
    ],
    pricing: {
      basic: 5000,
      premium: 12000,
      enterprise: 25000
    }
  },
  {
    id: "3",
    title: "Backend Development",
    description: "Scalable backend systems and API development",
    icon: "server",
    features: [
      "RESTful API development",
      "GraphQL implementation",
      "Database architecture",
      "Authentication systems",
      "Microservices architecture",
      "Performance monitoring"
    ],
    pricing: {
      basic: 3000,
      premium: 8000,
      enterprise: 18000
    }
  },
  {
    id: "4",
    title: "UI/UX Design",
    description: "User-centered design solutions for web and mobile applications",
    icon: "palette",
    features: [
      "User research and analysis",
      "Wireframing and prototyping",
      "Visual design systems",
      "Usability testing",
      "Responsive design",
      "Brand identity design"
    ],
    pricing: {
      basic: 1500,
      premium: 4000,
      enterprise: 10000
    }
  },
  {
    id: "5",
    title: "Cloud Solutions",
    description: "Cloud infrastructure setup and management services",
    icon: "cloud",
    features: [
      "AWS/Azure cloud setup",
      "Serverless architecture",
      "Container orchestration",
      "CI/CD pipeline setup",
      "Monitoring and logging",
      "Security implementation"
    ],
    pricing: {
      basic: 2000,
      premium: 6000,
      enterprise: 15000
    }
  },
  {
    id: "6",
    title: "Database Solutions",
    description: "Database design, optimization, and management services",
    icon: "database",
    features: [
      "Database design and modeling",
      "Query optimization",
      "Data migration services",
      "Backup and recovery",
      "Performance tuning",
      "NoSQL and SQL expertise"
    ],
    pricing: {
      basic: 1800,
      premium: 5000,
      enterprise: 12000
    }
  }
];

export const skills: Skill[] = [
  // Frontend
  { id: "1", name: "React", level: 95, category: "frontend", icon: "⚛️" },
  { id: "2", name: "Next.js", level: 90, category: "frontend", icon: "▲" },
  { id: "3", name: "TypeScript", level: 88, category: "frontend", icon: "🔷" },
  { id: "4", name: "JavaScript", level: 95, category: "frontend", icon: "🟨" },
  { id: "5", name: "HTML/CSS", level: 92, category: "frontend", icon: "🌐" },
  { id: "6", name: "Tailwind CSS", level: 85, category: "frontend", icon: "💨" },
  { id: "7", name: "Vue.js", level: 75, category: "frontend", icon: "💚" },

  // Backend
  { id: "8", name: "Node.js", level: 90, category: "backend", icon: "🟢" },
  { id: "9", name: "Express.js", level: 88, category: "backend", icon: "🚂" },
  { id: "10", name: "Python", level: 85, category: "backend", icon: "🐍" },
  { id: "11", name: "FastAPI", level: 80, category: "backend", icon: "⚡" },
  { id: "12", name: "GraphQL", level: 78, category: "backend", icon: "📊" },

  // Database
  { id: "13", name: "PostgreSQL", level: 85, category: "database", icon: "🐘" },
  { id: "14", name: "MongoDB", level: 82, category: "database", icon: "🍃" },
  { id: "15", name: "Redis", level: 75, category: "database", icon: "🔴" },
  { id: "16", name: "MySQL", level: 80, category: "database", icon: "🐬" },

  // DevOps
  { id: "17", name: "Docker", level: 83, category: "devops", icon: "🐳" },
  { id: "18", name: "AWS", level: 78, category: "devops", icon: "☁️" },
  { id: "19", name: "GitHub Actions", level: 85, category: "devops", icon: "⚙️" },
  { id: "20", name: "Vercel", level: 90, category: "devops", icon: "▲" },

  // Mobile
  { id: "21", name: "React Native", level: 80, category: "mobile", icon: "📱" },
  { id: "22", name: "Expo", level: 75, category: "mobile", icon: "🚀" },

  // Tools
  { id: "23", name: "Git", level: 90, category: "tools", icon: "🌿" },
  { id: "24", name: "VS Code", level: 95, category: "tools", icon: "💻" },
  { id: "25", name: "Figma", level: 70, category: "design", icon: "🎨" },
];

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Storm",
    role: "Lead Full-Stack Developer",
    bio: "Passionate full-stack developer with 8+ years of experience in React, Node.js, and cloud technologies. Loves building scalable applications and mentoring junior developers.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&auto=format",
    skills: ["React", "Node.js", "AWS", "TypeScript", "PostgreSQL"],
    social: {
      github: "https://github.com/alexstorm",
      linkedin: "https://linkedin.com/in/alexstorm",
      twitter: "https://twitter.com/alexstorm",
      email: "alex@codestormhub.dev"
    }
  },
  {
    id: "2",
    name: "Sarah Code",
    role: "Frontend Specialist",
    bio: "Creative frontend developer specializing in React, Next.js, and modern CSS frameworks. Focused on creating beautiful, accessible, and performant user interfaces.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=300&h=300&fit=crop&crop=face&auto=format",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Figma"],
    social: {
      github: "https://github.com/sarahcode",
      linkedin: "https://linkedin.com/in/sarahcode",
      email: "sarah@codestormhub.dev"
    }
  },
  {
    id: "3",
    name: "Mike Backend",
    role: "Backend Engineer",
    bio: "Backend specialist with expertise in API design, database optimization, and microservices architecture. Passionate about building robust and scalable systems.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&auto=format",
    skills: ["Node.js", "Python", "PostgreSQL", "Docker", "Kubernetes"],
    social: {
      github: "https://github.com/mikebackend",
      linkedin: "https://linkedin.com/in/mikebackend",
      email: "mike@codestormhub.dev"
    }
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "John Smith",
    role: "CTO",
    company: "TechStart Inc.",
    content: "CodeStorm Hub delivered an exceptional web application that exceeded our expectations. Their attention to detail and technical expertise is outstanding.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face&auto=format",
    rating: 5
  },
  {
    id: "2",
    name: "Emily Johnson",
    role: "Product Manager",
    company: "Digital Solutions",
    content: "Working with CodeStorm Hub was a pleasure. They understood our requirements perfectly and delivered a high-quality mobile app on time and within budget.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face&auto=format",
    rating: 5
  },
  {
    id: "3",
    name: "David Lee",
    role: "Founder",
    company: "StartupXYZ",
    content: "The team at CodeStorm Hub is incredibly talented. They built our entire platform from scratch and provided excellent ongoing support.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face&auto=format",
    rating: 5
  }
];

export const fileSystemData: FileSystemItem[] = [
  {
    id: "1",
    name: "portfolio",
    type: "folder",
    path: "/portfolio",
    children: [
      {
        id: "2",
        name: "about.tsx",
        type: "file",
        path: "/portfolio/about.tsx",
        language: "typescript",
        content: `import { motion } from "framer-motion";
import { useTypingEffect } from "@/hooks/useTypingEffect";

export default function About() {
  const { text } = useTypingEffect([
    "Full-Stack Developer",
    "React Specialist",
    "TypeScript Enthusiast",
    "UI/UX Designer"
  ]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold">
          Hello, I'm <span className="text-blue-500">CodeStorm</span>
        </h1>
        <h2 className="text-xl text-gray-600">
          {text}<span className="animate-pulse">|</span>
        </h2>
      </motion.div>

      <div className="prose dark:prose-invert max-w-none">
        <p>
          Welcome to CodeStorm Hub! We are a passionate team of developers 
          dedicated to creating exceptional web experiences using cutting-edge 
          technologies.
        </p>
        
        <p>
          Our expertise spans across modern web frameworks like React and Next.js, 
          backend technologies including Node.js and Python, and cloud platforms 
          such as AWS and Vercel.
        </p>

        <h3>What We Do</h3>
        <ul>
          <li>Full-stack web application development</li>
          <li>Mobile app development with React Native</li>
          <li>UI/UX design and prototyping</li>
          <li>API development and integration</li>
          <li>Cloud deployment and DevOps</li>
        </ul>
      </div>
    </div>
  );
}`
      },
      {
        id: "3",
        name: "projects.tsx",
        type: "file",
        path: "/portfolio/projects.tsx",
        language: "typescript",
        content: `import { ProjectShowcase } from "@/components/portfolio/ProjectShowcase";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Our Projects</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Showcasing our latest work and achievements
        </p>
      </div>

      <ProjectShowcase projects={projects} />
    </div>
  );
}`
      },
      {
        id: "4",
        name: "services.tsx",
        type: "file",
        path: "/portfolio/services.tsx",
        language: "typescript",
        content: `import { ServicesShowcase } from "@/components/portfolio/ServicesShowcase";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <div className="space-y-8">
      <ServicesShowcase services={services} />
    </div>
  );
}`
      },
      {
        id: "5",
        name: "contact.tsx",
        type: "file",
        path: "/portfolio/contact.tsx",
        language: "typescript",
        content: `import { ContactFormComponent } from "@/components/portfolio/ContactForm";
import { ContactForm } from "@/types";

export default function Contact() {
  const handleSubmit = async (data: ContactForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Contact form submitted:", data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Get In Touch</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Ready to start your next project? Let's talk!
        </p>
      </div>

      <ContactFormComponent onSubmit={handleSubmit} />
      
      <div className="text-center space-y-4 pt-8 border-t">
        <h3 className="text-lg font-semibold">Other Ways to Reach Us</h3>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div>
            <strong>Email:</strong><br />
            hello@codestormhub.dev
          </div>
          <div>
            <strong>Phone:</strong><br />
            +1 (555) 123-4567
          </div>
          <div>
            <strong>Location:</strong><br />
            San Francisco, CA
          </div>
        </div>
      </div>
    </div>
  );
}`
      },
      {
        id: "6",
        name: "skills.tsx",
        type: "file",
        path: "/portfolio/skills.tsx",
        language: "typescript",
        content: `import { SkillsVisualization } from "@/components/ui/SkillBar";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Technical Skills</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Our expertise across different technologies
        </p>
      </div>

      <SkillsVisualization skills={skills} />
    </div>
  );
}`
      }
    ]
  },
  {
    id: "7",
    name: "package.json",
    type: "file",
    path: "/package.json",
    language: "json",
    content: `{
  "name": "codestormhub",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx"
  },
  "dependencies": {
    "next": "15.5.2",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-icons": "^5.5.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}`
  },
  {
    id: "8",
    name: "README.md",
    type: "file",
    path: "/README.md",
    language: "markdown",
    content: `# CodeStorm Hub Portfolio

A modern, interactive VS Code-themed portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🎨 VS Code-inspired design with authentic IDE interface
- 📱 Fully responsive design for all devices
- ⚡ Next.js 15 with React 19 and TypeScript
- 🎭 Smooth animations with Framer Motion
- 🌙 Dark/Light theme support
- 🔍 Interactive file explorer and terminal
- 📊 Skills visualization with animated progress bars
- 📝 Contact form with validation
- 🚀 Optimized for performance and SEO

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React & React Icons
- **Deployment:** GitHub Pages

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Project Structure

\`\`\`
src/
├── app/          # Next.js app directory
├── components/   # React components
│   ├── ide/     # IDE-specific components
│   ├── ui/      # Reusable UI components
│   └── portfolio/ # Portfolio sections
├── hooks/        # Custom React hooks
├── lib/          # Utilities and data
├── types/        # TypeScript definitions
└── context/      # React contexts
\`\`\`

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

## License

MIT License - see LICENSE file for details.
`
  }
];
