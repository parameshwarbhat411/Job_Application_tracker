import { useQuery } from "@tanstack/react-query";
import { JobCard } from "./job-card";
import type { Job } from "@db/schema";
import { Loader2, Search } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    searchTerm === "" ||
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by job title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {!filteredJobs?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications found. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export function JobListWithFetch() {
  const { user } = useUser();

  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const response = await fetch("/api/jobs", {
        headers: {
          "X-User-Id": user.uid
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      return response.json();
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <JobList jobs={jobs!} />;
}