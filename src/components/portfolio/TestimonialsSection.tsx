"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Testimonial } from "@/types";
import NextImage from "next/image";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsProps> = ({
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">What Our Clients Say</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Don&apos;t just take our word for it
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Testimonial Display */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          {/* Quote Icon */}
          <div className="absolute top-6 left-6 text-blue-500 opacity-20">
            <Quote size={48} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              {/* Content */}
              <div className="text-center space-y-6">
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                  &ldquo;{currentTestimonial.content}&rdquo;
                </p>

                {/* Rating */}
                <div className="flex justify-center gap-1">
                  {renderStars(currentTestimonial.rating)}
                </div>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <NextImage
                    src={currentTestimonial.image}
                    alt={`${currentTestimonial.name} - ${currentTestimonial.role} at ${currentTestimonial.company}`}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-blue-500 dark:text-blue-400 text-sm">
                      {currentTestimonial.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {currentTestimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </motion.button>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View testimonial ${index + 1}`}
              title={`View testimonial ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* All Testimonials Grid (Alternative View) */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border transition-colors cursor-pointer ${
                index === currentIndex
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="flex items-center gap-3 mb-3">
                <NextImage
                  src={testimonial.image}
                  alt={`${testimonial.name} - ${testimonial.role} at ${testimonial.company}`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="font-medium text-sm">{testimonial.name}</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex gap-1 mt-2">
                {renderStars(testimonial.rating).map((star, i) => (
                  <div key={i} className="w-3 h-3">
                    {React.cloneElement(star, { className: star.props.className + " w-3 h-3" })}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
