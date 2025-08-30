"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Filter } from "lucide-react";
import { Project, ProjectCategory } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface ProjectShowcaseProps {
  projects: Project[];
  className?: string;
}

const categoryLabels: Record<ProjectCategory, string> = {
  "web-development": "Web Development",
  "mobile-app": "Mobile Apps",
  "desktop-app": "Desktop Apps",
  "api-backend": "Backend APIs",
  "ui-ux-design": "UI/UX Design",
  "devops": "DevOps",
  "data-science": "Data Science",
  "blockchain": "Blockchain",
  "ai-ml": "AI/ML",
  "open-source": "Open Source",
};

export function ProjectShowcase({ projects, className }: ProjectShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = Array.from(new Set(projects.map(p => p.category)));
  
  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className="text-xs"
        >
          <Filter className="mr-1 h-3 w-3" />
          All Projects ({projects.length})
        </Button>
        {categories.map((category) => {
          const count = projects.filter(p => p.category === category).length;
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {categoryLabels[category]} ({count})
            </Button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
              onClick={() => handleProjectClick(project)}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <NextImage
                  src={project.image}
                  alt={`${project.title} - ${project.description}`}
                  width={400}
                  height={225}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Status Badge */}
                <div className={cn(
                  "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium",
                  project.status === "completed" && "bg-green-500 text-white",
                  project.status === "in-progress" && "bg-yellow-500 text-black",
                  project.status === "planning" && "bg-blue-500 text-white"
                )}>
                  {project.status.replace("-", " ")}
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {project.liveUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.liveUrl, "_blank");
                      }}
                      className="flex-1"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Live
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.githubUrl, "_blank");
                      }}
                      className="flex-1"
                    >
                      <Github className="mr-1 h-3 w-3" />
                      Code
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Project Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedProject?.title}
        size="lg"
      >
        {selectedProject && (
          <div className="space-y-4">
            <NextImage
              src={selectedProject.image}
              alt={`${selectedProject.title} - Detailed view`}
              width={600}
              height={300}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                {selectedProject.longDescription || selectedProject.description}
              </p>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                {selectedProject.liveUrl && (
                  <Button
                    onClick={() => window.open(selectedProject.liveUrl, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Project
                  </Button>
                )}
                {selectedProject.githubUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedProject.githubUrl, "_blank")}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Source Code
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
