// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface dark:bg-surface-dark transition-colors duration-300">
      {children}
    </div>
  );
}
