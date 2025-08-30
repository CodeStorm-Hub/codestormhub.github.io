"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { VscSave, VscClose, VscCircleFilled } from "react-icons/vsc";
import { cn } from "@/lib/utils";
import { FileSystemItem } from "@/types";

interface CodeEditorProps {
  file: FileSystemItem | null;
  onFileChange: (file: FileSystemItem, content: string) => void;
  onClose: () => void;
  className?: string;
}

const getLanguage = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'scss':
    case 'sass':
      return 'scss';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'xml':
      return 'xml';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
      return 'bash';
    case 'docker':
      return 'dockerfile';
    default:
      return 'text';
  }
};

const generateSampleContent = (filename: string): string => {
  const language = getLanguage(filename);
  
  switch (language) {
    case 'typescript':
    case 'javascript':
      return `import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ${filename.split('.')[0].charAt(0).toUpperCase() + filename.split('.')[0].slice(1)}Props {
  title: string;
  isVisible: boolean;
  onToggle: () => void;
}

export const ${filename.split('.')[0].charAt(0).toUpperCase() + filename.split('.')[0].slice(1)} = ({ 
  title, 
  isVisible, 
  onToggle 
}: ${filename.split('.')[0].charAt(0).toUpperCase() + filename.split('.')[0].slice(1)}Props) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    console.log('Button clicked!');
    onToggle();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">Count: {count}</p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </motion.div>
  );
};

export default ${filename.split('.')[0].charAt(0).toUpperCase() + filename.split('.')[0].slice(1)};`;

    case 'python':
      return `#!/usr/bin/env python3
"""
${filename} - A sample Python module
"""

import os
import sys
from typing import List, Optional, Dict
from dataclasses import dataclass
from datetime import datetime

@dataclass
class User:
    id: int
    name: str
    email: str
    created_at: datetime
    is_active: bool = True

class UserManager:
    def __init__(self):
        self.users: Dict[int, User] = {}
        self.next_id = 1
    
    def create_user(self, name: str, email: str) -> User:
        """Create a new user and add to the system."""
        user = User(
            id=self.next_id,
            name=name,
            email=email,
            created_at=datetime.now()
        )
        self.users[user.id] = user
        self.next_id += 1
        return user
    
    def get_user(self, user_id: int) -> Optional[User]:
        """Retrieve a user by ID."""
        return self.users.get(user_id)
    
    def list_active_users(self) -> List[User]:
        """Get all active users."""
        return [user for user in self.users.values() if user.is_active]
    
    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate a user account."""
        if user_id in self.users:
            self.users[user_id].is_active = False
            return True
        return False

def main():
    """Main function to demonstrate usage."""
    manager = UserManager()
    
    # Create some users
    user1 = manager.create_user("Alice Johnson", "alice@example.com")
    user2 = manager.create_user("Bob Smith", "bob@example.com")
    
    # List active users
    active_users = manager.list_active_users()
    print(f"Active users: {len(active_users)}")
    
    for user in active_users:
        print(f"- {user.name} ({user.email})")

if __name__ == "__main__":
    main()`;

    case 'css':
    case 'scss':
      return `/* ${filename} - Main stylesheet */

:root {
  --primary-color: #007acc;
  --secondary-color: #1e1e1e;
  --text-color: #333;
  --bg-color: #ffffff;
  --border-color: #e0e0e0;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --border-radius: 4px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn:hover {
  background: darken(var(--primary-color), 10%);
  transform: translateY(-1px);
}

.btn--secondary {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn--secondary:hover {
  background: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .card {
    padding: 15px;
  }
}`;

    case 'json':
      return `{
  "name": "${filename.replace('.json', '')}",
  "version": "1.0.0",
  "description": "Sample configuration file",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write ."
  },
  "keywords": [
    "sample",
    "config",
    "json"
  ],
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "url": "https://yourwebsite.com"
  },
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "nodemon": "^3.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repository.git"
  },
  "bugs": {
    "url": "https://github.com/username/repository/issues"
  },
  "homepage": "https://github.com/username/repository#readme"
}`;

    case 'markdown':
      return `# ${filename.replace('.md', '').charAt(0).toUpperCase() + filename.replace('.md', '').slice(1)}

A comprehensive guide and documentation.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project provides a powerful and flexible solution for modern web development. It combines the best practices and latest technologies to deliver exceptional user experience.

### Key Features

- 🚀 **Fast Performance** - Optimized for speed and efficiency
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🎨 **Modern UI** - Clean and intuitive user interface
- 🔧 **Extensible** - Easy to customize and extend
- 🛡️ **Secure** - Built with security best practices

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/username/repository.git
   cd repository
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Usage

### Basic Example

\`\`\`javascript
import { Component } from './component';

const app = new Component({
  element: '#app',
  data: {
    title: 'Hello World',
    count: 0
  }
});

app.render();
\`\`\`

### Advanced Configuration

\`\`\`typescript
interface Config {
  apiUrl: string;
  debug: boolean;
  features: {
    analytics: boolean;
    darkMode: boolean;
  };
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  debug: process.env.NODE_ENV === 'development',
  features: {
    analytics: true,
    darkMode: true
  }
};
\`\`\`

## API Reference

### Methods

#### \`initialize(options)\`

Initializes the application with the given options.

**Parameters:**
- \`options\` (Object): Configuration options

**Returns:**
- Promise<void>

#### \`render()\`

Renders the application to the DOM.

**Returns:**
- void

### Events

#### \`onReady\`

Fired when the application is fully initialized.

#### \`onError\`

Fired when an error occurs.

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.`;

    default:
      return `Welcome to ${filename}!

This is a sample file to demonstrate the code editor functionality.
You can edit this content and see the changes reflected in real-time.

Some features included:
- Syntax highlighting
- Line numbers
- Auto-indentation
- Multiple language support
- Real-time editing

Start typing to see the editor in action!`;
  }
};

export function CodeEditor({ file, onFileChange, onClose, className }: CodeEditorProps) {
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (file) {
      const fileContent = file.content || generateSampleContent(file.name);
      setContent(fileContent);
      setIsDirty(false);
    }
  }, [file]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsDirty(true);
    if (file) {
      onFileChange(file, newContent);
    }
  };

  const handleSave = () => {
    // In a real implementation, this would save to the file system
    console.log("Saving file:", file?.name);
    setIsDirty(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!file) {
    return (
      <div className={cn("flex-1 flex items-center justify-center bg-[#1e1e1e] text-gray-500", className)}>
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-lg mb-2">No file selected</p>
          <p className="text-sm">Choose a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  const language = getLanguage(file.name);
  const lineCount = content.split('\n').length;

  return (
    <div className={cn("flex flex-col h-full bg-[#1e1e1e]", className)}>
      {/* File Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#2c2c2c] text-sm">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {isDirty && <VscCircleFilled className="h-2 w-2 text-white" />}
            <span className="text-gray-300">{file.name}</span>
          </div>
          {isDirty && (
            <span className="text-xs text-gray-500">• Unsaved changes</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {isDirty && (
            <button
              onClick={handleSave}
              className="p-1.5 rounded hover:bg-[#37373d] text-gray-400 hover:text-white transition-colors"
              title="Save (Ctrl+S)"
            >
              <VscSave className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#37373d] text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            <VscClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-[#1e1e1e] border-r border-[#2c2c2c] px-2 py-4 min-w-[50px] text-right text-xs text-gray-500 font-mono select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-6 h-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsEditing(false)}
              className="absolute inset-0 w-full h-full p-4 bg-transparent text-gray-300 font-mono text-sm leading-6 resize-none outline-none border-none font-fira-code tab-2"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              title="Code editor"
              aria-label={`Code editor for ${file.name}`}
            />
          ) : (
            <motion.div
              className="absolute inset-0 overflow-auto cursor-text"
              onClick={() => {
                setIsEditing(true);
                setTimeout(() => textareaRef.current?.focus(), 0);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  background: 'transparent',
                  fontSize: '14px',
                  lineHeight: '24px',
                  fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                }}
                showLineNumbers={false}
                wrapLines={true}
              >
                {content}
              </SyntaxHighlighter>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#007acc] text-white text-xs">
        <div className="flex items-center space-x-4">
          <span>Ln {content.substring(0, content.length).split('\n').length}, Col 1</span>
          <span>{language.toUpperCase()}</span>
          <span>UTF-8</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>{lineCount} lines</span>
          <span>{content.length} chars</span>
        </div>
      </div>
    </div>
  );
}
