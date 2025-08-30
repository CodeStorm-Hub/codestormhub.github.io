"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  VscDebugAlt,
  VscPlay,
  VscDebugPause,
  VscDebugStop,
  VscDebugRestart,
  VscDebugStepOver,
  VscDebugStepInto,
  VscDebugStepOut,
  VscChevronDown,
  VscChevronRight,
  VscCircleFilled,
  VscSettings,
  VscAdd,
  VscTrash
} from "react-icons/vsc";
import { cn } from "@/lib/utils";

interface Breakpoint {
  id: string;
  file: string;
  line: number;
  enabled: boolean;
  condition?: string;
}

interface Variable {
  name: string;
  value: string;
  type: string;
  expandable?: boolean;
  children?: Variable[];
}

interface CallStackItem {
  function: string;
  file: string;
  line: number;
  column: number;
}

interface DebugPanelProps {
  className?: string;
}

const mockBreakpoints: Breakpoint[] = [
  { id: "1", file: "FileExplorer.tsx", line: 45, enabled: true },
  { id: "2", file: "TabBar.tsx", line: 23, enabled: false, condition: "items.length > 0" },
  { id: "3", file: "Terminal.tsx", line: 67, enabled: true },
];

const mockVariables: Variable[] = [
  { 
    name: "searchTerm", 
    value: '"react"', 
    type: "string" 
  },
  { 
    name: "files", 
    value: "Array(15)", 
    type: "Array", 
    expandable: true,
    children: [
      { name: "0", value: "{id: '1', name: 'package.json', ...}", type: "Object" },
      { name: "1", value: "{id: '2', name: 'README.md', ...}", type: "Object" },
      { name: "length", value: "15", type: "number" },
    ]
  },
  { 
    name: "activePanel", 
    value: '"files"', 
    type: "string" 
  },
  { 
    name: "isExpanded", 
    value: "true", 
    type: "boolean" 
  },
];

const mockCallStack: CallStackItem[] = [
  { function: "handleFileSelect", file: "FileExplorer.tsx", line: 45, column: 12 },
  { function: "onClick", file: "FileExplorer.tsx", line: 123, column: 8 },
  { function: "callCallback", file: "react-dom.js", line: 3945, column: 14 },
  { function: "invokeGuardedCallbackDev", file: "react-dom.js", line: 3994, column: 16 },
];

export function DebugPanel({ className }: DebugPanelProps) {
  const [isDebugging, setIsDebugging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["variables", "callstack", "breakpoints"])
  );
  const [expandedVariables, setExpandedVariables] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleVariable = (varName: string) => {
    const newExpanded = new Set(expandedVariables);
    if (newExpanded.has(varName)) {
      newExpanded.delete(varName);
    } else {
      newExpanded.add(varName);
    }
    setExpandedVariables(newExpanded);
  };

  const startDebugging = () => {
    setIsDebugging(true);
    setIsPaused(true);
  };

  const stopDebugging = () => {
    setIsDebugging(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const renderVariable = (variable: Variable, depth: number = 0) => (
    <div key={variable.name} className={`ml-${depth * 3}`}>
      <div
        className={cn(
          "flex items-center space-x-1 p-1 rounded hover:bg-[#2a2d2e] cursor-pointer text-xs",
          variable.expandable && "cursor-pointer"
        )}
        onClick={() => variable.expandable && toggleVariable(variable.name)}
      >
        {variable.expandable ? (
          <motion.div
            animate={{ rotate: expandedVariables.has(variable.name) ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <VscChevronRight className="h-3 w-3" />
          </motion.div>
        ) : (
          <div className="w-3" />
        )}
        
        <span className="text-blue-400 font-medium">{variable.name}:</span>
        <span className={cn(
          "text-gray-300",
          variable.type === "string" && "text-green-400",
          variable.type === "number" && "text-blue-300",
          variable.type === "boolean" && "text-orange-400"
        )}>
          {variable.value}
        </span>
        <span className="text-gray-500 text-xs">({variable.type})</span>
      </div>

      <AnimatePresence>
        {variable.expandable && expandedVariables.has(variable.name) && variable.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {variable.children.map(child => renderVariable(child, depth + 1))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={cn("flex h-full w-80 flex-col bg-[#252526] text-gray-300", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-widest border-b border-[#2c2c2c]">
        <div className="flex items-center space-x-2">
          <VscDebugAlt className="h-4 w-4" />
          <span>Run and Debug</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            className="p-1 rounded hover:bg-[#37373d]"
            title="Configure Debug Settings"
          >
            <VscSettings className="h-3 w-3" />
          </button>
          <VscChevronDown className="h-3 w-3" />
        </div>
      </div>

      {/* Debug Controls */}
      <div className="p-3 border-b border-[#2c2c2c]">
        <div className="flex items-center space-x-2 mb-3">
          <select 
            className="flex-1 bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 text-sm text-gray-300"
            title="Debug Configuration"
            aria-label="Select debug configuration"
          >
            <option>Launch Program</option>
            <option>Attach to Process</option>
            <option>Debug Current File</option>
          </select>
          
          <button
            className="p-1 rounded hover:bg-[#37373d]"
            title="Add Configuration"
          >
            <VscAdd className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center space-x-1">
          {!isDebugging ? (
            <button
              onClick={startDebugging}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
              title="Start Debugging"
            >
              <VscPlay className="h-4 w-4" />
              <span>Start</span>
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  isPaused ? "bg-blue-600 hover:bg-blue-700" : "bg-yellow-600 hover:bg-yellow-700"
                )}
                title={isPaused ? "Continue" : "Pause"}
              >
                {isPaused ? <VscPlay className="h-4 w-4" /> : <VscDebugPause className="h-4 w-4" />}
              </button>
              
              <button
                onClick={stopDebugging}
                className="p-1.5 rounded bg-red-600 hover:bg-red-700 transition-colors"
                title="Stop"
              >
                <VscDebugStop className="h-4 w-4" />
              </button>
              
              <button
                onClick={stopDebugging}
                className="p-1.5 rounded hover:bg-[#37373d] transition-colors"
                title="Restart"
              >
                <VscDebugRestart className="h-4 w-4" />
              </button>
              
              <div className="h-6 w-px bg-[#3c3c3c]" />
              
              <button
                className="p-1.5 rounded hover:bg-[#37373d] transition-colors"
                title="Step Over"
                disabled={!isPaused}
              >
                <VscDebugStepOver className="h-4 w-4" />
              </button>
              
              <button
                className="p-1.5 rounded hover:bg-[#37373d] transition-colors"
                title="Step Into"
                disabled={!isPaused}
              >
                <VscDebugStepInto className="h-4 w-4" />
              </button>
              
              <button
                className="p-1.5 rounded hover:bg-[#37373d] transition-colors"
                title="Step Out"
                disabled={!isPaused}
              >
                <VscDebugStepOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Debug Information */}
      <div className="flex-1 overflow-y-auto">
        {isDebugging && (
          <>
            {/* Variables */}
            <div className="border-b border-[#2c2c2c]">
              <div
                className="flex items-center justify-between p-2 hover:bg-[#2a2d2e] cursor-pointer"
                onClick={() => toggleSection("variables")}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: expandedSections.has("variables") ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <VscChevronRight className="h-3 w-3" />
                  </motion.div>
                  <span className="text-sm font-medium">Variables</span>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.has("variables") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-2 overflow-hidden"
                  >
                    {mockVariables.map(variable => renderVariable(variable))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Call Stack */}
            <div className="border-b border-[#2c2c2c]">
              <div
                className="flex items-center justify-between p-2 hover:bg-[#2a2d2e] cursor-pointer"
                onClick={() => toggleSection("callstack")}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: expandedSections.has("callstack") ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <VscChevronRight className="h-3 w-3" />
                  </motion.div>
                  <span className="text-sm font-medium">Call Stack</span>
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.has("callstack") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-2 overflow-hidden"
                  >
                    {mockCallStack.map((frame, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-1 rounded hover:bg-[#2a2d2e] cursor-pointer text-xs"
                      >
                        <span className="text-yellow-400 font-medium">
                          {frame.function}
                        </span>
                        <span className="text-gray-500">
                          {frame.file}:{frame.line}:{frame.column}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Breakpoints */}
        <div>
          <div
            className="flex items-center justify-between p-2 hover:bg-[#2a2d2e] cursor-pointer"
            onClick={() => toggleSection("breakpoints")}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: expandedSections.has("breakpoints") ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <VscChevronRight className="h-3 w-3" />
              </motion.div>
              <span className="text-sm font-medium">Breakpoints</span>
              <span className="text-xs text-gray-500 bg-[#37373d] px-1.5 py-0.5 rounded">
                {mockBreakpoints.filter(bp => bp.enabled).length}
              </span>
            </div>
          </div>

          <AnimatePresence>
            {expandedSections.has("breakpoints") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-2 overflow-hidden"
              >
                {mockBreakpoints.map((breakpoint) => (
                  <div
                    key={breakpoint.id}
                    className="flex items-center space-x-2 p-1 rounded hover:bg-[#2a2d2e] cursor-pointer text-xs group"
                  >
                    <VscCircleFilled 
                      className={cn(
                        "h-3 w-3",
                        breakpoint.enabled ? "text-red-500" : "text-gray-600"
                      )} 
                    />
                    
                    <span className="flex-1 text-gray-300">
                      {breakpoint.file}:{breakpoint.line}
                    </span>
                    
                    {breakpoint.condition && (
                      <span className="text-xs text-orange-400">
                        {breakpoint.condition}
                      </span>
                    )}
                    
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#37373d]"
                      title="Remove Breakpoint"
                    >
                      <VscTrash className="h-3 w-3 text-red-400" />
                    </button>
                  </div>
                ))}
                
                {mockBreakpoints.length === 0 && (
                  <div className="text-center text-gray-500 py-4 text-xs">
                    No breakpoints
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
