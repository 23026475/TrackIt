"use client";

import { useState } from "react";
import { auth } from "@/app/lib/firebase";
import { createProject } from "@/app/lib/firestore";

export default function AddProjectPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tierLevel: "1",
    dueDate: "",
    comment: "",
    priority: "medium",
    type: "personal",
    techStack: "",
    repoLink: "",
    bannerUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setMessage("You need to be signed in.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await createProject(user.uid, {
        name: formData.name,
        tierLevel: Number(formData.tierLevel),
        milestoneTitle: "Initial Build",
        description: formData.description,
        dueDate: formData.dueDate,
        comment: formData.comment,
        priority: formData.priority,
        type: formData.type,
        techStack: formData.techStack.split(",").map(t => t.trim()),
        repoLinks: [formData.repoLink],
        bannerUrl: formData.bannerUrl || null,
      });
      setMessage("✅ Project added successfully!");
      setFormData({
        name: "",
        description: "",
        tierLevel: "1",
        dueDate: "",
        comment: "",
        priority: "medium",
        type: "personal",
        techStack: "",
        repoLink: "",
        bannerUrl: "",
      });
    } catch (error: any) {
      console.error("Error adding project:", error);
      setMessage("❌ Failed to add project. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-6">Create a New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Name */}
        <div>
          <label className="block mb-1">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Briefly describe your project..."
          />
        </div>

        {/* Tier Level */}
        <div>
          <label className="block mb-1">Tier Level</label>
          <select
            name="tierLevel"
            value={formData.tierLevel}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="1">Tier 1</option>
            <option value="2">Tier 2</option>
            <option value="3">Tier 3</option>
            <option value="4">Tier 4</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            min={new Date().toISOString().split("T")[0]} // sets minimum to today
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Project Type */}
        <div>
          <label className="block mb-1">Project Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="client">Client</option>
            <option value="open-source">Open Source</option>
          </select>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block mb-1">Tech Stack (comma-separated)</label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Next.js, Firebase, Tailwind"
          />
        </div>

        {/* Repo Link */}
        <div>
          <label className="block mb-1">Repository Link</label>
          <input
            type="url"
            name="repoLink"
            value={formData.repoLink}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
            placeholder="https://github.com/..."
          />
        </div>

        {/* Optional Banner */}
        <div>
          <label className="block mb-1">Banner Image URL (optional)</label>
          <input
            type="url"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
            placeholder="https://example.com/banner.png"
          />
        </div>

        {/* Initial Comment */}
        <div>
          <label className="block mb-1">Initial Comment / Notes</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
            placeholder="Any important notes or goals for this project..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-3"
        >
          {loading ? "Adding..." : "Add Project"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
