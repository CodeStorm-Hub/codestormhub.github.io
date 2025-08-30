"use client";

import { motion } from "framer-motion";
import { Code2, Smartphone, Server, Palette, Cloud, Database } from "lucide-react";
import { Service } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ServicesShowcaseProps {
  services: Service[];
  className?: string;
}

const iconMap = {
  "code2": Code2,
  "smartphone": Smartphone,
  "server": Server,
  "palette": Palette,
  "cloud": Cloud,
  "database": Database,
};

export function ServicesShowcase({ services, className }: ServicesShowcaseProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="text-center space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-white"
        >
          Our Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          We provide comprehensive development solutions tailored to your business needs
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Code2;
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/20 dark:to-purple-900/20" />
              
              <div className="relative space-y-4">
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900 dark:text-blue-400">
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                      +{service.features.length - 3} more features
                    </li>
                  )}
                </ul>

                {/* Pricing */}
                {service.pricing && (
                  <div className="space-y-2 border-t pt-4 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Starting from:
                    </p>
                    <div className="flex items-center space-x-2">
                      {service.pricing.basic && (
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ${service.pricing.basic}
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        per project
                      </span>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  size="sm"
                  className="w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  onClick={() => {
                    // Scroll to contact section
                    document.getElementById('contact')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
