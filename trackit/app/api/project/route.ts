// app/api/projects/route.ts
import { db } from "@/app/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET all projects
export async function GET() {
  const snapshot = await getDocs(collection(db, "projects"));
  const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(projects);
}

// POST new project
export async function POST(req: Request) {
  const data = await req.json();
  const docRef = await addDoc(collection(db, "projects"), data);
  return NextResponse.json({ id: docRef.id, ...data });
}
