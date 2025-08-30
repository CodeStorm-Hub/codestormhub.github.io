"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VscChevronRight, VscClearAll, VscTerminal } from "react-icons/vsc";
import { cn } from "@/lib/utils";
import { TerminalCommand } from "@/types";

interface TerminalProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const welcomeMessage = `CodeStorm Hub Terminal v1.0.0
Type 'help' for available commands.`;

const availableCommands = {
  help: "Show available commands",
  clear: "Clear terminal",
  about: "Show information about CodeStorm Hub",
  skills: "List technical skills",
  projects: "Show project portfolio",
  contact: "Show contact information",
  theme: "Toggle theme",
  whoami: "Show current user info",
  pwd: "Print working directory",
  ls: "List directory contents",
  cat: "Display file contents",
  echo: "Display text",
  date: "Show current date and time",
};

export function Terminal({ isOpen, onToggle, className }: TerminalProps) {
  const [commands, setCommands] = useState<TerminalCommand[]>([
    {
      id: "welcome",
      command: "",
      output: welcomeMessage,
      timestamp: new Date(),
      type: "info",
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const timestamp = new Date();
    
    // Add command to history
    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd.trim()]);
    }

    let output = "";
    let type: TerminalCommand["type"] = "info";

    switch (trimmedCmd) {
      case "help":
        output = Object.entries(availableCommands)
          .map(([cmd, desc]) => `  ${cmd.padEnd(12)} - ${desc}`)
          .join("\n");
        break;
      
      case "clear":
        setCommands([]);
        return;
      
      case "about":
        output = `CodeStorm Hub - Full Stack Development Team
Building innovative web solutions with modern technologies.
Passionate about creating exceptional user experiences.`;
        break;
      
      case "skills":
        output = `Frontend: React, Next.js, TypeScript, Tailwind CSS
Backend: Node.js, Python, Express.js, PostgreSQL
DevOps: Docker, AWS, GitHub Actions, Vercel
Tools: VS Code, Git, Figma, Postman`;
        break;
      
      case "projects":
        output = `Featured Projects:
• Portfolio Website - Modern Next.js portfolio with IDE theme
• E-commerce Platform - Full-stack React application
• Task Management App - Collaborative productivity tool
• API Gateway Service - Microservices architecture`;
        break;
      
      case "contact":
        output = `📧 Email: hello@codestormhub.dev
🐙 GitHub: https://github.com/CodeStorm-Hub
🐦 Twitter: @codestormhub
💼 LinkedIn: linkedin.com/company/codestorm-hub`;
        break;
      
      case "whoami":
        output = "codestorm-user";
        break;
      
      case "pwd":
        output = "/home/codestorm/portfolio";
        break;
      
      case "ls":
        output = `total 8
drwxr-xr-x  2 codestorm codestorm 4096 Jan  1 12:00 projects/
drwxr-xr-x  2 codestorm codestorm 4096 Jan  1 12:00 about/
-rw-r--r--  1 codestorm codestorm  256 Jan  1 12:00 README.md
-rw-r--r--  1 codestorm codestorm  512 Jan  1 12:00 package.json`;
        break;
      
      case "date":
        output = new Date().toString();
        break;
      
      default:
        if (trimmedCmd.startsWith("echo ")) {
          output = cmd.slice(5);
        } else if (trimmedCmd.startsWith("cat ")) {
          const filename = cmd.slice(4).trim();
          if (filename === "README.md") {
            output = `# CodeStorm Hub Portfolio

Welcome to our interactive portfolio website!
Built with Next.js, TypeScript, and lots of ❤️`;
          } else {
            output = `cat: ${filename}: No such file or directory`;
            type = "error";
          }
        } else {
          output = `Command not found: ${cmd}. Type 'help' for available commands.`;
          type = "error";
        }
    }

    const newCommand: TerminalCommand = {
      id: Date.now().toString(),
      command: cmd,
      output,
      timestamp,
      type,
    };

    setCommands(prev => [...prev, newCommand]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
      setCurrentCommand("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      if (newIndex >= 0 && newIndex < commandHistory.length) {
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      if (newIndex === -1) {
        setCurrentCommand("");
      } else {
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }
  };

  const clearTerminal = () => {
    setCommands([]);
  };

  if (!isOpen) {
    return (
      <motion.div
        className={cn("h-8 bg-[#007acc] flex items-center px-3 cursor-pointer", className)}
        onClick={onToggle}
        whileHover={{ backgroundColor: "#106ebe" }}
      >
        <VscTerminal className="mr-2 h-4 w-4 text-white" />
        <span className="text-xs text-white font-medium">Terminal</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: 300 }}
      exit={{ height: 0 }}
      className={cn("bg-[#1e1e1e] border-t border-[#2c2c2c] flex flex-col", className)}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d30] border-b border-[#2c2c2c]">
        <div className="flex items-center space-x-2">
          <VscTerminal className="h-4 w-4 text-gray-300" />
          <span className="text-xs font-medium text-gray-300">Terminal</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={clearTerminal}
            className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-gray-300 hover:bg-[#37373d] transition-colors"
            title="Clear terminal"
          >
            <VscClearAll className="h-3 w-3" />
          </button>
          <button
            onClick={onToggle}
            className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-gray-300 hover:bg-[#37373d] transition-colors"
            title="Hide terminal"
          >
            <VscChevronRight className="h-3 w-3 rotate-90" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm text-gray-300"
      >
        <AnimatePresence>
          {commands.map((cmd) => (
            <motion.div
              key={cmd.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2"
            >
              {cmd.command && (
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">$</span>
                  <span className="text-gray-300">{cmd.command}</span>
                </div>
              )}
              {cmd.output && (
                <pre className={cn(
                  "whitespace-pre-wrap ml-4 mt-1",
                  cmd.type === "error" && "text-red-400",
                  cmd.type === "success" && "text-green-400",
                  cmd.type === "warning" && "text-yellow-400"
                )}>
                  {cmd.output}
                </pre>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current Command Line */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-300 outline-none font-mono"
            placeholder="Type a command..."
            spellCheck={false}
          />
        </div>
      </div>
    </motion.div>
  );
}
