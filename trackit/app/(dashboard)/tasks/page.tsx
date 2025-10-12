"use client";

export default function TasksPage() {
  return (
    <div className="p-6 bg-surface-alt dark:bg-surface-alt-dark min-h-full transition-colors">
      <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
        Tasks
      </h1>
      <p className="text-text-muted dark:text-text-muted-dark">
        Manage all your tasks here.
      </p>

      {/* Example task list */}
      <ul className="mt-6 space-y-2">
        <li className="p-3 rounded-lg bg-surface shadow-sm dark:bg-surface-dark transition-colors">
          <input type="checkbox" className="mr-2" />
          Complete Task 1
        </li>
        <li className="p-3 rounded-lg bg-surface shadow-sm dark:bg-surface-dark transition-colors">
          <input type="checkbox" className="mr-2" />
          Complete Task 2
        </li>
      </ul>
    </div>
  );
}
