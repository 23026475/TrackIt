import Link from 'next/link'
import { Code2, Layout, CheckSquare, ArrowRight, ChevronDown, Zap, Shield, Users } from 'lucide-react'
import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <LandingNavbar />
      
      {/* Hero Section - Add padding top to account for fixed navbar */}
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TrackIt
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Keep track of your personal development projects from idea to maintenance
          </p>
        </div>

        {/* Features Grid - Add id for navigation */}
        <div id="features" className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16 scroll-mt-20">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <Layout className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Project Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-300">
              View all your projects with filtering by priority, date, and progress
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <CheckSquare className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Kanban Board</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Drag-and-drop task management for each project
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <Code2 className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Tech Stack Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep track of technologies used in each project
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          <a
            href="#features-preview"
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-lg"
          >
            View Dashboard Preview
            <ChevronDown className="ml-2 h-5 w-5" />
          </a>
        </div>

        {/* Features Preview Section */}
        <div id="features-preview" className="mt-32 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            See TrackIt in Action
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Take a visual tour of TrackIt's key features before signing up
          </p>

          {/* Dashboard Preview */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Dashboard Overview</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">dashboard.preview</span>
              </div>
              <div className="p-6">
                {/* Mock Dashboard UI */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-32 bg-blue-200 dark:bg-blue-900 rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                        <div className="flex gap-2">
                          <div className="h-5 w-16 bg-yellow-200 dark:bg-yellow-900 rounded-full"></div>
                          <div className="h-5 w-16 bg-green-200 dark:bg-green-900 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    ⚡ This is a preview. Sign up to manage your real projects!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kanban Preview */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Kanban Board</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">kanban.preview</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {['To Do', 'In Progress', 'Review', 'Done'].map((column, idx) => (
                    <div key={column} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                      <div className="font-medium text-sm mb-3 text-gray-700 dark:text-gray-300">{column}</div>
                      <div className="space-y-2">
                        {idx === 0 && (
                          <>
                            <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                          </>
                        )}
                        {idx === 1 && (
                          <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 border-l-4 border-l-yellow-500">
                            <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        )}
                        {idx === 2 && (
                          <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 border-l-4 border-l-blue-500">
                            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        )}
                        {idx === 3 && (
                          <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 border-l-4 border-l-green-500 opacity-50">
                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    🎯 Drag and drop tasks, track progress visually
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details Preview */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Project Details & Tech Stack</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">project.preview</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-green-200 dark:bg-green-900 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Node.js', 'PostgreSQL'].map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Started: Jan 15, 2024</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Target: Mar 30, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    📊 Track deadlines, tech stack, and project progress in one place
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Start for free, upgrade as you grow
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Up to 3 projects</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Basic Kanban board</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="block text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-xl p-6 shadow-xl scale-105">
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <p className="text-3xl font-bold mb-4">$12<span className="text-sm font-normal text-blue-200">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>Advanced Kanban with sprints</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="block text-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Free Trial
                </Link>
              </div>

              {/* Team Plan */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold mb-2">Team</h3>
                <p className="text-3xl font-bold mb-4">$29<span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span></p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>Up to 10 team members</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Team permissions</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="block text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to start tracking your projects?
            </h3>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <LandingFooter />
    </main>
  )
}