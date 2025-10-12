"use client";

import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const { projectId } = useParams(); // gets the dynamic param

  return (
    <div className="p-6 bg-surface-alt dark:bg-surface-alt-dark min-h-full transition-colors">
      <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
        Project Details
      </h1>
      <p className="text-text-muted dark:text-text-muted-dark">
        Viewing details for project ID: {projectId}
      </p>
    </div>
  );
}
