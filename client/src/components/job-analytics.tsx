import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import type { Job } from "@db/schema";

type FilterType = "role" | "company" | "location";

interface JobAnalyticsProps {
  jobs: Job[];
}

const COLORS = {
  completed: "#22c55e", // green-500
  rejected: "#ef4444", // red-500
  inProgress: "#3b82f6", // blue-500
};

export function JobAnalytics({ jobs }: JobAnalyticsProps) {
  const [filterType, setFilterType] = useState<FilterType>("role");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique values for each filter type
  const filterOptions = useMemo(() => {
    const options = {
      role: [...new Set(jobs.map((job) => job.jobTitle))],
      company: [...new Set(jobs.map((job) => job.companyName))],
      location: [...new Set(jobs.map((job) => job.location || "Not Specified"))],
    };
    return options;
  }, [jobs]);

  // Filter jobs based on search term and filter type
  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;

    return jobs.filter((job) => {
      const value = filterType === "role" 
        ? job.jobTitle 
        : filterType === "company" 
          ? job.companyName 
          : job.location || "Not Specified";
      
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [jobs, filterType, searchTerm]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const completed = filteredJobs.filter(
      (job) => job.applicationStatus === "Completed"
    ).length;
    const rejected = filteredJobs.filter(
      (job) => job.applicationStatus === "Rejected"
    ).length;
    const inProgress = filteredJobs.filter(
      (job) => job.applicationStatus === "In Progress"
    ).length;
    const total = filteredJobs.length;

    return [
      { name: "Completed", value: completed, color: COLORS.completed },
      { name: "Rejected", value: rejected, color: COLORS.rejected },
      { name: "In Progress", value: inProgress, color: COLORS.inProgress },
    ];
  }, [filteredJobs]);

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Job Application Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value as FilterType);
                setSearchTerm("");
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={`Search by ${filterType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {statusCounts.map((status) => (
              <div
                key={status.name}
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${status.color}15` }}
              >
                <p className="text-sm font-medium" style={{ color: status.color }}>
                  {status.name}
                </p>
                <p className="text-2xl font-bold mt-1">{status.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filterOptions[filterType]
            .filter((option) =>
              option.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((option) => {
              const count = filteredJobs.filter((job) => {
                const value =
                  filterType === "role"
                    ? job.jobTitle
                    : filterType === "company"
                    ? job.companyName
                    : job.location || "Not Specified";
                return value === option;
              }).length;

              return (
                <div
                  key={option}
                  className="p-3 rounded-lg bg-muted/50 flex justify-between items-center"
                >
                  <span className="font-medium">{option}</span>
                  <span className="text-sm text-muted-foreground">
                    {count} application{count !== 1 ? "s" : ""}
                  </span>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
