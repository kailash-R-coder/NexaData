import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">AnalytIQ Hub</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/upload">Upload Data</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboards">My Dashboards</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/analytics">Analytics</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/reports">Reports</Link>
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}