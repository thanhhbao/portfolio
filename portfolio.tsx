"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useInView } from "framer-motion"
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
  Code,
  Heart,
  Rocket,
  Sparkles,
  GitBranch,
  MapPin,
} from "lucide-react"

export default function Portfolio() {
  const [currentText, setCurrentText] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef)

  const typingTexts = [
    "Welcome to my portfolio 🚀",
    "I build cross-platform apps 📱",
    "Clean code, smooth UX, scalable architecture ✨",
    "Turning coffee into code ☕",
    "Dream coder by night 🌙",
    "Let's build something great together! 🔥",
  ]

  // Mouse tracking for interactive cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Typing animation
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const currentString = typingTexts[currentText]

    if (isTyping) {
      if (displayText.length < currentString.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentString.slice(0, displayText.length + 1))
        }, 80)
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 40)
      } else {
        setCurrentText((prev) => (prev + 1) % typingTexts.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isTyping, currentText, typingTexts])

  const skills = {
    mobile: [
      { name: "Flutter", icon: "📱", level: 95 },
      { name: "Kotlin", icon: "🤖", level: 90 },
      { name: "Dart", icon: "🎯", level: 92 },
    ],
    web: [
      { name: "React", icon: "⚛️", level: 88 },
      { name: "Angular", icon: "🅰️", level: 85 },
      { name: "TypeScript", icon: "📘", level: 90 },
    ],
    backend: [
      { name: "Firebase", icon: "🔥", level: 93 },
      { name: "Node.js", icon: "🟢", level: 87 },
      { name: "MongoDB", icon: "🍃", level: 85 },
    ],
    tools: [
      { name: "Git", icon: "🌿", level: 95 },
      { name: "VS Code", icon: "💻", level: 98 },
      { name: "Figma", icon: "🎨", level: 80 },
    ],
  }

  const projects = [
    {
      title: "MedAI – Skin Cancer Detection",
      description:
        "AI-powered mobile app for early skin cancer detection using TensorFlow and Flutter with 95% accuracy rate",
      tech: ["Flutter", "TensorFlow", "Dart", "Python"],
      icon: "🏥",
      stats: "10K+ Downloads",
      github: "https://github.com/thanhhbao",
      demo: "https://medai-demo.com",
      gradient: "from-pink-500 via-red-500 to-yellow-500",
    },
    {
      title: "StreamFlow – Music Streaming",
      description: "Real-time music streaming platform with WebRTC integration and social features",
      tech: ["Flutter", "WebRTC", "Firebase", "Node.js"],
      icon: "🎵",
      stats: "5K+ Users",
      github: "https://github.com/thanhhbao",
      demo: "https://streamflow-demo.com",
      gradient: "from-purple-500 via-blue-500 to-cyan-500",
    },
    {
      title: "E-commerce App – Full-stack Shopping",
      description: "Complete shopping solution with payment integration, inventory management, and analytics",
      tech: ["React", "MongoDB", "Node.js", "Stripe"],
      icon: "🛒",
      stats: "50+ Products",
      github: "https://github.com/thanhhbao",
      demo: "https://ecommerce-demo.com",
      gradient: "from-blue-500 via-teal-500 to-green-500",
    },
    {
      title: "Admin Dashboard – Data Visualization",
      description: "Interactive dashboard with real-time analytics, beautiful charts, and comprehensive reporting",
      tech: ["Angular", "D3.js", "TypeScript", "Chart.js"],
      icon: "📊",
      stats: "Real-time Data",
      github: "https://github.com/thanhhbao",
      demo: "https://dashboard-demo.com",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
    },
  ]

  // Particle component
  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, -100, -200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1b27] text-white font-mono overflow-x-hidden">
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-6 h-6 bg-cyan-400/30 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <Particles />

        {/* Animated Background Gradients */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #667eea20 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, #764ba220 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, #ff79c620 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />

        <div className="text-center z-10 px-4 max-w-4xl mx-auto">
          {/* Animated Avatar */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <div className="absolute inset-2 bg-[#1a1b27] rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-4xl">👨‍💻</span>
              </div>
            </div>
          </motion.div>

          {/* Animated Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Hi, I'm{" "}
              <motion.span
                className="bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#ff79c6] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Thành Bảo
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-[#8be9fd]" />
              <span className="text-xl text-gray-300">Vietnam 🇻🇳</span>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">Mobile & Web Developer</p>
            <div className="flex flex-wrap justify-center gap-2 text-[#8be9fd]">
              {["Flutter", "Kotlin", "Firebase", "React", "Angular"].map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-[#8be9fd]/30"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Typing Animation */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mb-8">
            <div className="bg-black/30 backdrop-blur-sm border border-[#8be9fd]/30 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="text-xl md:text-2xl text-[#8be9fd] font-mono">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#667eea]/80 hover:to-[#764ba2]/80 text-white border-0 px-8 py-3 text-lg">
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-[#8be9fd] text-[#8be9fd] hover:bg-[#8be9fd]/10 px-8 py-3 text-lg backdrop-blur-sm bg-transparent"
              >
                <Rocket className="mr-2 h-5 w-5" />
                View Projects
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Me Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#8be9fd] to-[#ff79c6] bg-clip-text text-transparent"
          >
            About Me
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                I'm Thành Bảo, a Mobile & Web Developer from Vietnam 🇻🇳 with experience since 2020. I love building
                cross-platform apps with Flutter, React, and Firebase. I believe in clean code, smooth UX, and scalable
                architecture.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                When I'm not coding, you'll find me exploring new technologies, contributing to open source, or turning
                coffee into features! I love building applications that make a difference in people's lives.
              </p>
              <div className="flex items-center gap-3 text-[#f1fa8c]">
                <Coffee className="h-6 w-6" />
                <span className="font-mono">"Turning coffee into code ☕"</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👨‍💻</div>
                <h3 className="text-2xl font-bold text-[#8be9fd] mb-2">Experience Since 2020</h3>
                <p className="text-gray-400">4+ Years of Development</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="text-sm text-gray-300">Mobile Apps</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="text-sm text-gray-300">Web Apps</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="text-sm text-gray-300">Firebase</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl mb-2">☕</div>
                  <div className="text-sm text-gray-300">Coffee Lover</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#ff79c6] to-[#8be9fd] bg-clip-text text-transparent"
          >
            Skills & Technologies
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, skillList], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:border-[#8be9fd]/50 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  {category === "mobile" && <Smartphone className="h-12 w-12 text-[#667eea] mx-auto mb-4" />}
                  {category === "web" && <Globe className="h-12 w-12 text-[#8be9fd] mx-auto mb-4" />}
                  {category === "backend" && <Database className="h-12 w-12 text-[#ff79c6] mx-auto mb-4" />}
                  {category === "tools" && <Wrench className="h-12 w-12 text-[#f1fa8c] mx-auto mb-4" />}
                  <h3 className="text-xl font-bold capitalize text-white">{category}</h3>
                </div>

                <div className="space-y-4">
                  {skillList.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{skill.icon}</span>
                          <span className="text-white font-medium">{skill.name}</span>
                        </div>
                        <span className="text-[#8be9fd] text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-r from-[#667eea] to-[#8be9fd] h-2 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#f1fa8c] to-[#ff79c6] bg-clip-text text-transparent"
          >
            Featured Projects
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:border-[#8be9fd]/50 transition-all duration-300 relative overflow-hidden"
              >
                {/* Gradient Border */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${project.gradient}`} />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#8be9fd] transition-colors">
                      {project.title}
                    </h3>
                    <Badge className="bg-gradient-to-r from-[#f1fa8c]/20 to-[#ff79c6]/20 text-[#f1fa8c] border-[#f1fa8c]/30">
                      {project.stats}
                    </Badge>
                  </div>
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-3xl">
                    {project.icon}
                  </motion.div>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="border-white/20 text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="text-[#8be9fd] hover:text-white hover:bg-[#8be9fd]/20 p-0"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="text-[#ff79c6] hover:text-white hover:bg-[#ff79c6]/20 p-0"
                      asChild
                    >
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* GitHub Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-[#667eea] to-[#f1fa8c] bg-clip-text text-transparent"
          >
            GitHub Statistics
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <Github className="h-8 w-8 text-[#8be9fd] mx-auto mb-4" />
              <div className="text-3xl font-bold text-[#f1fa8c] mb-2">1,247</div>
              <p className="text-gray-400">Contributions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <Star className="h-8 w-8 text-[#ff79c6] mx-auto mb-4" />
              <div className="text-3xl font-bold text-[#f1fa8c] mb-2">42</div>
              <p className="text-gray-400">Repositories</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <GitBranch className="h-8 w-8 text-[#667eea] mx-auto mb-4" />
              <div className="text-3xl font-bold text-[#f1fa8c] mb-2">156</div>
              <p className="text-gray-400">Commits</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <Button
              variant="outline"
              className="border-[#8be9fd]/30 text-[#8be9fd] hover:bg-[#8be9fd]/10 backdrop-blur-sm bg-transparent"
              asChild
            >
              <a href="https://github.com/thanhhbao" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View GitHub Profile
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Quote Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative"
          >
            <div className="text-6xl text-[#8be9fd]/30 absolute top-4 left-4">"</div>
            <blockquote className="text-2xl md:text-3xl font-light text-gray-300 mb-6 relative z-10">
              Code is like humor. When you have to explain it, it's bad.
            </blockquote>
            <div className="text-6xl text-[#8be9fd]/30 absolute bottom-4 right-4">"</div>
            <cite className="text-[#f1fa8c]">- Cory House</cite>
          </motion.div>

          <div className="flex justify-center gap-4 mt-8">
            {[Code, Heart, Sparkles].map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-3"
              >
                <Icon className="h-6 w-6 text-[#8be9fd]" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-[#ff79c6] to-[#667eea] bg-clip-text text-transparent"
          >
            Let's Build Something Great Together!
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8"
          >
            <p className="text-xl text-gray-300 mb-8">
              Ready to turn your ideas into amazing applications? Let's connect and create something awesome! 🚀
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/thanhbao1", color: "#0077b5" },
                { icon: Mail, label: "Gmail", href: "mailto:thanhhbao4123@gmail.com", color: "#ea4335" },
                {
                  icon: Facebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/thanhhbao.0412",
                  color: "#1877f2",
                },
                { icon: Github, label: "GitHub", href: "https://github.com/thanhhbao", color: "#333" },
              ].map((social, index) => (
                <motion.div
                  key={social.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-sm"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <social.icon className="mr-2 h-5 w-5" />
                      {social.label}
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative py-12 px-4 overflow-hidden">
        {/* Animated SVG Wave */}
        <div className="absolute inset-x-0 top-0">
          <svg viewBox="0 0 1200 120" className="w-full h-12">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#8be9fd" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ff79c6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path fill="url(#waveGradient)" d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z">
              <animate
                attributeName="d"
                values="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z;M0,60 C300,0 900,120 1200,60 L1200,120 L0,120 Z;M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 text-center"
        >
          <div className="flex justify-center gap-4 mb-6">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-2xl"
            >
              🐛
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              className="text-2xl"
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              className="text-2xl"
            >
              🚀
            </motion.span>
          </div>

          <p className="text-2xl font-bold text-[#8be9fd] mb-4">"When life gives you bugs, make features!"</p>
          <p className="text-gray-400">
            Made with <Heart className="inline h-4 w-4 text-red-400" /> and{" "}
            <Coffee className="inline h-4 w-4 text-orange-400" /> by Thành Bảo
          </p>
          <p className="text-sm text-gray-500 mt-2">© 2024 All rights reserved</p>
        </motion.div>
      </footer>
    </div>
  )
}
