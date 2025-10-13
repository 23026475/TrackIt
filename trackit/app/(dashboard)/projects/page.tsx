"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/app/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";

// Project data from Firestore (without id)
interface Project {
  name: string;
  description?: string;
  tierLevel: number;
  dueDate?: string;
  priority?: string;
  type?: string;
}

// Project including Firestore document id
interface ProjectWithId extends Project {
  id: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "projects"),
        where("ownerId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const projectsData: ProjectWithId[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Project),
      }));
      setProjects(projectsData);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-6 bg-surface-alt dark:bg-surface-alt-dark min-h-full transition-colors">
      {/* Header + Add Project button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">All Projects</h1>
        <Link
          href="/projects/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Project
        </Link>
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-text-muted dark:text-text-muted-dark">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-text-muted dark:text-text-muted-dark">
          No projects found. Click "Add Project" to create your first project.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="p-4 bg-gray-700 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              {project.description && <p className="text-gray-300 mb-2">{project.description}</p>}
              <p className="text-gray-400 text-sm mb-1">Tier: {project.tierLevel}</p>
              {project.dueDate && <p className="text-gray-400 text-sm mb-1">Due: {project.dueDate}</p>}
              {project.priority && <p className="text-gray-400 text-sm mb-1">Priority: {project.priority}</p>}
              {project.type && <p className="text-gray-400 text-sm mb-1">Type: {project.type}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
