import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

// Create a new project with its first milestone
export const createProject = async (userId: string, projectData: any) => {
  const projectRef = doc(collection(db, "projects"));
  const milestoneRef = doc(collection(projectRef, "milestones"));

  await setDoc(projectRef, {
    name: projectData.name,
    tierLevel: projectData.tierLevel,
    techStack: projectData.techStack || [],
    repoLinks: projectData.repoLinks || [],
    status: "in-progress",
    currentMilestone: milestoneRef.id,
    createdAt: serverTimestamp(),
    ownerId: userId,
  });

  await setDoc(milestoneRef, {
    title: projectData.milestoneTitle || "Initial Build",
    description: projectData.description || "",
    createdAt: serverTimestamp(),
    status: "in-progress",
  });

  return { projectId: projectRef.id, milestoneId: milestoneRef.id };
};

// Restore a project from history by adding a new milestone
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

  return milestoneRef.id;
};
