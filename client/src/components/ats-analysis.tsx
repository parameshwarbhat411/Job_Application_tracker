import { type ATSAnalysis } from "@/lib/ai-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const importanceColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

interface ATSAnalysisDisplayProps {
  analysis: ATSAnalysis | null;
  isLoading: boolean;
}

export function ATSAnalysisDisplay({ analysis, isLoading }: ATSAnalysisDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
            <p>Analyzing job description...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">ATS Analysis Results</CardTitle>
        <CardDescription>
          Review these insights to optimize your application for ATS systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Key Skills & Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`${importanceColors[keyword.importance]} cursor-default`}
              >
                {keyword.text}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            Commonly Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-yellow-50 text-yellow-800 border-yellow-200"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-blue-500" />
            ATS Recommendations
          </h3>
          <ul className="space-y-2 text-sm">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}