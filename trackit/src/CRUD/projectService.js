import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '../firebaseConfig';

// Add Project
export const addProject = async (userId, projectData) => {
  const projectsRef = collection(db, `users/${userId}/projects`);

  console.log("📂 Adding project to:", `users/${userId}/projects`);
  
  try {
    const docRef = await addDoc(projectsRef, projectData);
    console.log("🎉 Project added successfully with ID:", docRef.id);
    return docRef.id; // Return the document ID for logging
  } catch (error) {
    console.error("⚠️ Firestore error:", error);
    throw error; // Re-throw for handling in the UI
  }
};

// Get All Projects
export const getProjects = async (userId) => {
  const projectsRef = collection(db, `users/${userId}/projects`);
  console.log("User ID:", userId);
  console.log("Project ID:", projectsRef);
  const snapshot = await getDocs(projectsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update Project
export const updateProject = async (userId, projectId, updatedData) => {
  const docRef = doc(db, `users/${userId}/projects/${projectId}`);
  await updateDoc(docRef, updatedData);
};

// Delete Project
export const deleteProject = async (userId, projectId) => {
  const docRef = doc(db, `users/${userId}/projects/${projectId}`);
  await deleteDoc(docRef);
};
