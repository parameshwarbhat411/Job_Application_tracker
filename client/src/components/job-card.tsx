import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Job } from "@db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobForm } from "./job-form";

// Status colors remain unchanged...
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
    (sum, status) => sum + (weightedScores[status as keyof typeof weightedScores] || 0),
    0
  );

  return (totalProgress / statuses.length) * 100;
}

export function JobCard({ job }: { job: Job }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [progress, setProgress] = useState(0);

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 h-32">
          <CardContent className="p-4 h-full flex flex-col justify-between relative">
            {/* Edit button - visible on hover */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditOpen(true);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            {/* Main content - clickable for details */}
            <div onClick={() => setIsDetailsOpen(true)} className="h-full">
              <div>
                <h3 className="font-semibold text-lg truncate pr-8">{job.jobTitle}</h3>
                <p className="text-sm text-muted-foreground truncate">{job.companyName}</p>
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-3xl">
          <JobForm job={job} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Detailed view in dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{job.jobTitle} at {job.companyName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Basic Information */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{job.location || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Date</p>
                <p>{format(new Date(job.applicationDate), "MMM d, yyyy")}</p>
              </div>
              {(job.salaryMin || job.salaryMax) && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Salary Range</p>
                  <p>
                    {job.salaryMin && `$${job.salaryMin}`}
                    {job.salaryMin && job.salaryMax && " - "}
                    {job.salaryMax && `$${job.salaryMax}`}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Application Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-sm font-semibold mb-2">Application Progress</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
            </motion.div>

            {/* Status Details */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries({
                Recruiter: job.recruiterStatus,
                Referral: job.referralStatus,
                Assessment: job.assessmentStatus,
                Interview: job.interviewStatus,
                Application: job.applicationStatus,
              }).map(([label, status], index) => {
                const colors = statusColors[status];
                return (
                  <motion.div
                    key={label}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      <span className={`inline-block px-2 py-1 rounded-full text-sm ${colors.bg} ${colors.text}`}>
                        {status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Additional Details */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {job.jobDescription && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job Description</p>
                  <p className="text-sm whitespace-pre-wrap">{job.jobDescription}</p>
                </div>
              )}

              {job.nextSteps && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Next Steps</p>
                  <p className="text-sm">{job.nextSteps}</p>
                </div>
              )}

              {job.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-sm whitespace-pre-wrap">{job.notes}</p>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteMutation.mutate();
                  setIsDetailsOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}