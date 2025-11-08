import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">AnalytIQ Hub</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#pricing">Pricing</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-24">
          <div className="mx-auto max-w-[980px] text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Transform Your Data Into
              <span className="text-primary"> Actionable Insights</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Upload, explore, and visualize datasets from multiple sources with AI-powered analytics,
              customizable dashboards, and automated reporting. Make data-driven decisions with confidence.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/login">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-[980px] text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need for Data Analysis
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Comprehensive tools for data processing, visualization, and AI-powered insights
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-lg bg-primary/10 p-3">
                  {/* Icon placeholder */}
                  <div className="h-8 w-8 rounded bg-primary/20"></div>
                </div>
                <h3 className="text-xl font-semibold">Multi-Source Data Upload</h3>
                <p className="mt-2 text-muted-foreground">
                  Connect Excel, CSV, SQL databases, and cloud storage platforms
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-lg bg-primary/10 p-3">
                  {/* Icon placeholder */}
                  <div className="h-8 w-8 rounded bg-primary/20"></div>
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Analytics</h3>
                <p className="mt-2 text-muted-foreground">
                  Predictive analytics, anomaly detection, and automated insights
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-lg bg-primary/10 p-3">
                  {/* Icon placeholder */}
                  <div className="h-8 w-8 rounded bg-primary/20"></div>
                </div>
                <h3 className="text-xl font-semibold">Customizable Dashboards</h3>
                <p className="mt-2 text-muted-foreground">
                  Drag-and-drop dashboard builder with real-time data updates
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-lg bg-primary/10 p-3">
                  {/* Icon placeholder */}
                  <div className="h-8 w-8 rounded bg-primary/20"></div>
                </div>
                <h3 className="text-xl font-semibold">Automated Reports</h3>
                <p className="mt-2 text-muted-foreground">
                  Schedule and generate comprehensive reports automatically
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-lg bg-primary/10 p-3">
                  {/* Icon placeholder */}
                  <div className="h-8 w-8 rounded bg-primary/20"></div>
                </div>
                <h3 className="text-xl font-semibold">Enterprise Security</h3>
                <p className="mt-2 text-muted-foreground">
                  Role-based access control and data encryption
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-lg bg-primary/10 p-3">
                  {/* Icon placeholder */}
                  <div className="h-8 w-8 rounded bg-primary/20"></div>
                </div>
                <h3 className="text-xl font-semibold">Multi-Language Support</h3>
                <p className="mt-2 text-muted-foreground">
                  Global accessibility with support for multiple languages
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container">
            <div className="mx-auto max-w-[980px] text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Transform Your Data Analysis?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of businesses making data-driven decisions with AnalytIQ Hub
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/auth/register">Start Your Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold">AnalytIQ Hub</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comprehensive data analytics platform for modern businesses
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AnalytIQ Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}