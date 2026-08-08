'use server';

import { prisma } from '@/lib/prisma';
import { ProjectSchema, ContactSchema, ProjectInput, ContactInput } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

// --------------------------------------------------------------------------
// 1. Projects Actions
// --------------------------------------------------------------------------
export async function getProjectsAction() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (projects.length === 0) {
      // Seed default projects if DB is empty
      const defaultProjects = [
        {
          name: "Deadline Guardian AI",
          title: "DG-AI — Deadline Guardian",
          description: "AI-powered productivity system that predicts deadline risk, prioritizes tasks, and generates proactive recovery plans.",
          category: "ai",
          githubUrl: "https://github.com/amiitt001/Deadline-Guardian-AI",
          demoUrl: "",
          icon: "⏳",
          iconBg: "#ffd6e7",
          problem: "Students and developers frequently miscalculate task complexity, leading to missed deadlines and burnout.",
          architecture: "Next.js Frontend → FastAPI / Node Server → Gemini Risk Prediction Engine → PostgreSQL (Prisma) → Cloud Run",
          keyFeatures: "Calendar intelligence & risk forecasting, Proactive recovery plan generation, AI task decomposition, Real-time notifications",
          technicalDecisions: "Leveraged Gemini 1.5 Flash for low-latency JSON structured outputs.",
          approved: true,
          featured: true,
        },
        {
          name: "SkillSphere",
          title: "SkillSphere — AI Career Advisor",
          description: "AI-powered career intelligence platform that analyzes resumes, evaluates skills, optimizes resumes against job descriptions, and generates personalized learning paths.",
          category: "ai",
          githubUrl: "https://github.com/amiitt001/SkillSphere",
          demoUrl: "",
          icon: "🧠",
          iconBg: "#f5d90a",
          problem: "Job seekers struggle to understand ATS screening gaps and lack actionable, customized roadmap guidance.",
          architecture: "PDF Parser → Embedding Pipeline → Vertex AI Vector Search → RAG Gemini Chat → Dynamic Roadmap Generator",
          keyFeatures: "Resume ATS Intelligence & Match Score, RAG-powered conversational career advice, Skill gap analysis",
          technicalDecisions: "Used Vertex AI Vector Search for fast semantic matching.",
          approved: true,
          featured: true,
        },
        {
          name: "Dogs-Vs-Cat-detection",
          title: "Hybrid Cat-Dog Detection Pipeline",
          description: "Two-stage computer vision architecture combining YOLOv8 real-time object detection with fine-tuned MobileNetV2 edge classification.",
          category: "vision",
          githubUrl: "https://github.com/amiitt001/Dogs-Vs-Cat-detection",
          demoUrl: "",
          icon: "👁️",
          iconBg: "#ccf5e7",
          problem: "Single-stage classifiers struggle on cluttered real-world images.",
          architecture: "Input Frame → YOLOv8 Subject Bounding Box Detection → Bounding Crop → MobileNetV2 Classifier → Final Output",
          keyFeatures: "Dual-stage pipeline isolating subjects, Fine-tuned MobileNetV2 achieving 98.4% accuracy, Real-time video stream under 18ms",
          technicalDecisions: "Separated detection from classification to demonstrate non-CRUD deep learning engineering depth.",
          approved: true,
          featured: true,
        },
        {
          name: "adk-hiring-agent",
          title: "ADK Hiring Agent System",
          description: "Multi-agent conversational hiring evaluation system built using Google ADK & Gemini models with 5 specialized sub-agents.",
          category: "ai",
          githubUrl: "https://github.com/amiitt001/adk-hiring-agent",
          demoUrl: "https://adk-hiring-agent.onrender.com",
          icon: "🤖",
          iconBg: "#d6e8ff",
          problem: "Manual candidate screening is slow and inconsistent across technical rubrics.",
          architecture: "Rubric Agent + Resume Reviewer + GitHub Analyzer → Orchestrator → Verdict Generator → n8n Webhooks",
          keyFeatures: "5 specialized sub-agents in orchestration, Live GitHub profile velocity analysis, Automated rubric generator",
          technicalDecisions: "Built on Google ADK (Agent Development Kit) for agent state and tool calling.",
          approved: true,
          featured: true,
        },
        {
          name: "llc",
          title: "Privacy-First QR & PDF Suite",
          description: "Zero-server client-side web utility. Generates QR codes and executes document conversions directly in the user's browser.",
          category: "tools",
          githubUrl: "https://github.com/amiitt001/llc",
          demoUrl: "",
          icon: "📱",
          iconBg: "#ede2ff",
          problem: "Many online PDF tools upload sensitive user documents to unknown third-party servers.",
          architecture: "100% Client-Side Web API & WASM processing",
          keyFeatures: "Client-side PDF merging & splitting, Vector QR generation, Zero server data transmission",
          technicalDecisions: "Utilized WebAssembly and browser Canvas APIs to guarantee 100% offline privacy.",
          approved: true,
          featured: false,
        }
      ];

      await prisma.project.createMany({ data: defaultProjects });
      return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    }

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function createProjectAction(data: ProjectInput) {
  const validated = ProjectSchema.parse(data);
  const project = await prisma.project.create({ data: validated });
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, project };
}

export async function updateProjectAction(id: string, data: Partial<ProjectInput>) {
  const project = await prisma.project.update({
    where: { id },
    data,
  });
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, project };
}

export async function deleteProjectAction(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// --------------------------------------------------------------------------
// 2. Contact Message Actions
// --------------------------------------------------------------------------
export async function submitContactMessageAction(data: ContactInput) {
  const validated = ContactSchema.parse(data);
  const message = await prisma.contactMessage.create({ data: validated });
  revalidatePath('/admin');
  return { success: true, message };
}

export async function getContactMessagesAction() {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// --------------------------------------------------------------------------
// 3. GitHub Auto-Sync Engine
// --------------------------------------------------------------------------
export async function syncGitHubReposAction(username: string = 'amiitt001') {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`, {
      headers: { 'User-Agent': 'NextJS-Portfolio' }
    });

    if (!res.ok) throw new Error(`GitHub API returned status ${res.status}`);

    const repos = await res.json();
    const existingProjects = await prisma.project.findMany();
    const knownNames = new Set(existingProjects.map(p => p.name.toLowerCase()));

    const newRepos = repos.filter((r: any) => !knownNames.has(r.name.toLowerCase()) && r.name !== 'amiitt001.github.io');

    for (const repo of newRepos) {
      const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
      let category = 'tools';
      let icon = '⚡';
      let iconBg = '#d6e8ff';

      if (text.includes('agent') || text.includes('ai') || text.includes('gemini') || text.includes('llm')) {
        category = 'ai';
        icon = '🤖';
        iconBg = '#ccf5e7';
      } else if (text.includes('vision') || text.includes('yolo') || text.includes('detection')) {
        category = 'vision';
        icon = '👁️';
        iconBg = '#ffd6e7';
      }

      await prisma.project.create({
        data: {
          name: repo.name,
          title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          description: repo.description || 'Discovered repository from GitHub sync.',
          githubUrl: repo.html_url,
          demoUrl: repo.homepage || '',
          category,
          icon,
          iconBg,
          approved: false, // Requires admin approval before live display!
        }
      });
    }

    revalidatePath('/admin');
    return { success: true, count: newRepos.length };
  } catch (error: any) {
    console.error('Sync error:', error);
    return { success: false, error: error.message };
  }
}
