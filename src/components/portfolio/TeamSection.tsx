"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { TeamMember } from "@/types";
import NextImage from "next/image";

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

export const TeamSection: React.FC<TeamSectionProps> = ({ teamMembers }) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Meet Our Team</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          The talented individuals behind CodeStorm Hub
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Profile Image */}
            <div className="aspect-square overflow-hidden">
              <NextImage
                src={member.image}
                alt={`${member.name} - ${member.role}`}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Member Info */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-500 dark:text-blue-400 font-medium">
                  {member.role}
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                {member.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 justify-center">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                {Object.entries(member.social).map(([platform, url]) => {
                  const IconComponent = socialIcons[platform as keyof typeof socialIcons];
                  if (!IconComponent || !url) return null;

                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-colors duration-200"
                    >
                      <IconComponent size={16} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
