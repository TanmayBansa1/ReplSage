'use client'
import React from 'react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Layers,
  Github, 
  Linkedin,
  Twitter 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* AppBar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">ReplSage</span>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <Link href="https://github.com/TanmayBansa1/ReplSage" target="_blank">
                <Github className="h-5 w-5 hover:text-primary" />
              </Link>
              <Link href="https://www.linkedin.com/in/tanmay-bansal-40bb44199/" target="_blank">
                <Linkedin className="h-5 w-5 hover:text-primary" />
              </Link>
              <Link href="https://x.com/K_A_I11" target="_blank">
                <Twitter className="h-5 w-5 hover:text-primary" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-6 text-primary">
            ReplSage: AI-Powered Code Exploration
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Revolutionize your coding workflow with intelligent code analysis, 
            meeting insights, and panoramic understanding of your codebase.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/sign-up">
              <Button  className="group h-12 w-48 text-xl">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform h-6 w-6" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 bg-secondary/10">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Modern Developers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-md text-center">
              <Zap className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-semibold mb-3">
                Seemless Github Integration
              </h3>
              <p className="text-muted-foreground">
                Seamlessly integrate with GitHub to access your codebase and 
                gain insights into your code.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md text-center">
              <Shield className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-semibold mb-3">
                Meeting Insights
              </h3>
              <p className="text-muted-foreground">
                Comprehensive insights from your meetings using AI, detects issues and topics discussed
                and provides summaries.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md text-center">
              <Layers className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-semibold mb-3">
                Advanced Code Intelligence
              </h3>
              <p className="text-muted-foreground">
                Advanced AI algorithms break down complex codebases, 
                providing context-aware insights and recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your Coding Journey Today
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Join thousands of developers who are already learning and building with ReplSage
          </p>
          <button onClick={() => router.push('/sign-up')} className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-slate-100 transition font-semibold">
            Try ReplSage Free
          </button>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/10 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Zap className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold"> 2025 ReplSage. All rights reserved.</span>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="https://github.com/TanmayBansa1/ReplSage" target="_blank">
                <Github className="h-5 w-5 hover:text-primary" />
              </Link>
              <Link href="https://www.linkedin.com/in/tanmay-bansal-40bb44199/" target="_blank">
                <Linkedin className="h-5 w-5 hover:text-primary" />
              </Link>
              <Link href="https://x.com/K_A_I11" target="_blank">
                <Twitter className="h-5 w-5 hover:text-primary" />
              </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}