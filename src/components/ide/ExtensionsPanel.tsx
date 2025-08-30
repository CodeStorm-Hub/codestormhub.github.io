"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  VscExtensions,
  VscSearch,
  VscStarFull,
  VscStarEmpty,
  VscCloudDownload,
  VscSettings,
  VscChevronDown,
  VscFilter,
  VscCheck,
  VscError,
  VscWarning,
  VscSync
} from "react-icons/vsc";
import { cn } from "@/lib/utils";

interface Extension {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  publisher: string;
  downloads: number;
  rating: number;
  ratingCount: number;
  category: string;
  installed: boolean;
  enabled: boolean;
  icon?: string;
  tags: string[];
}

interface ExtensionsPanelProps {
  className?: string;
}

const mockExtensions: Extension[] = [
  {
    id: "ms-vscode.vscode-typescript-next",
    name: "typescript-next",
    displayName: "TypeScript Importer",
    description: "Automatically searches for TypeScript definitions in workspace files",
    version: "4.4.0",
    publisher: "Microsoft",
    downloads: 25000000,
    rating: 4.8,
    ratingCount: 1250,
    category: "Programming Languages",
    installed: true,
    enabled: true,
    tags: ["typescript", "javascript", "imports"]
  },
  {
    id: "esbenp.prettier-vscode",
    name: "prettier-vscode",
    displayName: "Prettier - Code formatter",
    description: "Code formatter using prettier",
    version: "10.1.0",
    publisher: "Prettier",
    downloads: 32000000,
    rating: 4.9,
    ratingCount: 2100,
    category: "Formatters",
    installed: true,
    enabled: true,
    tags: ["formatter", "prettier", "javascript", "typescript"]
  },
  {
    id: "bradlc.vscode-tailwindcss",
    name: "vscode-tailwindcss",
    displayName: "Tailwind CSS IntelliSense",
    description: "Intelligent Tailwind CSS tooling for VS Code",
    version: "0.10.0",
    publisher: "Tailwind Labs",
    downloads: 5500000,
    rating: 4.7,
    ratingCount: 890,
    category: "Other",
    installed: true,
    enabled: false,
    tags: ["css", "tailwind", "intellisense", "autocomplete"]
  },
  {
    id: "ms-vscode.vscode-json",
    name: "vscode-json",
    displayName: "JSON Language Features",
    description: "Provides rich language support for JSON files",
    version: "1.0.0",
    publisher: "Microsoft",
    downloads: 45000000,
    rating: 4.6,
    ratingCount: 780,
    category: "Programming Languages",
    installed: false,
    enabled: false,
    tags: ["json", "language", "support"]
  },
];

const categories = [
  "All",
  "Programming Languages", 
  "Formatters",
  "Debuggers",
  "Themes",
  "Other"
];

export function ExtensionsPanel({ className }: ExtensionsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"relevance" | "downloads" | "rating" | "name">("relevance");
  const [showInstalled, setShowInstalled] = useState(false);
  const [showEnabled, setShowEnabled] = useState(false);

  const filteredExtensions = useMemo(() => {
    let filtered = mockExtensions;

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(ext => 
        ext.displayName.toLowerCase().includes(search) ||
        ext.description.toLowerCase().includes(search) ||
        ext.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(ext => ext.category === selectedCategory);
    }

    // Filter by installed/enabled status
    if (showInstalled) {
      filtered = filtered.filter(ext => ext.installed);
    }
    if (showEnabled) {
      filtered = filtered.filter(ext => ext.enabled);
    }

    // Sort extensions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "downloads":
          return b.downloads - a.downloads;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.displayName.localeCompare(b.displayName);
        default:
          return 0; // relevance - keep original order
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, showInstalled, showEnabled]);

  const formatDownloads = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<VscStarFull key={i} className="h-3 w-3 text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<VscStarFull key={i} className="h-3 w-3 text-yellow-500" />);
      } else {
        stars.push(<VscStarEmpty key={i} className="h-3 w-3 text-gray-600" />);
      }
    }

    return stars;
  };

  const toggleExtension = (extensionId: string) => {
    console.log("Toggle extension:", extensionId);
  };

  const installExtension = (extensionId: string) => {
    console.log("Install extension:", extensionId);
  };

  return (
    <div className={cn("flex h-full w-96 flex-col bg-[#252526] text-gray-300", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-widest border-b border-[#2c2c2c]">
        <div className="flex items-center space-x-2">
          <VscExtensions className="h-4 w-4" />
          <span>Extensions</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            className="p-1 rounded hover:bg-[#37373d]"
            title="Refresh Extensions"
          >
            <VscSync className="h-3 w-3" />
          </button>
          <VscChevronDown className="h-3 w-3" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3 space-y-3 border-b border-[#2c2c2c]">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Extensions in Marketplace"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded bg-[#1e1e1e] pl-8 pr-2 py-2 text-sm text-gray-300 placeholder-gray-500 border border-[#3c3c3c] focus:border-blue-500 focus:outline-none"
          />
          <VscSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <VscFilter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 text-sm text-gray-300"
            title="Filter by category"
            aria-label="Filter extensions by category"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Sort and View Options */}
        <div className="flex items-center justify-between space-x-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1 text-xs text-gray-300"
              title="Sort extensions"
              aria-label="Sort extensions by"
            >
              <option value="relevance">Relevance</option>
              <option value="downloads">Downloads</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowInstalled(!showInstalled)}
              className={cn(
                "px-2 py-1 rounded text-xs transition-colors",
                showInstalled ? "bg-blue-600 text-white" : "hover:bg-[#37373d] text-gray-400"
              )}
            >
              Installed
            </button>
            <button
              onClick={() => setShowEnabled(!showEnabled)}
              className={cn(
                "px-2 py-1 rounded text-xs transition-colors",
                showEnabled ? "bg-blue-600 text-white" : "hover:bg-[#37373d] text-gray-400"
              )}
            >
              Enabled
            </button>
          </div>
        </div>
      </div>

      {/* Extensions List */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {filteredExtensions.map((extension) => (
            <motion.div
              key={extension.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 p-3 rounded border border-[#2c2c2c] hover:border-[#3c3c3c] hover:bg-[#2a2d2e] transition-colors"
            >
              {/* Extension Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded bg-[#1e1e1e] border border-[#3c3c3c] flex items-center justify-center">
                    <VscExtensions className="h-6 w-6 text-blue-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-200 truncate">
                      {extension.displayName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {extension.publisher} • v{extension.version}
                    </p>
                  </div>
                </div>

                {/* Extension Actions */}
                <div className="flex items-center space-x-1 ml-2">
                  {extension.installed ? (
                    <>
                      <button
                        onClick={() => toggleExtension(extension.id)}
                        className={cn(
                          "p-1.5 rounded text-xs font-medium transition-colors",
                          extension.enabled
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        )}
                        title={extension.enabled ? "Disable Extension" : "Enable Extension"}
                      >
                        {extension.enabled ? (
                          <>
                            <VscError className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <VscCheck className="h-4 w-4" />
                          </>
                        )}
                      </button>
                      
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        extension.enabled 
                          ? "bg-green-800 text-green-200"
                          : "bg-gray-700 text-gray-300"
                      )}>
                        {extension.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </>
                  ) : (
                    <button
                      onClick={() => installExtension(extension.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
                    >
                      <VscCloudDownload className="h-3 w-3" />
                      <span>Install</span>
                    </button>
                  )}
                  
                  <button
                    className="p-1.5 rounded hover:bg-[#37373d] transition-colors"
                    title="Extension Settings"
                  >
                    <VscSettings className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Extension Description */}
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {extension.description}
              </p>

              {/* Extension Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(extension.rating)}
                    <span>({extension.ratingCount})</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <VscCloudDownload className="h-3 w-3" />
                    <span>{formatDownloads(extension.downloads)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="px-2 py-1 bg-[#37373d] rounded">
                    {extension.category}
                  </span>
                </div>
              </div>

              {/* Extension Tags */}
              {extension.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {extension.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-[#1e1e1e] rounded text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                  {extension.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 text-xs text-gray-500">
                      +{extension.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredExtensions.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-sm">
            <VscExtensions className="h-12 w-12 mx-auto mb-4 opacity-50" />
            No extensions found
            {searchTerm && (
              <div className="mt-2">
                Try different search terms or filters
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
