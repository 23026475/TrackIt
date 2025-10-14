"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth } from "@/app/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "projects"),
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const projectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
    };

    fetchProjects();
  }, []);

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-accent";
      case 2:
        return "bg-primary";
      case 3:
        return "bg-secondary";
      case 4:
        return "bg-hover";
      default:
        return "bg-muted";
    }
  };

  if (!projects.length) {
    return (
      <div className="p-6 text-center text-text-muted dark:text-text-muted-dark relative min-h-[70vh]">
        <p>No projects found. Create one to get started 🚀</p>
        <button
          className="fixed bottom-8 right-8 bg-primary dark:bg-primary-dark hover:bg-hover dark:hover:bg-hover-dark text-text-dark dark:text-text-dark p-4 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => router.push("/dashboard/projects/add")}
        >
          <PlusCircleIcon size={28} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-surface-alt dark:bg-surface-alt-dark min-h-full transition-colors relative">
      <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
        All Projects
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="relative rounded-xl shadow-md bg-surface dark:bg-surface-dark border border-border-muted dark:border-border-dark transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer overflow-hidden"
            onClick={() =>
              setExpandedId(expandedId === project.id ? null : project.id)
            }
          >
            {/* Tier Tag */}
            <div
              className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full text-white ${getTierColor(
                project.tierLevel
              )}`}
            >
              Tier {project.tierLevel}
            </div>

            {/* Optional Banner */}
            {project.bannerUrl && (
              <img
                src={project.bannerUrl}
                alt={`${project.name} banner`}
                className="w-full h-32 object-cover rounded-t-xl"
              />
            )}

            {/* Content */}
            <div className="p-5">
              <h2 className="text-lg font-bold text-text dark:text-text-dark mb-1">
                {project.name}
              </h2>

              <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">
                Due:{" "}
                {project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>

              <AnimatePresence>
                {expandedId === project.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 text-sm text-text-muted dark:text-text-muted-dark space-y-2 overflow-hidden"
                  >
                    <p>
                      <strong>Description:</strong>{" "}
                      {project.description || "No description"}
                    </p>
                    <p>
                      <strong>Priority:</strong> {project.priority}
                    </p>
                    <p>
                      <strong>Type:</strong> {project.type}
                    </p>
                    <p>
                      <strong>Tech Stack:</strong>{" "}
                      {project.techStack?.join(", ") || "None"}
                    </p>
                    <p>
                      <strong>Comments:</strong>{" "}
                      {project.comment || "No comments yet."}
                    </p>
                    {project.repoLinks?.length > 0 && (
                      <p>
                        <strong>Repo:</strong>{" "}
                        <a
                          href={project.repoLinks[0]}
                          target="_blank"
                          className="text-primary dark:text-primary-dark hover:underline"
                        >
                          View on GitHub
                        </a>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-8 right-8 bg-primary dark:bg-primary-dark hover:bg-hover dark:hover:bg-hover-dark text-text-dark dark:text-text-dark p-4 rounded-full shadow-lg flex items-center justify-center"
        onClick={() => router.push("/dashboard/projects/add")}
      >
        <PlusCircleIcon size={28} />
      </button>
    </div>
  );
}
