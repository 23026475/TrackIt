"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCardProps {
  project: any;
  getTierColor: (tier: number) => string;
}

export default function ProjectCard({ project, getTierColor }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [isExpanded]);

  return (
    <div className="relative">
      {/* Card Header */}
      <motion.div
        className="relative rounded-xl shadow-md bg-surface dark:bg-surface-dark border border-border-muted dark:border-border-dark transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer overflow-hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Tier Tag */}
        <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full text-white ${getTierColor(project.tierLevel)}`}>
          Tier {project.tierLevel}
        </div>

        {/* Optional Banner */}
        {project.bannerUrl && (
          <img src={project.bannerUrl} alt={`${project.name} banner`} className="w-full h-32 object-cover rounded-t-xl" />
        )}

        {/* Basic Info */}
        <div className="p-5">
          <h2 className="text-lg font-bold text-text dark:text-text-dark mb-1">{project.name}</h2>
          <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">
            Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}
          </p>
        </div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: contentHeight }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 w-full z-10 bg-surface dark:bg-surface-dark border border-border-muted dark:border-border-dark rounded-xl mt-2 p-5 shadow-lg"
          >
            <div ref={contentRef} className="space-y-2 text-text-muted dark:text-text-muted-dark">
              <p><strong>Description:</strong> {project.description || "No description"}</p>
              <p><strong>Priority:</strong> {project.priority}</p>
              <p><strong>Type:</strong> {project.type}</p>
              <p><strong>Tech Stack:</strong> {project.techStack?.join(", ") || "None"}</p>
              <p><strong>Comments:</strong> {project.comment || "No comments yet."}</p>
              {project.repoLinks?.length > 0 && (
                <p>
                  <strong>Repo:</strong>{" "}
                  <a href={project.repoLinks[0]} target="_blank" className="text-primary dark:text-primary-dark hover:underline">
                    View on GitHub
                  </a>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
