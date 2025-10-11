import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  const snapshot = await getDocs(collection(db, "projects"));
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return Response.json({ success: true, projects });
}
