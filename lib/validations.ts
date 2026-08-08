import { z } from 'zod';

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  problem: z.string().optional(),
  architecture: z.string().optional(),
  keyFeatures: z.string().optional(),
  technicalDecisions: z.string().optional(),
  githubUrl: z.string().url('Invalid GitHub URL'),
  demoUrl: z.string().optional(),
  icon: z.string().default('🤖'),
  iconBg: z.string().default('#ccf5e7'),
  category: z.string().default('ai'),
  approved: z.boolean().default(true),
  featured: z.boolean().default(true),
});

export const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters long'),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
