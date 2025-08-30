"use client";

import { useEffect } from "react";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md z-[99999] font-medium shadow-lg border-2 border-blue-400 transition-colors duration-200"
    >
      {children}
    </a>
  );
}

export function A11yAnnouncer() {
  useEffect(() => {
    // Create live region for announcements
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.id = "a11y-announcer";
    document.body.appendChild(announcer);

    return () => {
      const existing = document.getElementById("a11y-announcer");
      if (existing) {
        document.body.removeChild(existing);
      }
    };
  }, []);

  return null;
}

export function announceToScreenReader(message: string) {
  const announcer = document.getElementById("a11y-announcer");
  if (announcer) {
    announcer.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = "";
    }, 1000);
  }
}

interface FocusTrapProps {
  isActive: boolean;
  children: React.ReactNode;
}

export function FocusTrap({ isActive, children }: FocusTrapProps) {
  useEffect(() => {
    if (!isActive) return;

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (e.key === "Escape") {
        // Allow parent components to handle escape
        const event = new CustomEvent("focustrap:escape");
        document.dispatchEvent(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  return <>{children}</>;
}

const AccessibilityComponents = { SkipLink, A11yAnnouncer, FocusTrap, announceToScreenReader };

export default AccessibilityComponents;
