"use client";

import { useState, type ReactNode } from "react";
import {
  VscFiles,
  VscSearch,
  VscSourceControl,
  VscExtensions,
  VscGear,
} from "react-icons/vsc";

type FileKey = "about.tsx" | "projects.tsx" | "contact.tsx";

const fileContent: Record<FileKey, ReactNode> = {
  "about.tsx": (
    <div className="space-y-2 font-mono">
      <p className="text-green-400">{"// Welcome to CodeStorm Hub"}</p>
      <p>
        <span className="text-purple-400">const</span> developer ={' '}
        <span className="text-yellow-300">{`{ name: "CodeStorm", role: "Full Stack Developer" }`}</span>;
      </p>
      <p className="text-gray-400">
        {"// Passionate about building interactive web experiences."}
      </p>
    </div>
  ),
  "projects.tsx": (
    <div className="space-y-2 font-mono">
      <p className="text-gray-400">{"// Selected projects"}</p>
      <ul className="list-disc pl-6">
        <li>
          <a
            className="text-blue-400 underline"
            href="https://github.com/codestormhub"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repositories
          </a>
        </li>
        <li>Portfolio Website</li>
        <li>Open-source Contributions</li>
      </ul>
    </div>
  ),
  "contact.tsx": (
    <div className="space-y-2 font-mono">
      <p className="text-gray-400">{"// Get in touch"}</p>
      <p>
        Email:{' '}
        <a
          className="text-blue-400 underline"
          href="mailto:codestormhub@example.com"
        >
          codestormhub@example.com
        </a>
      </p>
      <p>
        Twitter:{' '}
        <a
          className="text-blue-400 underline"
          href="https://twitter.com/codestormhub"
          target="_blank"
          rel="noreferrer"
        >
          @codestormhub
        </a>
      </p>
    </div>
  ),
};

export default function VSCodeLayout() {
  const [active, setActive] = useState<FileKey>("about.tsx");

  return (
    <div className="flex h-screen text-sm text-gray-300">
      {/* Activity Bar */}
      <div className="flex w-12 flex-col items-center space-y-4 bg-[#333333] py-4 text-xl">
        <VscFiles />
        <VscSearch />
        <VscSourceControl />
        <VscExtensions />
        <div className="mt-auto">
          <VscGear />
        </div>
      </div>

      {/* Explorer */}
      <div className="w-60 bg-[#252526]">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Explorer
        </div>
        <ul>
          {(Object.keys(fileContent) as FileKey[]).map((file) => (
            <li
              key={file}
              onClick={() => setActive(file)}
              className={`cursor-pointer px-3 py-1 hover:bg-[#2a2d2e] ${
                active === file ? "bg-[#37373d]" : ""
              }`}
            >
              {file}
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div className="flex flex-1 flex-col bg-[#1e1e1e]">
        {/* Tab bar */}
        <div className="flex border-b border-[#333]">
          <div className="bg-[#1e1e1e] px-4 py-2">{active}</div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">{fileContent[active]}</div>

        {/* Status Bar */}
        <div className="bg-[#007acc] px-4 py-1 text-xs text-white">
          CodeStorm Hub
        </div>
      </div>
    </div>
  );
}

