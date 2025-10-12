"use client";

export default function SettingsPage() {
  return (
    <div className="p-6 bg-surface-alt dark:bg-surface-alt-dark min-h-full transition-colors">
      <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-4">
        Settings
      </h1>
      <p className="text-text-muted dark:text-text-muted-dark">
        Customize your profile and preferences.
      </p>

      {/* Example setting */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-surface shadow-sm dark:bg-surface-dark transition-colors">
          <span className="text-text dark:text-text-dark">Enable notifications</span>
          <input type="checkbox" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-surface shadow-sm dark:bg-surface-dark transition-colors">
          <span className="text-text dark:text-text-dark">Dark Mode</span>
          <input type="checkbox" checked readOnly />
        </div>
      </div>
    </div>
  );
}
