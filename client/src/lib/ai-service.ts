import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai: OpenAI | null = null;

// Initialize OpenAI client only if API key is available
try {
  if (apiKey) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
} catch (error) {
  console.error("Failed to initialize OpenAI client:", error);
}

export interface ATSAnalysis {
  keywords: { text: string; importance: "high" | "medium" | "low" }[];
  missingSkills: string[];
  recommendations: string[];
}

export async function analyzeJobDescription(
  description: string,
): Promise<ATSAnalysis> {
  try {
    if (!openai) {
      throw new Error("OpenAI API key is not properly configured. Please configure OPENAI_API_KEY in your environment.");
    }

    if (!description || description.trim().length < 50) {
      throw new Error("Please provide a longer job description for analysis");
    }

    console.log("Starting job description analysis");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS (Applicant Tracking System) analyzer. Analyze job descriptions and identify important keywords, skills, and provide recommendations for ATS optimization.",
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
      throw new Error("No response content received from OpenAI");
    }

    const result = JSON.parse(
      response.choices[0].message.content,
    ) as ATSAnalysis;
    console.log("Analysis completed successfully", result);
    return result;
  } catch (error: any) {
    console.error("Error analyzing job description:", error);
    if (error.message.includes("API key")) {
      throw new Error("OpenAI API key is not properly configured. Please check your environment settings.");
    } else if (error.message.includes("longer job description")) {
      throw new Error("Please provide a longer job description for analysis.");
    } else {
      throw new Error(`Failed to analyze job description: ${error.message}`);
    }
  }
}