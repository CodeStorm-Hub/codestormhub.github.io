"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  VscSourceControl,
  VscChevronDown,
  VscChevronRight,
  VscAdd,
  VscRemove,
  VscDiffAdded,
  VscDiffModified,
  VscDiffRemoved,
  VscFile,
  VscFolder,
  VscCheck,
  VscClose,
  VscGitCommit,
  VscSync,
  VscCloudUpload
} from "react-icons/vsc";
import { cn } from "@/lib/utils";

interface GitChange {
  id: string;
  path: string;
  type: "added" | "modified" | "deleted" | "untracked";
  staged: boolean;
}

interface GitPanelProps {
  className?: string;
}

// Mock git data
const mockChanges: GitChange[] = [
  { id: "1", path: "src/components/ide/FileExplorer.tsx", type: "modified", staged: false },
  { id: "2", path: "src/components/ide/TabBar.tsx", type: "modified", staged: true },
  { id: "3", path: "src/components/ide/SearchPanel.tsx", type: "added", staged: false },
  { id: "4", path: "src/components/ide/GitPanel.tsx", type: "added", staged: false },
  { id: "5", path: "old-component.tsx", type: "deleted", staged: false },
  { id: "6", path: "temp-file.txt", type: "untracked", staged: false },
];

export function GitPanel({ className }: GitPanelProps) {
  const [commitMessage, setCommitMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["changes", "staged"]));
  const [selectedChanges, setSelectedChanges] = useState<Set<string>>(new Set());

  const { stagedChanges, unstagedChanges } = useMemo(() => {
    const staged = mockChanges.filter(change => change.staged);
    const unstaged = mockChanges.filter(change => !change.staged);
    return { stagedChanges: staged, unstagedChanges: unstaged };
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleChangeSelection = (changeId: string) => {
    const newSelected = new Set(selectedChanges);
    if (newSelected.has(changeId)) {
      newSelected.delete(changeId);
    } else {
      newSelected.add(changeId);
    }
    setSelectedChanges(newSelected);
  };

  const stageChange = (changeId: string) => {
    // Mock staging logic
    console.log("Staging change:", changeId);
  };

  const unstageChange = (changeId: string) => {
    // Mock unstaging logic
    console.log("Unstaging change:", changeId);
  };

  const getChangeIcon = (type: GitChange["type"]) => {
    switch (type) {
      case "added":
      case "untracked":
        return <VscDiffAdded className="h-4 w-4 text-green-500" />;
      case "modified":
        return <VscDiffModified className="h-4 w-4 text-blue-500" />;
      case "deleted":
        return <VscDiffRemoved className="h-4 w-4 text-red-500" />;
      default:
        return <VscFile className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLetter = (type: GitChange["type"]) => {
    switch (type) {
      case "added":
      case "untracked":
        return "A";
      case "modified":
        return "M";
      case "deleted":
        return "D";
      default:
        return "?";
    }
  };

  const renderChangeItem = (change: GitChange, showStageActions: boolean = true) => (
    <motion.div
      key={change.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group flex items-center space-x-2 p-1 rounded hover:bg-[#2a2d2e] cursor-pointer text-sm"
      onClick={() => toggleChangeSelection(change.id)}
    >
      <input
        type="checkbox"
        checked={selectedChanges.has(change.id)}
        onChange={() => toggleChangeSelection(change.id)}
        className="w-3 h-3 rounded border border-gray-600 bg-[#1e1e1e]"
        onClick={(e) => e.stopPropagation()}
        title={`Select ${change.path}`}
        aria-label={`Select ${change.path} for staging`}
      />
      
      {getChangeIcon(change.type)}
      
      <span className="flex-1 truncate text-gray-300">
        {change.path.split('/').pop()}
      </span>
      
      <span className={cn(
        "text-xs px-1 rounded font-mono",
        change.type === "added" || change.type === "untracked" 
          ? "text-green-400" 
          : change.type === "modified" 
          ? "text-blue-400" 
          : "text-red-400"
      )}>
        {getStatusLetter(change.type)}
      </span>
      
      {showStageActions && (
        <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
          {!change.staged ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                stageChange(change.id);
              }}
              className="p-1 rounded hover:bg-[#37373d]"
              title="Stage Changes"
            >
              <VscAdd className="h-3 w-3 text-green-400" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                unstageChange(change.id);
              }}
              className="p-1 rounded hover:bg-[#37373d]"
              title="Unstage Changes"
            >
              <VscRemove className="h-3 w-3 text-red-400" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={cn("flex h-full w-80 flex-col bg-[#252526] text-gray-300", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-widest border-b border-[#2c2c2c]">
        <div className="flex items-center space-x-2">
          <VscSourceControl className="h-4 w-4" />
          <span>Source Control</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            className="p-1 rounded hover:bg-[#37373d]"
            title="Refresh"
          >
            <VscSync className="h-3 w-3" />
          </button>
          <VscChevronDown className="h-3 w-3" />
        </div>
      </div>

      {/* Commit Message */}
      <div className="p-3 border-b border-[#2c2c2c]">
        <div className="relative">
          <textarea
            placeholder="Message (Ctrl+Enter to commit)"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="w-full h-20 rounded bg-[#1e1e1e] p-2 text-sm text-gray-300 placeholder-gray-500 border border-[#3c3c3c] focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <button
            disabled={!commitMessage.trim() || stagedChanges.length === 0}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium transition-colors",
              commitMessage.trim() && stagedChanges.length > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-[#37373d] text-gray-500 cursor-not-allowed"
            )}
          >
            <VscGitCommit className="h-4 w-4" />
            <span>Commit</span>
          </button>
          
          <div className="flex items-center space-x-1">
            <button
              className="p-1.5 rounded hover:bg-[#37373d] text-gray-400"
              title="Sync Changes"
            >
              <VscCloudUpload className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Changes */}
      <div className="flex-1 overflow-y-auto">
        {/* Staged Changes */}
        {stagedChanges.length > 0 && (
          <div className="border-b border-[#2c2c2c]">
            <div
              className="flex items-center justify-between p-2 hover:bg-[#2a2d2e] cursor-pointer"
              onClick={() => toggleSection("staged")}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: expandedSections.has("staged") ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <VscChevronRight className="h-3 w-3" />
                </motion.div>
                <span className="text-sm font-medium">Staged Changes</span>
                <span className="text-xs text-gray-500 bg-[#37373d] px-1.5 py-0.5 rounded">
                  {stagedChanges.length}
                </span>
              </div>
              
              <button
                className="p-1 rounded hover:bg-[#37373d] opacity-0 group-hover:opacity-100"
                title="Unstage All Changes"
              >
                <VscRemove className="h-3 w-3 text-red-400" />
              </button>
            </div>

            <AnimatePresence>
              {expandedSections.has("staged") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-2 overflow-hidden"
                >
                  {stagedChanges.map(change => renderChangeItem(change, false))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Unstaged Changes */}
        {unstagedChanges.length > 0 && (
          <div>
            <div
              className="flex items-center justify-between p-2 hover:bg-[#2a2d2e] cursor-pointer"
              onClick={() => toggleSection("changes")}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: expandedSections.has("changes") ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <VscChevronRight className="h-3 w-3" />
                </motion.div>
                <span className="text-sm font-medium">Changes</span>
                <span className="text-xs text-gray-500 bg-[#37373d] px-1.5 py-0.5 rounded">
                  {unstagedChanges.length}
                </span>
              </div>
              
              <button
                className="p-1 rounded hover:bg-[#37373d] opacity-0 group-hover:opacity-100"
                title="Stage All Changes"
              >
                <VscAdd className="h-3 w-3 text-green-400" />
              </button>
            </div>

            <AnimatePresence>
              {expandedSections.has("changes") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-2 overflow-hidden"
                >
                  {unstagedChanges.map(change => renderChangeItem(change))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {mockChanges.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-sm">
            <VscCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
            No changes
          </div>
        )}
      </div>
    </div>
  );
}
