"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/app/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "lucide-react";
import ProjectCard from "./ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
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

  return (
    <div className="bg-surface-alt dark:bg-surface-alt-dark min-h-full transition-colors relative">
      <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
        All Projects
      </h1>

      {!projects.length ? (
        <div className="text-center text-text-muted dark:text-text-muted-dark min-h-[70vh] flex flex-col justify-center items-center">
          <p>No projects found. Create one to get started 🚀</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} getTierColor={getTierColor} />
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        className="fixed bottom-8 right-8 bg-primary dark:bg-primary-dark hover:bg-hover dark:hover:bg-hover-dark text-text-dark dark:text-text-dark p-4 rounded-full shadow-lg flex items-center justify-center"
        onClick={() => router.push("/projects/add")}
      >
        <PlusCircleIcon size={28} />
      </button>
    </div>
  );
}
