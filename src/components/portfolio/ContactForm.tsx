"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, MessageSquare, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface ContactFormComponentProps {
  onSubmit: (data: ContactForm) => Promise<void>;
  className?: string;
}

const budgetOptions = [
  { value: "< $5k", label: "Less than $5,000" },
  { value: "$5k - $15k", label: "$5,000 - $15,000" },
  { value: "$15k - $50k", label: "$15,000 - $50,000" },
  { value: "> $50k", label: "More than $50,000" },
];

const timelineOptions = [
  { value: "ASAP", label: "As soon as possible" },
  { value: "1-2 months", label: "1-2 months" },
  { value: "3-6 months", label: "3-6 months" },
  { value: "6+ months", label: "6+ months" },
];

export function ContactFormComponent({ onSubmit, className }: ContactFormComponentProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    budget: "",
    timeline: "",
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast({
        type: "error",
        title: "Form Validation Error",
        message: "Please fix the errors before submitting."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        budget: "",
        timeline: "",
      });
      addToast({
        type: "success",
        title: "Message Sent Successfully!",
        message: "Thank you for your interest. We'll get back to you within 24 hours."
      });
    } catch (error) {
      console.error("Form submission error:", error);
      addToast({
        type: "error",
        title: "Failed to Send Message",
        message: "Please try again or contact us directly via email."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center space-y-4 p-8", className)}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
        >
          <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Message Sent Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={cn("space-y-6", className)}
    >
      {/* Name and Email Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="inline w-4 h-4 mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
              errors.name && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
            placeholder="John Doe"
            required
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Mail className="inline w-4 h-4 mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
              errors.email && "border-red-500 focus:ring-red-500 focus:border-red-500"
            )}
            placeholder="john@example.com"
            required
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <MessageSquare className="inline w-4 h-4 mr-1" />
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          className={cn(
            "w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
            errors.subject && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
          placeholder="Project inquiry, consultation, etc."
          required
        />
        {errors.subject && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
        )}
      </div>

      {/* Budget and Timeline Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Budget Range (Optional)
          </label>
          <select
            id="budget"
            value={formData.budget}
            onChange={(e) => handleInputChange("budget", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select budget range</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Clock className="inline w-4 h-4 mr-1" />
            Timeline (Optional)
          </label>
          <select
            id="timeline"
            value={formData.timeline}
            onChange={(e) => handleInputChange("timeline", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select timeline</option>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <MessageSquare className="inline w-4 h-4 mr-1" />
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          className={cn(
            "w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white",
            errors.message && "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
          placeholder="Tell us about your project, requirements, or any questions you have..."
          required
        />
        {errors.message && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formData.message.length}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
        size="lg"
      >
        <Send className="mr-2 h-4 w-4" />
        Send Message
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        We typically respond within 24 hours during business days.
      </p>
    </motion.form>
  );
}
