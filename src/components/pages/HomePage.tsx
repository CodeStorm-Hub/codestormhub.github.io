"use client";

import { motion } from "framer-motion";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { ProjectShowcase } from "@/components/portfolio/ProjectShowcase";
import { ServicesShowcase } from "@/components/portfolio/ServicesShowcase";
import { SkillsVisualization } from "@/components/ui/SkillsVisualization";
import { TeamSection } from "@/components/portfolio/TeamSection";
import { TestimonialsSection } from "@/components/portfolio/TestimonialsSection";
import { ContactFormComponent } from "@/components/portfolio/ContactForm";
import { projects, services, skills, teamMembers, testimonials } from "@/lib/data";
import { ContactForm } from "@/types";

export default function HomePage() {
  const { text } = useTypingEffect([
    "Full-Stack Developers",
    "React Specialists", 
    "TypeScript Experts",
    "UI/UX Designers",
    "Cloud Engineers"
  ], { 
    loop: true,
    speed: 100,
    deleteSpeed: 50,
    delayBetweenWords: 3000
  });

  const handleContactSubmit = async (data: ContactForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Contact form submitted:", data);
    // In a real app, you would send this to your API
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              We Are{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                CodeStorm
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300">
              <span className="text-blue-500">{text}</span>
              <span className="animate-pulse text-blue-500">|</span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Building exceptional digital experiences with cutting-edge technologies. 
              From concept to deployment, we craft solutions that drive innovation and growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              View Our Work
            </motion.a>
            
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-colors"
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold">About CodeStorm Hub</h2>
          <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
            <p>
              We are a passionate team of developers, designers, and innovators dedicated to 
              transforming ideas into powerful digital solutions. With expertise spanning 
              modern web frameworks, mobile development, and cloud technologies, we deliver 
              exceptional results that exceed expectations.
            </p>
            <p>
              Our mission is to help businesses thrive in the digital age by providing 
              cutting-edge solutions that are not only technically excellent but also 
              user-friendly and scalable.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold">Our Services</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Comprehensive solutions for all your digital needs
          </p>
        </motion.div>
        <ServicesShowcase services={services} />
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold">Featured Projects</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Showcasing our latest work and achievements
          </p>
        </motion.div>
        <ProjectShowcase projects={projects} />
      </section>

      {/* Skills Section */}
      <section id="skills" className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold">Technical Expertise</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Our skills across different technologies and platforms
          </p>
        </motion.div>
        <SkillsVisualization skills={skills} />
      </section>

      {/* Team Section */}
      <section id="team" className="container mx-auto px-4">
        <TeamSection teamMembers={teamMembers} />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4">
        <TestimonialsSection testimonials={testimonials} />
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold">Let&apos;s Work Together</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ready to bring your ideas to life? Get in touch with us today!
            </p>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div className="space-y-8">
              <ContactFormComponent onSubmit={handleContactSubmit} />
            </div>
            
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">📧</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-gray-600 dark:text-gray-300">hello@codestormhub.dev</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">📱</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">📍</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-gray-600 dark:text-gray-300">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2">Why Choose CodeStorm Hub?</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>✨ Expert team with 8+ years of experience</li>
                  <li>🚀 Modern, scalable solutions</li>
                  <li>⚡ Fast turnaround times</li>
                  <li>🎯 Focus on user experience and performance</li>
                  <li>🔧 Ongoing support and maintenance</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
