// API services for company and job title suggestions
import { z } from "zod";

const companySchema = z.object({
  word: z.string(),
  score: z.number(),
});

const jobTitleSchema = z.object({
  title: z.string(),
  code: z.string(),
});

export type Company = z.infer<typeof companySchema>;
export type JobTitle = z.infer<typeof jobTitleSchema>;

export async function searchCompanies(query: string): Promise<Company[]> {
  if (!query || query.length < 2) return [];
  
  const response = await fetch(
    `https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&topics=business,company,corporation`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  
  const data = await response.json();
  return z.array(companySchema).parse(data);
}

export async function searchJobTitles(query: string): Promise<JobTitle[]> {
  if (!query || query.length < 2) return [];
  
  const response = await fetch(
    `https://services.onetcenter.org/ws/online/search?keyword=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch job titles');
  }
  
  const data = await response.json();
  return data.occupation.map((occ: any) => ({
    title: occ.title,
    code: occ.code,
  }));
}
