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
import { JobForm } from "./job-form";
import { Button } from "./ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Job } from "@db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

const statusColors: Record<string, string> = {
  "Not Started": "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Completed": "bg-green-100 text-green-800",
  "Rejected": "bg-red-100 text-red-800",
};

export function JobCard({ job }: { job: Job }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "DELETE",
        headers: {
          "X-User-Id": user.uid
        }
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <JobForm />
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

        <div className="grid grid-cols-2 gap-2">
          {Object.entries({
            Recruiter: job.recruiterStatus,
            Referral: job.referralStatus,
            Assessment: job.assessmentStatus,
            Interview: job.interviewStatus,
            Application: job.applicationStatus,
          }).map(([label, status]) => (
            <div key={label}>
              <p className="text-sm text-gray-500">{label}</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm ${
                  statusColors[status]
                }`}
              >
                {status}
              </span>
            </div>
          ))}
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