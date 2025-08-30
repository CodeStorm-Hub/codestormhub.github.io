"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skill } from "@/types";

interface SkillsVisualizationProps {
  skills: Skill[];
}

const categoryColors = {
  frontend: "bg-blue-500",
  backend: "bg-green-500",
  database: "bg-purple-500",
  devops: "bg-orange-500",
  mobile: "bg-pink-500",
  tools: "bg-yellow-500",
  design: "bg-red-500",
} as const;

const categoryLabels = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  mobile: "Mobile",
  tools: "Tools",
  design: "Design",
} as const;

export const SkillsVisualization: React.FC<SkillsVisualizationProps> = ({
  skills,
}) => {
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-8">
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`}
            />
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categorySkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {skill.level}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
