import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  tags: z.array(z.string().min(1)).max(8).optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

