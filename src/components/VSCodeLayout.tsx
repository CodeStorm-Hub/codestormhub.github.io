"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityBar, type ActivityPanel } from "@/components/ide/ActivityBar";
import { FileExplorer } from "@/components/ide/FileExplorer";
import { SearchPanel } from "@/components/ide/SearchPanel";
import { GitPanel } from "@/components/ide/GitPanel";
import { DebugPanel } from "@/components/ide/DebugPanel";
import { ExtensionsPanel } from "@/components/ide/ExtensionsPanel";
import { TabBar } from "@/components/ide/TabBar";
import { CodeEditor } from "@/components/ide/CodeEditor";
import { Terminal } from "@/components/ide/Terminal";
import { fileSystemData } from "@/lib/data";
import { FileSystemItem, Tab } from "@/types";
import { cn } from "@/lib/utils";
import { VscMenu, VscClose } from "react-icons/vsc";

interface VSCodeLayoutProps {
  children?: ReactNode;
}

export default function VSCodeLayout({ children }: VSCodeLayoutProps) {
  const [activePanel, setActivePanel] = useState<ActivityPanel>("files");
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: "welcome", 
      title: "Welcome", 
      path: "/welcome", 
      isActive: true, 
      isDirty: false 
    }
  ]);
  const [activeTab, setActiveTab] = useState<string>("welcome");
  const [activeFile, setActiveFile] = useState<FileSystemItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleFileSelect = (file: FileSystemItem) => {
    if (file.type === "file") {
      // Check if tab already exists
      const existingTab = tabs.find(tab => tab.id === file.id);
      
      if (existingTab) {
        // Switch to existing tab
        setActiveTab(file.id);
        setActiveFile(file);
      } else {
        // Create new tab
        const newTab: Tab = {
          id: file.id,
          title: file.name,
          path: file.path,
          isActive: false,
          isDirty: false
        };
        
        // Update tabs - deactivate current active tab and add new one
        const updatedTabs = tabs.map(tab => ({ ...tab, isActive: false }));
        setTabs([...updatedTabs, newTab]);
        setActiveTab(file.id);
        setActiveFile(file);
      }
      
      // Close mobile sidebar when file is selected
      setIsMobileSidebarOpen(false);
    }
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setTabs(tabs.map(tab => ({ 
      ...tab, 
      isActive: tab.id === tabId 
    })));
    
    if (tabId === "welcome") {
      setActiveFile(null);
    } else {
      // Find file in fileSystemData
      const findFile = (items: FileSystemItem[]): FileSystemItem | null => {
        for (const item of items) {
          if (item.id === tabId) return item;
          if (item.children) {
            const found = findFile(item.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const file = findFile(fileSystemData);
      setActiveFile(file);
    }
  };

  const handleTabClose = (tabId: string) => {
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);
    
    if (activeTab === tabId) {
      // Switch to the last remaining tab or welcome
      const newActiveTab = updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1] : null;
      if (newActiveTab) {
        setActiveTab(newActiveTab.id);
        handleTabSelect(newActiveTab.id);
      } else {
        setActiveTab("welcome");
        setActiveFile(null);
      }
    }
  };

  const handleFileChange = (file: FileSystemItem, content: string) => {
    // Mark tab as dirty
    setTabs(tabs.map(tab => 
      tab.id === file.id ? { ...tab, isDirty: true } : tab
    ));
  };

  const handleTabSave = (tabId: string) => {
    // Mark tab as clean
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, isDirty: false } : tab
    ));
  };

  const renderSidePanel = () => {
    if (!activePanel) return null;

    switch (activePanel) {
      case "files":
        return (
          <FileExplorer 
            files={fileSystemData}
            onFileSelect={handleFileSelect}
          />
        );
      case "search":
        return (
          <SearchPanel 
            files={fileSystemData}
            onFileSelect={handleFileSelect}
          />
        );
      case "git":
        return <GitPanel />;
      case "debug":
        return <DebugPanel />;
      case "extensions":
        return <ExtensionsPanel />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <p>Settings Panel</p>
            </div>
          </div>
        );
    }
  };

  const renderMainContent = () => {
    if (activeTab === "welcome" || !activeFile) {
      return (
        <div className="flex-1 bg-[#1e1e1e] overflow-auto">
          <main id="main-content" className="p-4 md:p-8 h-full min-h-screen">
            {children || (
              <div className="text-center text-gray-400 mt-8 md:mt-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white">
                    Welcome to CodeStorm Hub
                  </h1>
                  <p className="text-sm md:text-lg mb-8">
                    Professional portfolio and development showcase
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <motion.div 
                      className="bg-[#252526] p-6 rounded-lg border border-[#3c3c3c]"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <h3 className="text-xl font-semibold mb-3 text-blue-400">
                        🎯 Professional Projects
                      </h3>
                      <p className="text-gray-400">
                        Explore my latest work and professional development projects
                      </p>
                    </motion.div>
                    <motion.div 
                      className="bg-[#252526] p-6 rounded-lg border border-[#3c3c3c]"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <h3 className="text-xl font-semibold mb-3 text-green-400">
                        🛠️ Technical Skills
                      </h3>
                      <p className="text-gray-400">
                        Full-stack development with modern technologies
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}
          </main>
        </div>
      );
    }

    return (
      <CodeEditor
        file={activeFile}
        onFileChange={handleFileChange}
        onClose={() => handleTabClose(activeFile.id)}
      />
    );
  };

  return (
    <div className="h-screen flex bg-[#1e1e1e] text-white overflow-hidden">
      {/* Activity Bar - Hidden on mobile, visible on tablet+ */}
      <div className="hidden md:block">
        <ActivityBar 
          activePanel={activePanel}
          onPanelChange={setActivePanel}
        />
      </div>

      {/* Mobile Menu Button - Shown only on mobile */}
      <motion.button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#2c2c2c] hover:bg-[#37373d] rounded-md border border-[#3c3c3c] transition-colors"
        aria-label="Toggle IDE Explorer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileSidebarOpen ? (
          <VscClose className="w-5 h-5" />
        ) : (
          <VscMenu className="w-5 h-5" />
        )}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile overlay or desktop fixed */}
      <AnimatePresence>
        {sidebarVisible && activePanel && (
          <motion.div 
            className={cn(
              "bg-[#252526] border-r border-[#3c3c3c] flex flex-col",
              "md:relative md:translate-x-0",
              isMobileSidebarOpen 
                ? "fixed top-0 left-0 h-full z-50" 
                : "hidden md:flex"
            )}
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Mobile close button */}
            <motion.button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden self-end p-2 m-2 hover:bg-[#37373d] rounded"
              aria-label="Close Explorer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <VscClose className="w-5 h-5" />
            </motion.button>
            
            {renderSidePanel()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Full width on mobile, flex-1 on desktop */}
      <div className="flex-1 flex flex-col w-full md:w-auto min-w-0">
        {/* Tab Bar */}
        <TabBar 
          tabs={tabs}
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
          onTabSave={handleTabSave}
        />

        {/* Editor/Content Area */}
        {renderMainContent()}

        {/* Terminal */}
        <AnimatePresence>
          {isTerminalOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Terminal 
                isOpen={isTerminalOpen}
                onToggle={() => setIsTerminalOpen(!isTerminalOpen)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal Toggle Button - Only show when terminal is closed */}
        {!isTerminalOpen && (
          <motion.button
            onClick={() => setIsTerminalOpen(true)}
            className="fixed bottom-4 right-4 p-3 bg-[#007acc] hover:bg-[#005a9e] rounded-lg shadow-lg transition-colors z-30"
            title="Open Terminal"
            aria-label="Open Terminal"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-semibold">⚡</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}