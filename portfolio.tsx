"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Mail,
  Facebook,
  Download,
  ExternalLink,
  Smartphone,
  Globe,
  Database,
  Wrench,
  Star,
  Coffee,
  Moon,
  Sun,
  Code,
  Heart,
  Rocket,
  Sparkles,
} from "lucide-react"

export default function Portfolio() {
  const [currentText, setCurrentText] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const typingTexts = [
    "Welcome to my portfolio 🚀",
    "I build cross-platform apps 📱",
    "Clean code, smooth UX, scalable architecture ✨",
    "Turning coffee into code ☕",
    "Dream coder by night 🌙",
  ]

  // Typing animation
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const currentString = typingTexts[currentText]

    if (isTyping) {
      if (displayText.length < currentString.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentString.slice(0, displayText.length + 1))
        }, 100)
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50)
      } else {
        setCurrentText((prev) => (prev + 1) % typingTexts.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isTyping, currentText, typingTexts])

  const skills = {
    mobile: [
      { name: "Flutter", icon: "📱", color: "from-blue-400 to-blue-600" },
      { name: "Kotlin", icon: "🤖", color: "from-orange-400 to-orange-600" },
      { name: "Dart", icon: "🎯", color: "from-cyan-400 to-cyan-600" },
    ],
    web: [
      { name: "React", icon: "⚛️", color: "from-blue-400 to-cyan-400" },
      { name: "Angular", icon: "🅰️", color: "from-red-400 to-red-600" },
      { name: "TypeScript", icon: "📘", color: "from-blue-500 to-blue-700" },
    ],
    backend: [
      { name: "Firebase", icon: "🔥", color: "from-yellow-400 to-orange-500" },
      { name: "Node.js", icon: "🟢", color: "from-green-400 to-green-600" },
      { name: "MongoDB", icon: "🍃", color: "from-green-500 to-green-700" },
    ],
    tools: [
      { name: "Git", icon: "🌿", color: "from-orange-400 to-red-500" },
      { name: "VS Code", icon: "💻", color: "from-blue-400 to-blue-600" },
      { name: "Figma", icon: "🎨", color: "from-purple-400 to-pink-500" },
    ],
  }

  const projects = [
    {
      title: "MedAI – Skin Cancer Detection",
      description: "AI-powered mobile app for early skin cancer detection using TensorFlow and Flutter",
      tech: ["Flutter", "TensorFlow", "Dart"],
      color: "from-pink-500 to-rose-500",
      icon: "🏥",
      stats: "10K+ Downloads",
    },
    {
      title: "StreamFlow – Music Streaming",
      description: "Real-time music streaming platform with WebRTC integration",
      tech: ["Flutter", "WebRTC", "Firebase"],
      color: "from-purple-500 to-indigo-500",
      icon: "🎵",
      stats: "5K+ Users",
    },
    {
      title: "E-commerce App – Full-stack Shopping",
      description: "Complete shopping solution with payment integration and admin panel",
      tech: ["React", "MongoDB", "Node.js"],
      color: "from-blue-500 to-cyan-500",
      icon: "🛒",
      stats: "50+ Products",
    },
    {
      title: "Admin Dashboard – Data Visualization",
      description: "Interactive dashboard with real-time analytics and beautiful charts",
      tech: ["Angular", "D3.js", "TypeScript"],
      color: "from-green-500 to-teal-500",
      icon: "📊",
      stats: "Real-time Data",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Optimized CSS for Glass Effects */}
      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .glass-dark {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        .glass-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .glass-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        .floating-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .glow-text {
          text-shadow: 0 0 20px currentColor;
        }
      `}</style>

      {/* Simple Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl floating-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl floating-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Glass Theme Toggle */}
      <Button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-6 right-6 z-50 glass-button rounded-full p-3"
        variant="ghost"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-4">
        <div className="text-center z-10 max-w-4xl mx-auto">
          {/* Glass Avatar Container */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto relative floating-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full p-1">
                <div className={`w-full h-full glass-dark rounded-full flex items-center justify-center`}>
                  <span className="text-4xl">👨‍💻</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent glow-text">
            Hi, I'm Thành Bảo
          </h1>

          <div className="glass-card rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="text-xl md:text-2xl text-gray-300 mb-2 flex items-center justify-center gap-2">
              <span>🇻🇳</span>
              <span>Vietnam</span>
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-white mb-2">Mobile & Web Developer</p>
            <p className="text-lg md:text-xl text-gray-300">Flutter · Kotlin · Firebase · React · Angular</p>
          </div>

          {/* Glass Typing Banner */}
          <div className="glass-card rounded-xl p-4 mb-8 max-w-xl mx-auto">
            <div className="text-xl md:text-2xl font-mono text-cyan-400 glow-text">
              {displayText}
              <span className="animate-pulse">|</span>
            </div>
          </div>

          {/* Glass Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="glass-button bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 text-white border-0">
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </Button>
            <Button className="glass-button text-cyan-400 border-cyan-400/30 hover:text-white hover:bg-cyan-400/20">
              <Rocket className="mr-2 h-4 w-4" />
              View Projects
            </Button>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent glow-text">
            About Me
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="glass-card rounded-2xl p-8">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Hey there! I'm Thành Bảo, a passionate Mobile & Web Developer from Vietnam 🇻🇳 with over 4 years of
                experience since 2020. I believe in writing clean, scalable code that creates smooth user experiences.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                When I'm not coding, you'll find me exploring new technologies, contributing to open source, or turning
                coffee into features! I love building cross-platform applications that make a difference.
              </p>
              <div className="flex items-center gap-3 text-cyan-400 glow-text">
                <Coffee className="h-6 w-6" />
                <span className="font-mono">"Dream coder by night, coffee drinker by day"</span>
              </div>
            </div>

            {/* Glass Profile Card */}
            <div className="relative">
              <div className="glass-card rounded-3xl p-8 text-center">
                <div className="text-8xl mb-4">👨‍💻</div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="glass rounded-xl p-3">
                    <div className="text-2xl mb-1">⚛️</div>
                    <div className="text-sm text-gray-300">React</div>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <div className="text-2xl mb-1">📱</div>
                    <div className="text-sm text-gray-300">Flutter</div>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-sm text-gray-300">Firebase</div>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <div className="text-2xl mb-1">🚀</div>
                    <div className="text-sm text-gray-300">Innovation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent glow-text">
            Skills & Technologies
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mobile Skills */}
            <div className="glass-card rounded-2xl p-6 text-center group">
              <Smartphone className="h-12 w-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4 text-purple-400 glow-text">Mobile</h3>
              <div className="space-y-3">
                {skills.mobile.map((skill) => (
                  <div key={skill.name} className="glass rounded-lg p-2 flex items-center justify-center gap-2">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Web Skills */}
            <div className="glass-card rounded-2xl p-6 text-center group">
              <Globe className="h-12 w-12 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4 text-cyan-400 glow-text">Web</h3>
              <div className="space-y-3">
                {skills.web.map((skill) => (
                  <div key={skill.name} className="glass rounded-lg p-2 flex items-center justify-center gap-2">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div className="glass-card rounded-2xl p-6 text-center group">
              <Database className="h-12 w-12 text-pink-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4 text-pink-400 glow-text">Backend</h3>
              <div className="space-y-3">
                {skills.backend.map((skill) => (
                  <div key={skill.name} className="glass rounded-lg p-2 flex items-center justify-center gap-2">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools Skills */}
            <div className="glass-card rounded-2xl p-6 text-center group">
              <Wrench className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4 text-green-400 glow-text">Tools</h3>
              <div className="space-y-3">
                {skills.tools.map((skill) => (
                  <div key={skill.name} className="glass rounded-lg p-2 flex items-center justify-center gap-2">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent glow-text">
            Featured Projects
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 group relative overflow-hidden">
                {/* Gradient Top Border */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${project.color}`}></div>

                {/* Project Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors glow-text">
                      {project.title}
                    </h3>
                    <Badge className="glass bg-gradient-to-r from-yellow-400/80 to-orange-500/80 text-black border-0">
                      {project.stats}
                    </Badge>
                  </div>
                  <div className="text-3xl group-hover:scale-110 transition-transform">{project.icon}</div>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <Badge key={tech} className="glass border-gray-600/30 text-gray-300 bg-white/5">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="text-cyan-400 hover:text-cyan-300 p-0 group-hover:translate-x-2 transition-transform"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Project
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Stats */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent glow-text">
            GitHub Stats
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Contributions</h3>
                <Github className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2 glow-text">1,247</div>
              <p className="text-gray-400">This year</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Repositories</h3>
                <Star className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2 glow-text">42</div>
              <p className="text-gray-400">Public repos</p>
            </div>
          </div>

          <Button className="glass-button border-gray-600/30 text-gray-300 hover:bg-gray-700/20">
            <Github className="mr-2 h-4 w-4" />
            View GitHub Profile
          </Button>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-8 relative">
            <div className="text-6xl text-cyan-400/30 absolute top-4 left-4">"</div>
            <blockquote className="text-2xl md:text-3xl font-light text-gray-300 mb-6 relative z-10">
              Code is like humor. When you have to explain it, it's bad.
            </blockquote>
            <div className="text-6xl text-cyan-400/30 absolute bottom-4 right-4">"</div>
            <cite className="text-gray-400">- Cory House</cite>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <div className="glass rounded-full p-3">
              <Code className="h-6 w-6 text-blue-400" />
            </div>
            <div className="glass rounded-full p-3">
              <Heart className="h-6 w-6 text-red-400" />
            </div>
            <div className="glass rounded-full p-3">
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent glow-text">
            Let's Connect!
          </h2>

          <div className="glass-card rounded-2xl p-8 mb-8">
            <p className="text-xl text-gray-300 mb-8">
              Ready to turn your ideas into amazing applications? Let's chat!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="glass-button bg-blue-600/80 hover:bg-blue-700/80 text-white border-0">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </Button>
              <Button className="glass-button bg-red-600/80 hover:bg-red-700/80 text-white border-0">
                <Mail className="mr-2 h-5 w-5" />
                Gmail
              </Button>
              <Button className="glass-button bg-blue-500/80 hover:bg-blue-600/80 text-white border-0">
                <Facebook className="mr-2 h-5 w-5" />
                Facebook
              </Button>
              <Button className="glass-button bg-gray-700/80 hover:bg-gray-600/80 text-white border-0">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="flex justify-center gap-4 mb-4">
              <span className="text-2xl">🐛</span>
              <span className="text-2xl">✨</span>
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400 mb-4 glow-text">
              "When life gives you bugs, make features!"
            </p>
            <p className="text-gray-400">© 2024 Thành Bảo. Made with ❤️ and lots of ☕</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
