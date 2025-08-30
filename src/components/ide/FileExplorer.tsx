"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  VscChevronDown, 
  VscChevronRight, 
  VscFile, 
  VscFolder, 
  VscFolderOpened,
  VscJson,
  VscMarkdown,
  VscCode,
  VscSymbolClass
} from "react-icons/vsc";
import { cn } from "@/lib/utils";
import { FileSystemItem } from "@/types";

interface FileExplorerProps {
  files: FileSystemItem[];
  onFileSelect: (file: FileSystemItem) => void;
  selectedFile?: string;
  className?: string;
}

const fileIcons: Record<string, React.ComponentType> = {
  ".tsx": VscSymbolClass,
  ".ts": VscCode,
  ".js": VscCode,
  ".jsx": VscSymbolClass,
  ".json": VscJson,
  ".md": VscMarkdown,
  default: VscFile,
};

function getFileIcon(fileName: string) {
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  const IconComponent = fileIcons[extension] || fileIcons.default;
  return IconComponent;
}

interface FileItemProps {
  item: FileSystemItem;
  onSelect: (item: FileSystemItem) => void;
  selectedFile?: string;
  depth?: number;
}

function FileItem({ item, onSelect, selectedFile, depth = 0 }: FileItemProps) {
  const [isExpanded, setIsExpanded] = useState(item.type === "folder" ? true : false);
  const IconComponent = item.type === "file" ? getFileIcon(item.name) : (isExpanded ? VscFolderOpened : VscFolder);

  const handleClick = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(item);
    }
  };

  return (
    <div>
      <motion.div
        className={cn(
          "flex items-center space-x-1 cursor-pointer rounded-sm px-2 py-1 text-sm hover:bg-[#2a2d2e]",
          selectedFile === item.id && "bg-[#37373d]",
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={handleClick}
        whileHover={{ backgroundColor: "rgba(42, 45, 46, 0.8)" }}
      >
        {item.type === "folder" && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <VscChevronRight className="h-3 w-3" />
          </motion.div>
        )}
        <IconComponent className={cn(
          "h-4 w-4",
          item.type === "folder" ? "text-blue-400" : "text-gray-300"
        )} />
        <span className="text-gray-300 truncate">{item.name}</span>
      </motion.div>

      <AnimatePresence>
        {item.type === "folder" && isExpanded && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <FileItem
                key={child.id}
                item={child}
                onSelect={onSelect}
                selectedFile={selectedFile}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileExplorer({ files, onFileSelect, selectedFile, className }: FileExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("flex h-full w-80 flex-col bg-[#252526] text-gray-300", className)}>
      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-widest border-b border-[#2c2c2c]">
        <span>Explorer</span>
        <VscChevronDown className="h-3 w-3" />
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded bg-[#1e1e1e] px-2 py-1 text-sm text-gray-300 placeholder-gray-500 border border-[#3c3c3c] focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {filteredFiles.map((file) => (
            <FileItem
              key={file.id}
              item={file}
              onSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
