"use client"
import type React from "react"
import { useState } from "react"
import {
  ChevronRightIcon,
  LockIcon,
  SparklesIcon,
  DatabaseIcon,
  UsersIcon,
  CloudIcon,
  CodeIcon,
  TerminalIcon,
  PlayIcon,
  ServerIcon,
} from "lucide-react"

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("")
  const [email, setEmail] = useState("")

  return (
    <div className="antialiased bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      {/* Header with enhanced animation */}
      <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20 shadow-sm dark:shadow-blue-900/20 animate-slide-in-top">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-xl transform transition-transform group-hover:rotate-360 group-hover:scale-110">
                O
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                Omniflow
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              {["Features", "Use Cases", "Pricing"].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors group"
                  onMouseEnter={() => setActiveSection(item)}
                  onMouseLeave={() => setActiveSection("")}
                >
                  {item}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${activeSection === item ? "w-full" : ""}`}
                  ></span>
                </a>
              ))}
            </nav>
            <div className="hidden md:block">
              <a
                href="/sandbox"
                className="px-5 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-md transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-primary/30 relative overflow-hidden group"
              >
                <span className="relative z-10">Start Building</span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with enhanced animations */}
      <main>
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="hero-blob absolute w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-full -z-10 -top-[200px] -right-[200px] animate-blob-extended"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full lg:w-1/2 mb-12 lg:mb-0 animate-slide-in-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                  Build AI Agents Without Coding
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl animate-slide-in-left delay-200">
                  Omniflow empowers you to create, customize, and deploy intelligent AI assistants with a simple
                  drag-and-drop interface.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-in-left delay-400">
                  <a
                    href="#cta"
                    className="px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-md transition-all transform hover:scale-105 text-center font-medium relative group overflow-hidden"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
                  </a>
                  <a
                    href="#features"
                    className="px-8 py-3 border border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary text-gray-800 dark:text-gray-200 rounded-md transition transform hover:scale-105 text-center font-medium group"
                  >
                    Learn More
                    <ChevronRightIcon className="inline-block ml-2 w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-slide-in-right">
                <div className="w-full max-w-md relative group">
                  <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 animate-floating">
                      <ChevronRightIcon className="h-24 w-24 text-primary/50 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with enhanced animations */}
        <section
          id="features"
          className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 transition-colors duration-500"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-slide-in">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                Powerful AI Agent Builder
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need to create intelligent, customized AI assistants without technical expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <SparklesIcon className="h-6 w-6 text-primary" />,
                  title: "No-Code Interface",
                  description:
                    "Drag-and-drop AI module builder that makes creating complex agents simple and intuitive.",
                  delay: "delay-100",
                },
                {
                  icon: <LockIcon className="h-6 w-6 text-primary" />,
                  title: "Secure & Compliant",
                  description: "Enterprise-grade security with data protection and compliance built into every agent.",
                  delay: "delay-200",
                },
                {
                  icon: <ChevronRightIcon className="h-6 w-6 text-primary" />,
                  title: "Full Customization",
                  description: "Tailor AI agents to match your brand, workflow, and specific business needs.",
                  delay: "delay-300",
                },
                {
                  icon: <DatabaseIcon className="h-6 w-6 text-primary" />,
                  title: "Advanced Analytics",
                  description:
                    "Gain insights into agent performance, user interactions, and optimization opportunities.",
                  delay: "delay-400",
                },
                {
                  icon: <CloudIcon className="h-6 w-6 text-primary" />,
                  title: "Seamless Integrations",
                  description: "Connect with popular third-party services and existing business tools effortlessly.",
                  delay: "delay-500",
                },
                {
                  icon: <UsersIcon className="h-6 w-6 text-primary" />,
                  title: "Collaborative Development",
                  description: "Team-based workflow for creating, testing, and deploying AI agents together.",
                  delay: "delay-600",
                },
              ].map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  animationDelay={feature.delay}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section with enhanced animations */}
        <section id="testimonials" className="py-20 transition-colors duration-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-slide-in">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                See how Omniflow is transforming AI automation across different industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  initials: "JS",
                  name: "Jane Smith",
                  role: "CEO, TechStart",
                  quote:
                    "Omniflow has revolutionized our customer support. We built a sophisticated AI agent in hours, not weeks.",
                  delay: "delay-100",
                },
                {
                  initials: "ML",
                  name: "Michael Lee",
                  role: "Product Manager, InnovateCo",
                  quote:
                    "The no-code interface is a game-changer. Our team can now create and iterate on AI agents without developer support.",
                  delay: "delay-300",
                },
                {
                  initials: "SR",
                  name: "Sarah Rodriguez",
                  role: "Operations Director, DesignHub",
                  quote:
                    "Omniflow's integration capabilities and customization options have truly transformed our workflow automation.",
                  delay: "delay-500",
                },
              ].map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  initials={testimonial.initials}
                  name={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                  animationDelay={testimonial.delay}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Sandbox Section */}
      <section
        id="sandbox"
        className="py-20 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-800 dark:to-blue-900 transition-colors duration-500"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              AI Agent Sandbox
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experiment and prototype your AI agents in real-time with our interactive development environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sandbox Interface */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg animate-slide-in-left">
              <div className="flex items-center mb-6">
                <CodeIcon className="h-8 w-8 text-primary mr-4" />
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Live Development</h3>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4 relative">
                <div className="flex items-center mb-2">
                  <TerminalIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">Agent Configuration</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
                  <code className="text-sm text-gray-700 dark:text-gray-300">
                    {
                      "const aiAgent = new OmniflowAgent({\n  name: 'CustomerSupport',\n  capabilities: ['chat', 'analyze']\n})"
                    }
                  </code>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="flex-1 bg-gradient-to-r from-primary to-primary-light text-white py-3 rounded-md hover:scale-105 transition-transform flex items-center justify-center">
                  <PlayIcon className="h-5 w-5 mr-2" /> Run Agent
                </button>
                <button className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-md hover:border-primary transition-colors flex items-center justify-center">
                  <ServerIcon className="h-5 w-5 mr-2" /> Deploy
                </button>
              </div>
            </div>

            {/* Agent Capabilities */}
            <div className="space-y-6 animate-slide-in-right">
              {[
                {
                  icon: <SparklesIcon className="h-6 w-6 text-primary" />,
                  title: "Instant Prototyping",
                  description: "Create and test AI agents in minutes with our visual interface.",
                },
                {
                  icon: <DatabaseIcon className="h-6 w-6 text-primary" />,
                  title: "Data Integration",
                  description: "Seamlessly connect to your existing data sources and APIs.",
                },
                {
                  icon: <UsersIcon className="h-6 w-6 text-primary" />,
                  title: "Collaborative Development",
                  description: "Share and collaborate on AI agent projects in real-time.",
                },
              ].map((capability, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2"
                >
                  <div className="flex items-center mb-4">
                    {capability.icon}
                    <h4 className="ml-4 text-xl font-semibold text-gray-800 dark:text-gray-200">{capability.title}</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Waiting List Section */}
      <section
        id="waitlist"
        className="py-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 transition-colors duration-500"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center animate-slide-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
              Join the AI Revolution
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Be the first to experience the future of AI agent creation. Join our exclusive waitlist and get early
              access.
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg animate-slide-in-up">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  // Handle waitlist submission
                  console.log("Submitted email:", email)
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-md hover:scale-105 transition-transform flex items-center justify-center"
                >
                  Join Waitlist
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </button>
              </form>
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                Early access. No credit card required.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">© 2025 Omniflow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  animationDelay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  animationDelay?: string
}) {
  return (
    <div
      className={`feature-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-up ${animationDelay || ""} group`}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}

function TestimonialCard({
  initials,
  name,
  role,
  quote,
  animationDelay,
}: {
  initials: string
  name: string
  role: string
  quote: string
  animationDelay?: string
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-up ${animationDelay || ""} group`}
    >
      <div className="flex items-center mb-6">
        <div className="mr-4 w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold group-hover:animate-spin">
          {initials}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6 italic">{quote}</p>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-400 transform transition-transform hover:scale-125"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  )
}

