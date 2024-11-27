export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <nav className="w-64 bg-gray-800 text-white p-4">
        {/* Sidebar navigation will go here */}
      </nav>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
