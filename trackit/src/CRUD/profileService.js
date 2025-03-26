import { db, doc, setDoc, getDoc, updateDoc, collection } from "../firebase";

// Get User Profile Settings
export const getUserSettings = async (userId) => {
  const docRef = doc(db, `users/${userId}/profile/settings`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Update User Settings
export const updateUserSettings = async (userId, newSettings) => {
  const docRef = doc(db, `users/${userId}/profile/settings`);
  await updateDoc(docRef, newSettings);
};

// Get User Progress
export const getUserProgress = async (userId) => {
  const docRef = doc(db, `users/${userId}/profile/progress`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Update User Progress
export const updateUserProgress = async (userId, newProgress) => {
  const docRef = doc(db, `users/${userId}/profile/progress`);
  await updateDoc(docRef, newProgress);
};
export const getProjects = async (userId) => {
  const projectsRef = collection(db, `users/${userId}/projects`);
  const querySnapshot = await getDocs(projectsRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};