import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// ✅ Create a new project with all details + first milestone
export const createProject = async (userId: string, projectData: any) => {
  const projectRef = doc(collection(db, "projects"));
  const milestoneRef = doc(collection(projectRef, "milestones"));

  // --- Project Document ---
  await setDoc(projectRef, {
    name: projectData.name,
    description: projectData.description || "",
    tierLevel: projectData.tierLevel || 1,
    dueDate: projectData.dueDate ? new Date(projectData.dueDate).toISOString() : null,
    priority: projectData.priority || "medium",
    type: projectData.type || "personal",
    techStack: projectData.techStack || [],
    repoLinks: projectData.repoLinks || [],
    bannerUrl: projectData.bannerUrl || null,
    comment: projectData.comment || "",
    status: "in-progress",
    currentMilestone: milestoneRef.id,
    createdAt: serverTimestamp(),
    ownerId: userId,
  });

  // --- Initial Milestone ---
  await setDoc(milestoneRef, {
    title: projectData.milestoneTitle || "Initial Build",
    description: projectData.description || "",
    createdAt: serverTimestamp(),
    status: "in-progress",
  });

  console.log("✅ Project + initial milestone created:", {
    projectId: projectRef.id,
    milestoneId: milestoneRef.id,
  });

  return { projectId: projectRef.id, milestoneId: milestoneRef.id };
};

// ✅ Restore a project by creating a new milestone
export const restoreProject = async (projectId: string, milestoneTitle: string) => {
  const projectRef = doc(db, "projects", projectId);
  const milestoneRef = doc(collection(projectRef, "milestones"));

  await setDoc(milestoneRef, {
    title: milestoneTitle,
    createdAt: serverTimestamp(),
    status: "in-progress",
  });

  await updateDoc(projectRef, {
    currentMilestone: milestoneRef.id,
    status: "in-progress",
  });

  console.log("♻️ Project restored with new milestone:", milestoneTitle);
  return milestoneRef.id;
};
