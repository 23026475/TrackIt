"use client";

import { useState } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Project = {
  id: string;
  name: string;
  description: string;
  tierLevel: number;
  dueDate: string;
  priority: string;
  type: string;
  techStack: string[];
  repoLinks: string[];
  bannerUrl?: string | null;
  comment?: string;
  tasks?: Task[];
};

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(project.tasks || []);
  const [newTask, setNewTask] = useState("");

  const toggleExpanded = () => setExpanded(!expanded);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const tierColors: Record<number, string> = {
    1: "border-blue-500",
    2: "border-green-500",
    3: "border-yellow-500",
    4: "border-red-500",
  };

  return (
    <div
      className={`border-l-4 ${tierColors[project.tierLevel] || "border-gray-400"} bg-surface-alt dark:bg-surface-alt-dark rounded-lg shadow-md mb-4 cursor-pointer transition hover:shadow-lg`}
    >
      <div className="p-4 flex justify-between items-center" onClick={toggleExpanded}>
        <div>
          <h2 className="text-lg font-semibold text-text dark:text-text-dark">{project.name || "Untitled Project"}</h2>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}
          </p>
        </div>
        <span className="text-xl">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="p-4 border-t border-muted dark:border-muted-dark">
          <p className="text-text dark:text-text-dark mb-2">{project.description || "No description provided."}</p>
          
          {project.comment && (
            <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">
              Notes: {project.comment}
            </p>
          )}

          <div className="mb-2">
            <strong>Priority:</strong> {project.priority}
          </div>
          <div className="mb-2">
            <strong>Type:</strong> {project.type}
          </div>
          <div className="mb-2">
            <strong>Tech Stack:</strong> {project.techStack.join(", ")}
          </div>
          {project.repoLinks.length > 0 && (
            <div className="mb-2">
              <strong>Repository:</strong>{" "}
              <a href={project.repoLinks[0]} target="_blank" className="text-primary dark:text-primary-dark underline">
                {project.repoLinks[0]}
              </a>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-semibold text-text dark:text-text-dark mb-2">Tasks</h3>
            {tasks.length === 0 && <p className="text-text-muted dark:text-text-muted-dark mb-2">No tasks yet.</p>}
            <ul className="mb-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    className="mr-2"
                  />
                  <span className={task.completed ? "line-through text-text-muted dark:text-text-muted-dark" : ""}>
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 p-1 rounded bg-gray-200 dark:bg-gray-700 text-text dark:text-text-dark"
              />
              <button
                onClick={addTask}
                className="px-3 py-1 bg-primary dark:bg-primary-dark text-white rounded hover:bg-primary-dark dark:hover:bg-primary"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
