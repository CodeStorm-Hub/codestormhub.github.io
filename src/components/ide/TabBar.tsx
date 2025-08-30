"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  VscClose, 
  VscFile, 
  VscSave, 
  VscCircleFilled,
  VscChevronDown,
  VscSplitHorizontal
} from "react-icons/vsc";
import { cn } from "@/lib/utils";
import { Tab } from "@/types";

interface TabBarProps {
  tabs: Tab[];
  activeTab?: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabSave?: (tabId: string) => void;
  className?: string;
}

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  onSave?: () => void;
  onContextMenu: (e: React.MouseEvent, tabId: string) => void;
}

const getFileIcon = (filename: string) => {
  // In a real implementation, you'd have different icons for different file types
  return VscFile;
};

const getFileColor = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'ts':
    case 'tsx':
      return 'text-blue-400';
    case 'js':
    case 'jsx':
      return 'text-yellow-400';
    case 'css':
    case 'scss':
      return 'text-purple-400';
    case 'html':
      return 'text-orange-400';
    case 'json':
      return 'text-green-400';
    case 'md':
      return 'text-gray-300';
    case 'py':
      return 'text-blue-300';
    default:
      return 'text-gray-400';
  }
};

function TabItem({ tab, isActive, onSelect, onClose, onSave, onContextMenu }: TabItemProps) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.();
  };

  const Icon = getFileIcon(tab.title);
  const fileColor = getFileColor(tab.title);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, width: 0 }}
      animate={{ opacity: 1, x: 0, width: "auto" }}
      exit={{ opacity: 0, x: -20, width: 0 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeInOut",
        layout: { duration: 0.3 }
      }}
      className="shrink-0"
    >
      <div
        className={cn(
          "group relative flex items-center h-9 px-3 text-sm cursor-pointer border-r border-[#2c2c2c] min-w-[120px] max-w-[200px] transition-colors",
          isActive 
            ? "bg-[#1e1e1e] text-white" 
            : "bg-[#2d2d30] text-gray-400 hover:bg-[#37373d] hover:text-gray-300"
        )}
        onClick={onSelect}
        onContextMenu={(e) => onContextMenu(e, tab.id)}
      >
        {/* Active tab indicator */}
        {isActive && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500"
            layoutId="activeTabIndicator"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          />
        )}

        {/* File icon */}
        <Icon className={cn("h-4 w-4 shrink-0 mr-2", fileColor)} />
        
        {/* File name */}
        <span className="truncate mr-2 select-none">
          {tab.title}
        </span>

        {/* Dirty state indicator */}
        {tab.isDirty && (
          <VscCircleFilled className="h-2 w-2 text-white shrink-0 mr-1" />
        )}

        {/* Close button / Save button */}
        <div className="flex items-center shrink-0">
          {tab.isDirty && onSave ? (
            <motion.button
              className="p-1 rounded hover:bg-[#37373d] text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              onClick={handleSave}
              title="Save"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Save ${tab.title}`}
            >
              <VscSave className="h-3 w-3" />
            </motion.button>
          ) : (
            <motion.button
              className={cn(
                "p-1 rounded hover:bg-[#37373d] text-gray-400 hover:text-white transition-colors",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              onClick={handleClose}
              title="Close"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Close ${tab.title}`}
            >
              <VscClose className="h-3 w-3" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function TabBar({ 
  tabs, 
  activeTab,
  onTabSelect, 
  onTabClose, 
  onTabSave,
  className 
}: TabBarProps) {
  const [contextMenuTab, setContextMenuTab] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenuTab(tabId);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenuTab(null);
  };

  const closeOtherTabs = (keepTabId: string) => {
    tabs.forEach(tab => {
      if (tab.id !== keepTabId) {
        onTabClose(tab.id);
      }
    });
    handleCloseContextMenu();
  };

  const closeTabsToRight = (fromTabId: string) => {
    const fromIndex = tabs.findIndex(tab => tab.id === fromTabId);
    tabs.slice(fromIndex + 1).forEach(tab => {
      onTabClose(tab.id);
    });
    handleCloseContextMenu();
  };

  const closeAllTabs = () => {
    tabs.forEach(tab => {
      onTabClose(tab.id);
    });
    handleCloseContextMenu();
  };

  if (tabs.length === 0) {
    return (
      <div className={cn("h-9 bg-[#2d2d30] border-b border-[#2c2c2c]", className)} />
    );
  }

  return (
    <>
      <div className={cn(
        "flex h-9 items-center overflow-x-auto bg-[#2d2d30] border-b border-[#2c2c2c] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600",
        className
      )}>
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id || tab.isActive;

            return (
              <TabItem
                key={tab.id}
                tab={tab}
                isActive={isActive}
                onSelect={() => onTabSelect(tab.id)}
                onClose={() => onTabClose(tab.id)}
                onSave={onTabSave ? () => onTabSave(tab.id) : undefined}
                onContextMenu={handleContextMenu}
              />
            );
          })}
        </AnimatePresence>

        {/* Tab overflow indicator */}
        {tabs.length > 6 && (
          <div className="flex items-center px-2 text-gray-500">
            <VscChevronDown className="h-4 w-4" />
          </div>
        )}

        {/* Tab actions */}
        <div className="flex items-center ml-auto px-2 space-x-1">
          <motion.button
            className="p-1 rounded hover:bg-[#37373d] text-gray-400 hover:text-white transition-colors"
            title="Split Editor Right"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Split Editor Right"
          >
            <VscSplitHorizontal className="h-4 w-4" />
          </motion.button>
        </div>
        
        {/* Tab bar background for remaining space */}
        <div className="flex-1 bg-[#2d2d30]" />
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenuTab && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50"
              onClick={handleCloseContextMenu}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="fixed z-50 bg-[#1e1e1e] border border-[#3c3c3c] rounded shadow-xl py-1 min-w-[200px]"
              style={{
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
              }}
            >
              <button
                className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-[#37373d] transition-colors"
                onClick={() => {
                  onTabSelect(contextMenuTab);
                  handleCloseContextMenu();
                }}
              >
                Select Tab
              </button>
              
              <button
                className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-[#37373d] transition-colors"
                onClick={() => {
                  onTabClose(contextMenuTab);
                  handleCloseContextMenu();
                }}
              >
                Close
              </button>
              
              <button
                className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-[#37373d] transition-colors"
                onClick={() => closeOtherTabs(contextMenuTab)}
              >
                Close Others
              </button>
              
              <button
                className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-[#37373d] transition-colors"
                onClick={() => closeTabsToRight(contextMenuTab)}
              >
                Close to the Right
              </button>
              
              <div className="border-t border-[#3c3c3c] my-1" />
              
              <button
                className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-[#37373d] transition-colors"
                onClick={closeAllTabs}
              >
                Close All
              </button>
              
              {contextMenuTab && tabs.find(t => t.id === contextMenuTab)?.isDirty && onTabSave && (
                <>
                  <div className="border-t border-[#3c3c3c] my-1" />
                  <button
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-[#37373d] transition-colors"
                    onClick={() => {
                      onTabSave(contextMenuTab);
                      handleCloseContextMenu();
                    }}
                  >
                    Save
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
