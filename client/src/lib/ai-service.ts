import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export interface ATSAnalysis {
  keywords: { text: string; importance: 'high' | 'medium' | 'low' }[];
  missingSkills: string[];
  recommendations: string[];
}

export async function analyzeJobDescription(description: string): Promise<ATSAnalysis> {
  try {
    console.log("Starting job description analysis");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS (Applicant Tracking System) analyzer. Analyze job descriptions and identify important keywords, skills, and provide recommendations for ATS optimization.",
        },
        {
          role: "user",
          content: `Analyze this job description and provide:
          1. Important keywords and their significance (high, medium, low)
          2. Potentially missing but commonly required skills for this role
          3. Recommendations for ATS optimization

          Format the response as a JSON object with these keys:
          - keywords: array of objects with 'text' and 'importance'
          - missingSkills: array of strings
          - recommendations: array of strings

          Job Description:
          ${description}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error('No response content received from OpenAI');
    }

    const result = JSON.parse(response.choices[0].message.content) as ATSAnalysis;
    console.log("Analysis completed successfully", result);
    return result;
  } catch (error) {
    console.error('Error analyzing job description:', error);
    throw new Error('Failed to analyze job description');
  }
}