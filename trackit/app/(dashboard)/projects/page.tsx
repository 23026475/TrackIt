"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/app/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Github, Calendar, Layers } from "lucide-react";

interface Project {
  id: string;
  name: string;
  dueDate: string;
  tier: string;
  comments: string;
  techStack?: string;
  repoLink?: string;
  createdAt?: any;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "projects"),
          where("ownerId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const fetchedProjects: Project[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Project, "id">),
        }));

        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="p-6 bg-surface-alt dark:bg-surface-alt-dark min-h-screen transition-colors relative">
      <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
        Your Projects
      </h1>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No projects yet. Let’s get started!
          </p>
          <button
            onClick={() => router.push("/projects/add")}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition"
          >
            + Add Project
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.02 }}
              className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => console.log("Clicked project:", project.id)}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {project.name}
              </h2>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center mb-3">
                <Layers className="w-4 h-4 mr-1 text-gray-400" />
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    project.tier === "Tier 1"
                      ? "bg-green-100 text-green-800"
                      : project.tier === "Tier 2"
                      ? "bg-blue-100 text-blue-800"
                      : project.tier === "Tier 3"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {project.tier}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {project.comments || "No comments yet."}
              </p>

              {project.repoLink && (
                <a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm"
                >
                  <Github className="w-4 h-4 mr-1" /> Repo
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => router.push("/projects/add")}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-xl hover:scale-105 transition"
        aria-label="Add Project"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
