"use client";

import { motion } from "framer-motion";
import { 
  VscFiles, 
  VscSearch, 
  VscSourceControl, 
  VscDebugAlt,
  VscExtensions, 
  VscGear,
  VscAccount,
  VscBellDot
} from "react-icons/vsc";
import { cn } from "@/lib/utils";

export type ActivityPanel = "files" | "search" | "git" | "debug" | "extensions" | "settings" | null;

interface ActivityBarProps {
  activePanel: ActivityPanel;
  onPanelChange: (panel: ActivityPanel) => void;
  className?: string;
}

const activityItems = [
  { id: "files" as ActivityPanel, icon: VscFiles, label: "Explorer", shortcut: "Ctrl+Shift+E" },
  { id: "search" as ActivityPanel, icon: VscSearch, label: "Search", shortcut: "Ctrl+Shift+F" },
  { id: "git" as ActivityPanel, icon: VscSourceControl, label: "Source Control", shortcut: "Ctrl+Shift+G" },
  { id: "debug" as ActivityPanel, icon: VscDebugAlt, label: "Run and Debug", shortcut: "Ctrl+Shift+D" },
  { id: "extensions" as ActivityPanel, icon: VscExtensions, label: "Extensions", shortcut: "Ctrl+Shift+X" },
];

const bottomItems = [
  { id: "settings" as ActivityPanel, icon: VscGear, label: "Settings", shortcut: "Ctrl+," },
];

export function ActivityBar({ activePanel, onPanelChange, className }: ActivityBarProps) {
  const handleActivityClick = (activityId: ActivityPanel) => {
    // Toggle panel - if clicking the same panel, close it
    if (activePanel === activityId) {
      onPanelChange(null);
    } else {
      onPanelChange(activityId);
    }
  };

  return (
    <motion.div 
      className={cn(
        "flex w-12 flex-col items-center bg-[#2c2c2c] dark:bg-[#181818] text-gray-300 border-r border-[#3c3c3c]",
        className
      )}
      initial={{ x: -48 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Main activity items */}
      <div className="flex flex-col items-center space-y-2 py-4">
        {activityItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleActivityClick(item.id)}
            className={cn(
              "group relative flex h-10 w-10 items-center justify-center rounded-md text-lg transition-all duration-200",
              "hover:bg-[#37373d] dark:hover:bg-[#2a2a2a]",
              activePanel === item.id && "bg-[#37373d] dark:bg-[#2a2a2a] text-white"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`${item.label} ${item.shortcut ? `(${item.shortcut})` : ''}`}
            aria-label={item.label}
          >
            <item.icon />
            {activePanel === item.id && (
              <motion.div
                className="absolute -left-[1px] top-1/2 h-6 w-0.5 -translate-y-1/2 bg-blue-500"
                layoutId="activeIndicator"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
            
            {/* Enhanced tooltip */}
            <div className="absolute left-full ml-3 hidden group-hover:block z-50">
              <div className="rounded bg-[#1e1e1e] px-3 py-2 text-xs text-gray-300 shadow-xl border border-[#3c3c3c] whitespace-nowrap">
                <div className="font-medium">{item.label}</div>
                {item.shortcut && (
                  <div className="text-xs text-gray-500 mt-1">{item.shortcut}</div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom items */}
      <div className="flex flex-col items-center space-y-2 pb-4">
        <motion.button
          className="group relative flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-[#37373d] dark:hover:bg-[#2a2a2a] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Notifications"
          aria-label="Notifications"
        >
          <VscBellDot />
          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 hidden group-hover:block z-50">
            <div className="rounded bg-[#1e1e1e] px-3 py-2 text-xs text-gray-300 shadow-xl border border-[#3c3c3c] whitespace-nowrap">
              Notifications
            </div>
          </div>
        </motion.button>
        
        {bottomItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleActivityClick(item.id)}
            className={cn(
              "group flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
              "hover:bg-[#37373d] dark:hover:bg-[#2a2a2a]",
              activePanel === item.id && "bg-[#37373d] dark:bg-[#2a2a2a] text-white"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`${item.label} ${item.shortcut ? `(${item.shortcut})` : ''}`}
            aria-label={item.label}
          >
            <item.icon />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 hidden group-hover:block z-50">
              <div className="rounded bg-[#1e1e1e] px-3 py-2 text-xs text-gray-300 shadow-xl border border-[#3c3c3c] whitespace-nowrap">
                <div className="font-medium">{item.label}</div>
                {item.shortcut && (
                  <div className="text-xs text-gray-500 mt-1">{item.shortcut}</div>
                )}
              </div>
            </div>
          </motion.button>
        ))}

        {/* Account */}
        <motion.button
          className="group flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-[#37373d] dark:hover:bg-[#2a2a2a]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Account"
          aria-label="Account"
        >
          <VscAccount />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 hidden group-hover:block z-50">
            <div className="rounded bg-[#1e1e1e] px-3 py-2 text-xs text-gray-300 shadow-xl border border-[#3c3c3c] whitespace-nowrap">
              Account
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
