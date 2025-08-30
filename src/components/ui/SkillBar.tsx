"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkillBarProps {
  skill: string;
  level: number; // 0-100
  category?: string;
  className?: string;
}

export function SkillBar({ skill, level, category, className }: SkillBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {skill}
          </span>
          {category && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {category}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {level}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

interface SkillsVisualizationProps {
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  className?: string;
}

export function SkillsVisualization({ skills, className }: SkillsVisualizationProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className={cn("space-y-8", className)}>
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {category.replace("-", " ")}
          </h3>
          <div className="space-y-4">
            {categorySkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <SkillBar
                  skill={skill.name}
                  level={skill.level}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
