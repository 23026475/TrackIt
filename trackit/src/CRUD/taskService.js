import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "../firebase";

// Add Task
export const addTask = async (userId, taskData) => {
  const tasksRef = collection(db, `users/${userId}/tasks`);
  await addDoc(tasksRef, taskData);
};

// Get All Tasks
export const getTasks = async (userId) => {
  const tasksRef = collection(db, `users/${userId}/tasks`);
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update Task
export const updateTask = async (userId, taskId, updatedData) => {
  const docRef = doc(db, `users/${userId}/tasks/${taskId}`);
  await updateDoc(docRef, updatedData);
};

// Delete Task
export const deleteTask = async (userId, taskId) => {
  const docRef = doc(db, `users/${userId}/tasks/${taskId}`);
  await deleteDoc(docRef);
};
