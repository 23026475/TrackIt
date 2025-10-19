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
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

      // Show popup instead of message inline
      setShowPopup(true);

    } catch (error: any) {
      console.error("Error adding project:", error);
      setMessage("❌ Failed to add project. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
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
    setShowPopup(false);
  };

  const handleGoBack = () => {
    window.location.href = "/projects";
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-surface-alt dark:bg-surface-alt-dark text-text dark:text-text-dark rounded-2xl shadow-lg relative">
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
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
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
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
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
            min={new Date().toISOString().split("T")[0]}
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
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
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
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
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
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
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
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
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
            placeholder="https://github.com/..."
          />
        </div>

        {/* Banner URL */}
        <div>
          <label className="block mb-1">Banner Image URL (optional)</label>
          <input
            type="url"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleChange}
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
            placeholder="https://example.com/banner.png"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block mb-1">Initial Comment / Notes</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="w-full p-2 rounded bg-surface dark:bg-surface-dark border border-border-muted"
            placeholder="Any important notes..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded mt-3 text-white bg-primary hover:bg-primary-dark"
        >
          {loading ? "Adding..." : "Add Project"}
        </button>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-alt dark:bg-surface-alt-dark p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">✅ Project added successfully!</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAddAnother}
                className="bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded"
              >
                Add Another Project
              </button>
              <button
                onClick={handleGoBack}
                className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded"
              >
                Go Back to Projects
              </button>
            </div>
          </div>
        </div>
      )}

      {message && !showPopup && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
