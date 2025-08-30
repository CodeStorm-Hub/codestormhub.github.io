"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  VscSearch,
  VscChevronDown,
  VscChevronRight,
  VscFile,
  VscFolder,
  VscCaseSensitive,
  VscWholeWord,
  VscRegex,
  VscReplace
} from "react-icons/vsc";
import { cn } from "@/lib/utils";
import { FileSystemItem } from "@/types";

interface SearchPanelProps {
  files: FileSystemItem[];
  onFileSelect: (file: FileSystemItem) => void;
  className?: string;
}

interface SearchResult {
  file: FileSystemItem;
  matches: Array<{
    line: number;
    column: number;
    text: string;
    preview: string;
  }>;
}

export function SearchPanel({ files, onFileSelect, className }: SearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  // Simulate file content search
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const results: SearchResult[] = [];
    
    const searchInFile = (file: FileSystemItem) => {
      if (file.type === "file" && file.content) {
        const lines = file.content.split("\n");
        const matches: SearchResult["matches"] = [];
        
        lines.forEach((line, lineIndex) => {
          let searchPattern = searchTerm;
          let flags = "g";
          
          if (!caseSensitive) flags += "i";
          
          try {
            const regex = useRegex 
              ? new RegExp(searchPattern, flags)
              : new RegExp(
                  wholeWord 
                    ? `\\b${searchPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`
                    : searchPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                  flags
                );
            
            let match;
            while ((match = regex.exec(line)) !== null) {
              matches.push({
                line: lineIndex + 1,
                column: match.index + 1,
                text: match[0],
                preview: line.trim()
              });
              
              if (!regex.global) break;
            }
          } catch (e) {
            // Invalid regex, skip
          }
        });
        
        if (matches.length > 0) {
          results.push({ file, matches });
        }
      }
    };

    const traverseFiles = (fileList: FileSystemItem[]) => {
      fileList.forEach(file => {
        if (file.type === "file") {
          searchInFile(file);
        } else if (file.children) {
          traverseFiles(file.children);
        }
      });
    };

    traverseFiles(files);
    return results;
  }, [searchTerm, files, caseSensitive, wholeWord, useRegex]);

  const toggleExpanded = (fileId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId);
    } else {
      newExpanded.add(fileId);
    }
    setExpandedResults(newExpanded);
  };

  const totalMatches = searchResults.reduce((sum, result) => sum + result.matches.length, 0);
  const totalFiles = searchResults.length;

  return (
    <div className={cn("flex h-full w-80 flex-col bg-[#252526] text-gray-300", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-widest border-b border-[#2c2c2c]">
        <span>Search</span>
        <VscChevronDown className="h-3 w-3" />
      </div>

      {/* Search Input */}
      <div className="p-3 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded bg-[#1e1e1e] pl-8 pr-2 py-2 text-sm text-gray-300 placeholder-gray-500 border border-[#3c3c3c] focus:border-blue-500 focus:outline-none"
          />
          <VscSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        {/* Replace Input */}
        <AnimatePresence>
          {showReplace && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Replace"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                className="w-full rounded bg-[#1e1e1e] pl-8 pr-2 py-2 text-sm text-gray-300 placeholder-gray-500 border border-[#3c3c3c] focus:border-blue-500 focus:outline-none"
              />
              <VscReplace className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Options */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={cn(
              "p-1 rounded text-xs transition-colors",
              caseSensitive ? "bg-blue-600 text-white" : "hover:bg-[#37373d] text-gray-400"
            )}
            title="Match Case"
          >
            <VscCaseSensitive className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setWholeWord(!wholeWord)}
            className={cn(
              "p-1 rounded text-xs transition-colors",
              wholeWord ? "bg-blue-600 text-white" : "hover:bg-[#37373d] text-gray-400"
            )}
            title="Match Whole Word"
          >
            <VscWholeWord className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setUseRegex(!useRegex)}
            className={cn(
              "p-1 rounded text-xs transition-colors",
              useRegex ? "bg-blue-600 text-white" : "hover:bg-[#37373d] text-gray-400"
            )}
            title="Use Regular Expression"
          >
            <VscRegex className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowReplace(!showReplace)}
            className={cn(
              "p-1 rounded text-xs transition-colors ml-auto",
              showReplace ? "bg-blue-600 text-white" : "hover:bg-[#37373d] text-gray-400"
            )}
            title="Toggle Replace"
          >
            <VscReplace className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {searchTerm && (
          <div className="px-3 py-2 text-xs text-gray-400 border-b border-[#2c2c2c]">
            {totalFiles} {totalFiles === 1 ? 'result' : 'results'} in {totalFiles} {totalFiles === 1 ? 'file' : 'files'} 
            {totalMatches > 0 && ` (${totalMatches} ${totalMatches === 1 ? 'match' : 'matches'})`}
          </div>
        )}
        
        <div className="p-2">
          <AnimatePresence>
            {searchResults.map((result) => (
              <motion.div
                key={result.file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-2"
              >
                {/* File Header */}
                <div
                  className="flex items-center space-x-2 p-2 rounded hover:bg-[#2a2d2e] cursor-pointer"
                  onClick={() => toggleExpanded(result.file.id)}
                >
                  <motion.div
                    animate={{ rotate: expandedResults.has(result.file.id) ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <VscChevronRight className="h-3 w-3" />
                  </motion.div>
                  <VscFile className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300 flex-1">{result.file.name}</span>
                  <span className="text-xs text-gray-500">{result.matches.length}</span>
                </div>

                {/* Search Matches */}
                <AnimatePresence>
                  {expandedResults.has(result.file.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-6 overflow-hidden"
                    >
                      {result.matches.map((match, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-1 rounded hover:bg-[#2a2d2e] cursor-pointer text-xs"
                          onClick={() => onFileSelect(result.file)}
                        >
                          <span className="text-gray-500 w-8">{match.line}</span>
                          <span className="text-gray-300 truncate flex-1">
                            {match.preview.substring(0, match.column - 1)}
                            <span className="bg-yellow-600 text-black px-1">
                              {match.text}
                            </span>
                            {match.preview.substring(match.column - 1 + match.text.length)}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {searchTerm && searchResults.length === 0 && (
            <div className="text-center text-gray-500 py-8 text-sm">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
