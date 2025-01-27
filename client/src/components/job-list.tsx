import { useQuery } from "@tanstack/react-query";
import { JobCard } from "./job-card";
import type { Job } from "@db/schema";
import { Loader2 } from "lucide-react";

export function JobList() {
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No applications yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
