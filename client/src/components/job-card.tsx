import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { JobForm } from "./job-form";
import { Button } from "./ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Job } from "@db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  "Not Started": {
    bg: "bg-gray-100",
    text: "text-gray-800",
    dot: "bg-gray-400",
  },
  "In Progress": {
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  "Completed": {
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-500",
  },
  "Rejected": {
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
  },
};

function calculateProgress(job: Job): number {
  const statuses = [
    job.recruiterStatus,
    job.referralStatus,
    job.assessmentStatus,
    job.interviewStatus,
    job.applicationStatus,
  ];

  const weightedScores = {
    "Not Started": 0,
    "In Progress": 0.5,
    "Completed": 1,
    "Rejected": 1,
  };

  const totalProgress = statuses.reduce(
    (sum, status) => sum + weightedScores[status],
    0
  );

  return (totalProgress / statuses.length) * 100;
}

export function JobCard({ job }: { job: Job }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animate progress changes
  useEffect(() => {
    const targetProgress = calculateProgress(job);
    setProgress(targetProgress);
  }, [job]);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "DELETE",
        headers: {
          "X-User-Id": user.uid,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({ title: "Success", description: "Job application deleted" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job",
      });
    },
  });

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.jobTitle}</CardTitle>
            <CardDescription className="text-lg font-medium">
              {job.companyName}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <JobForm job={job} onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate()}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p>{job.location || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Application Date</p>
            <p>{format(new Date(job.applicationDate), "MMM d, yyyy")}</p>
          </div>
          {job.salaryMin && job.salaryMax && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Salary Range</p>
              <p>
                ${job.salaryMin} - ${job.salaryMax}
              </p>
            </div>
          )}
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Overall Progress</p>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Progress value={progress} className="h-2" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries({
            Recruiter: job.recruiterStatus,
            Referral: job.referralStatus,
            Assessment: job.assessmentStatus,
            Interview: job.interviewStatus,
            Application: job.applicationStatus,
          }).map(([label, status]) => {
            const colors = statusColors[status];
            return (
              <motion.div
                key={label}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${colors.dot}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${colors.bg} ${colors.text}`}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {status}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {job.notes && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-sm mt-1">{job.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}