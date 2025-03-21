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
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { AuroraBackground } from '~/components/ui/aurora-background';

export default function LandingPage() {
  const router = useRouter();
  const AuroraBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="aurora-container absolute inset-0 z-0">
        <div className="aurora aurora-1"></div>
        <div className="aurora aurora-2"></div>
        <div className="aurora aurora-3"></div>
      </div>
      <style jsx>{`
        .aurora-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          opacity: 0.4;
        }
        .aurora {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          animation: aurora-movement 20s infinite alternate;
        }
        .aurora-1 {
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(147,51,234,0.7) 0%, rgba(147,51,234,0.1) 70%);
          animation-delay: -5s;
        }
        .aurora-2 {
          bottom: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(219,39,119,0.7) 0%, rgba(219,39,119,0.1) 70%);
          animation-delay: -10s;
        }
        .aurora-3 {
          top: 20%;
          left: 20%;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle, rgba(192,38,211,0.6) 0%, rgba(192,38,211,0.1) 70%);
          animation-delay: -15s;
        }
        @keyframes aurora-movement {
          0% {
            transform: translate(-10%, -10%) rotate(0deg);
          }
          50% {
            transform: translate(10%, 10%) rotate(120deg);
          }
          100% {
            transform: translate(-10%, -10%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.8
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      rotate: -10
    },
    visible: {
      opacity: 1, 
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        type: "spring"
      }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        type: "tween",
        duration: 0.6,
        delay: 0.4
      }
    }
  };
  
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-background text-foreground flex flex-col relative"
      >
      <AuroraBackground />

      {/* AppBar */}
      <motion.header 
        variants={itemVariants}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b"
        >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">ReplSage</span>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <Link href="https://github.com/TanmayBansa1/ReplSage" target="_blank">
                <Github className="h-5 w-5 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://www.linkedin.com/in/tanmay-bansal-40bb44199/" target="_blank">
                <Linkedin className="h-5 w-5 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://x.com/K_A_I11" target="_blank">
                <Twitter className="h-5 w-5 hover:text-primary transition-colors" />
              </Link>
            </div>
          </nav>
        </div>
      </motion.header>

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section 
          variants={heroVariants}
          className="container mx-auto px-4 py-16 text-center"
          >
          <motion.h1 
            variants={titleVariants}
            className="text-5xl font-bold mb-6 text-primary"
            >
            ReplSage: AI-Powered Code Exploration
          </motion.h1>
          <motion.p 
            variants={subtitleVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
            Revolutionize your coding workflow with intelligent code analysis, 
            meeting insights, and panoramic understanding of your codebase.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex justify-center space-x-4"
            >
            <Link href="/sign-up">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                >
                <Button className="group h-12 w-48 text-xl">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform h-6 w-6" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          variants={containerVariants}
          className="container mx-auto px-4 py-16 bg-secondary/10"
          >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-12"
            >
            Powerful Features for Modern Developers
          </motion.h2>
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
            >
            {[
              { 
                icon: Zap, 
                title: "Seamless Github Integration", 
                description: "Seamlessly integrate with GitHub to access your codebase and gain insights into your code."
              },
              { 
                icon: Shield, 
                title: "Meeting Insights", 
                description: "Comprehensive insights from your meetings using AI, detects issues and topics discussed and provides summaries."
              },
              { 
                icon: Layers, 
                title: "Advanced Code Intelligence", 
                description: "Advanced AI algorithms break down complex codebases, providing context-aware insights and recommendations."
              }
            ].map((feature, index) => (
              <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-background p-6 rounded-lg shadow-md text-center"
              >
                <feature.icon className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          variants={itemVariants}
          className="py-20 px-4"
          >
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center">
            <Typewriter
              options={{
                wrapperClassName: 'text-3xl md:text-4xl font-bold text-white mb-4',
                strings: ['Start Your Coding Journey Today'],
                autoStart: true,
                loop: true,
              }}
              />
            <motion.p 
              variants={itemVariants}
              className="text-white/90 mb-8 text-lg"
              >
              Join thousands of developers who are already learning and building with ReplSage
            </motion.p>
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/sign-up')} 
              className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-slate-100 transition font-semibold"
              >
              Try ReplSage Free
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        variants={itemVariants}
        className="bg-secondary/10 py-8"
        >
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
      </motion.footer>
    </motion.div>
  );
}